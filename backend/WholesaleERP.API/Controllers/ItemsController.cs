using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WholesaleERP.API.Data;
using WholesaleERP.API.Models;

namespace WholesaleERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemsController : ControllerBase
    {
        private readonly ERPDbContext _context;
        private readonly ILogger<ItemsController> _logger;

        public ItemsController(ERPDbContext context, ILogger<ItemsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Items
        [HttpGet]
        public async Task<ActionResult<object>> GetItems(
            [FromQuery] string? search,
            [FromQuery] int? categoryId,
            [FromQuery] bool? lowStock,
            [FromQuery] int page = 1,
            [FromQuery] int limit = 50)
        {
            try
            {
                var query = _context.Items
                    .Include(i => i.Category)
                    .Where(i => i.IsActive)
                    .AsQueryable();

                // Apply search filter
                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(i => i.Name.Contains(search) || i.SKU.Contains(search));
                }

                // Apply category filter
                if (categoryId.HasValue)
                {
                    query = query.Where(i => i.CategoryId == categoryId.Value);
                }

                // Apply low stock filter
                if (lowStock == true)
                {
                    query = query.Where(i => i.Quantity <= i.LowStockThreshold);
                }

                // Get total count for pagination
                var totalCount = await query.CountAsync();

                // Apply pagination
                var items = await query
                    .OrderBy(i => i.Name)
                    .Skip((page - 1) * limit)
                    .Take(limit)
                    .Select(i => new
                    {
                        i.Id,
                        i.Name,
                        i.Description,
                        i.SKU,
                        i.Quantity,
                        i.CostPrice,
                        i.SalePrice,
                        i.LowStockThreshold,
                        i.Unit,
                        i.ImageUrl,
                        i.CategoryId,
                        Category = i.Category != null ? new { i.Category.Id, i.Category.Name, i.Category.Color } : null,
                        i.CreatedAt,
                        i.UpdatedAt,
                        IsLowStock = i.Quantity <= i.LowStockThreshold,
                        ProfitMargin = i.CostPrice == 0 ? 0 : ((i.SalePrice - i.CostPrice) / i.CostPrice) * 100
                    })
                    .ToListAsync();

                return Ok(new
                {
                    Items = items,
                    Pagination = new
                    {
                        Page = page,
                        Limit = limit,
                        Total = totalCount,
                        Pages = (int)Math.Ceiling((double)totalCount / limit)
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving items");
                return StatusCode(500, new { message = "An error occurred while retrieving items" });
            }
        }

        // GET: api/Items/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetItem(int id)
        {
            try
            {
                var item = await _context.Items
                    .Include(i => i.Category)
                    .Where(i => i.Id == id)
                    .Select(i => new
                    {
                        i.Id,
                        i.Name,
                        i.Description,
                        i.SKU,
                        i.Quantity,
                        i.CostPrice,
                        i.SalePrice,
                        i.LowStockThreshold,
                        i.Unit,
                        i.ImageUrl,
                        i.CategoryId,
                        Category = i.Category != null ? new { i.Category.Id, i.Category.Name, i.Category.Color } : null,
                        i.CreatedAt,
                        i.UpdatedAt,
                        IsLowStock = i.Quantity <= i.LowStockThreshold,
                        ProfitMargin = i.CostPrice == 0 ? 0 : ((i.SalePrice - i.CostPrice) / i.CostPrice) * 100
                    })
                    .FirstOrDefaultAsync();

                if (item == null)
                {
                    return NotFound(new { message = "Item not found" });
                }

                return Ok(item);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving item with ID {ItemId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the item" });
            }
        }

        // POST: api/Items
        [HttpPost]
        public async Task<ActionResult<object>> CreateItem(CreateItemRequest request)
        {
            try
            {
                // Validate required fields
                if (string.IsNullOrEmpty(request.Name) || string.IsNullOrEmpty(request.SKU))
                {
                    return BadRequest(new { message = "Name and SKU are required" });
                }

                // Check if SKU already exists
                var existingItem = await _context.Items.FirstOrDefaultAsync(i => i.SKU == request.SKU);
                if (existingItem != null)
                {
                    return BadRequest(new { message = "SKU already exists" });
                }

                // Validate category if provided
                if (request.CategoryId.HasValue)
                {
                    var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId.Value && c.IsActive);
                    if (!categoryExists)
                    {
                        return BadRequest(new { message = "Invalid category" });
                    }
                }

                var item = new Item
                {
                    Name = request.Name,
                    Description = request.Description,
                    SKU = request.SKU,
                    Quantity = request.Quantity,
                    CostPrice = request.CostPrice,
                    SalePrice = request.SalePrice,
                    LowStockThreshold = request.LowStockThreshold ?? 10,
                    Unit = request.Unit,
                    ImageUrl = request.ImageUrl,
                    CategoryId = request.CategoryId
                };

                _context.Items.Add(item);
                await _context.SaveChangesAsync();

                // Return the created item with category information
                var createdItem = await _context.Items
                    .Include(i => i.Category)
                    .Where(i => i.Id == item.Id)
                    .Select(i => new
                    {
                        i.Id,
                        i.Name,
                        i.Description,
                        i.SKU,
                        i.Quantity,
                        i.CostPrice,
                        i.SalePrice,
                        i.LowStockThreshold,
                        i.Unit,
                        i.ImageUrl,
                        i.CategoryId,
                        Category = i.Category != null ? new { i.Category.Id, i.Category.Name, i.Category.Color } : null,
                        i.CreatedAt,
                        i.UpdatedAt,
                        IsLowStock = i.Quantity <= i.LowStockThreshold,
                        ProfitMargin = i.CostPrice == 0 ? 0 : ((i.SalePrice - i.CostPrice) / i.CostPrice) * 100
                    })
                    .FirstOrDefaultAsync();

                return CreatedAtAction(nameof(GetItem), new { id = item.Id }, createdItem);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating item");
                return StatusCode(500, new { message = "An error occurred while creating the item" });
            }
        }

        // PUT: api/Items/5
        [HttpPut("{id}")]
        public async Task<ActionResult<object>> UpdateItem(int id, UpdateItemRequest request)
        {
            try
            {
                var item = await _context.Items.FindAsync(id);
                if (item == null || !item.IsActive)
                {
                    return NotFound(new { message = "Item not found" });
                }

                // Check if SKU already exists (for different item)
                if (!string.IsNullOrEmpty(request.SKU) && request.SKU != item.SKU)
                {
                    var existingItem = await _context.Items.FirstOrDefaultAsync(i => i.SKU == request.SKU && i.Id != id);
                    if (existingItem != null)
                    {
                        return BadRequest(new { message = "SKU already exists" });
                    }
                }

                // Validate category if provided
                if (request.CategoryId.HasValue)
                {
                    var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId.Value && c.IsActive);
                    if (!categoryExists)
                    {
                        return BadRequest(new { message = "Invalid category" });
                    }
                }

                // Update item properties
                if (!string.IsNullOrEmpty(request.Name)) item.Name = request.Name;
                if (request.Description != null) item.Description = request.Description;
                if (!string.IsNullOrEmpty(request.SKU)) item.SKU = request.SKU;
                if (request.Quantity.HasValue) item.Quantity = request.Quantity.Value;
                if (request.CostPrice.HasValue) item.CostPrice = request.CostPrice.Value;
                if (request.SalePrice.HasValue) item.SalePrice = request.SalePrice.Value;
                if (request.LowStockThreshold.HasValue) item.LowStockThreshold = request.LowStockThreshold.Value;
                if (request.Unit != null) item.Unit = request.Unit;
                if (request.ImageUrl != null) item.ImageUrl = request.ImageUrl;
                if (request.CategoryId != null) item.CategoryId = request.CategoryId;

                await _context.SaveChangesAsync();

                // Return updated item with category information
                var updatedItem = await _context.Items
                    .Include(i => i.Category)
                    .Where(i => i.Id == id)
                    .Select(i => new
                    {
                        i.Id,
                        i.Name,
                        i.Description,
                        i.SKU,
                        i.Quantity,
                        i.CostPrice,
                        i.SalePrice,
                        i.LowStockThreshold,
                        i.Unit,
                        i.ImageUrl,
                        i.CategoryId,
                        Category = i.Category != null ? new { i.Category.Id, i.Category.Name, i.Category.Color } : null,
                        i.CreatedAt,
                        i.UpdatedAt,
                        IsLowStock = i.Quantity <= i.LowStockThreshold,
                        ProfitMargin = i.CostPrice == 0 ? 0 : ((i.SalePrice - i.CostPrice) / i.CostPrice) * 100
                    })
                    .FirstOrDefaultAsync();

                return Ok(updatedItem);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating item with ID {ItemId}", id);
                return StatusCode(500, new { message = "An error occurred while updating the item" });
            }
        }

        // DELETE: api/Items/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteItem(int id)
        {
            try
            {
                var item = await _context.Items.FindAsync(id);
                if (item == null || !item.IsActive)
                {
                    return NotFound(new { message = "Item not found" });
                }

                // Soft delete
                item.IsActive = false;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Item deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting item with ID {ItemId}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the item" });
            }
        }

        // GET: api/Items/low-stock
        [HttpGet("low-stock")]
        public async Task<ActionResult<object>> GetLowStockItems()
        {
            try
            {
                var lowStockItems = await _context.Items
                    .Include(i => i.Category)
                    .Where(i => i.IsActive && i.Quantity <= i.LowStockThreshold)
                    .OrderBy(i => i.Quantity)
                    .Select(i => new
                    {
                        i.Id,
                        i.Name,
                        i.SKU,
                        i.Quantity,
                        i.LowStockThreshold,
                        i.Unit,
                        Category = i.Category != null ? new { i.Category.Id, i.Category.Name, i.Category.Color } : null
                    })
                    .ToListAsync();

                return Ok(lowStockItems);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving low stock items");
                return StatusCode(500, new { message = "An error occurred while retrieving low stock items" });
            }
        }
    }

    // DTOs for request/response
    public class CreateItemRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string SKU { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public decimal CostPrice { get; set; }
        public decimal SalePrice { get; set; }
        public decimal? LowStockThreshold { get; set; }
        public string? Unit { get; set; }
        public string? ImageUrl { get; set; }
        public int? CategoryId { get; set; }
    }

    public class UpdateItemRequest
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? SKU { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? CostPrice { get; set; }
        public decimal? SalePrice { get; set; }
        public decimal? LowStockThreshold { get; set; }
        public string? Unit { get; set; }
        public string? ImageUrl { get; set; }
        public int? CategoryId { get; set; }
    }
}