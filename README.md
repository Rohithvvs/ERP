# Wholesale ERP - Mobile-First Business Management System

A comprehensive ERP web application designed specifically for wholesale businesses, optimized for mobile usage with a modern, responsive interface.

## 🏗️ Architecture

### Backend (.NET Core 8 Web API)
- **Framework**: ASP.NET Core 8.0 Web API
- **Database**: Microsoft SQL Server with Entity Framework Core
- **Authentication**: JWT Bearer tokens
- **Documentation**: Swagger/OpenAPI
- **Logging**: Serilog with file and console output
- **Validation**: FluentValidation
- **Mapping**: AutoMapper (configured for future use)

### Frontend (React.js with JSX)
- **Framework**: React 18 with JavaScript (JSX)
- **Build Tool**: Vite for fast development and builds
- **Styling**: Tailwind CSS with mobile-first design
- **Routing**: React Router DOM
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Axios for API communication
- **UI Components**: Lucide React icons
- **Notifications**: React Hot Toast
- **PWA**: Progressive Web App capabilities with Vite PWA plugin

## ✨ Core Features

### 📦 Inventory Management
- Add/update items with quantity, cost/sale price, and categories
- SKU-based tracking system
- Low stock alerts and thresholds
- Category-based organization with color coding
- Search and filter capabilities
- Profit margin calculations

### 🧾 Invoice Generation
- Create professional invoices with PDF export
- Include taxes, discounts, and multiple items
- Customer information integration
- Invoice status tracking (Draft, Sent, Paid, Overdue)
- Payment tracking and remaining balance calculation

### 👥 Customer Management
- Comprehensive customer database
- Contact information and address management
- Credit limit tracking
- Outstanding balance monitoring
- Purchase history and order tracking

### 🛒 Purchase & Supplier Management
- Record stock purchases from suppliers
- Track delivery dates and received quantities
- Payment status monitoring (Unpaid, Partially Paid, Paid)
- Supplier contact information management
- Purchase order status tracking

### 📊 Reports & Dashboard
- Real-time dashboard with key metrics
- Daily/Monthly sales summaries
- Inventory status and low stock alerts
- Profit analysis and revenue tracking
- Recent activity monitoring

### 📱 Mobile-First UI
- Responsive design optimized for mobile devices
- Touch-friendly interface with proper target sizes
- Bottom navigation for easy thumb access
- Swipe gestures and mobile-specific interactions
- PWA support for app-like experience
- Offline capability indicators

## 🚀 Getting Started

### Prerequisites
- **.NET 8 SDK** - [Download here](https://dotnet.microsoft.com/download/dotnet/8.0)
- **SQL Server** (LocalDB, Express, or Full)
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager

### Backend Setup (.NET Core API)

1. **Navigate to the backend directory:**
   ```bash
   cd backend/WholesaleERP.API
   ```

2. **Restore NuGet packages:**
   ```bash
   dotnet restore
   ```

3. **Update the database connection string** in `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=WholesaleERPDb;Trusted_Connection=true;MultipleActiveResultSets=true;TrustServerCertificate=true"
     }
   }
   ```

4. **Run database migrations:**
   ```bash
   dotnet ef database update
   ```

5. **Start the API server:**
   ```bash
   dotnet run
   ```

The API will be available at `https://localhost:5000` and `http://localhost:5001`

### Frontend Setup (React.js)

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

### Running Both Applications

From the root directory, you can start both applications simultaneously:

```bash
npm run dev
```

This will start both the .NET Core API (backend) and React frontend concurrently.

## 📁 Project Structure

```
wholesale-erp/
├── backend/
│   └── WholesaleERP.API/
│       ├── Controllers/          # API Controllers
│       ├── Data/                 # Entity Framework DbContext
│       ├── Models/               # Entity models
│       ├── Program.cs            # Application entry point
│       ├── appsettings.json      # Configuration
│       └── WholesaleERP.API.csproj
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable React components
│   │   │   └── layout/          # Layout components
│   │   ├── pages/               # Page components
│   │   ├── App.jsx              # Main App component
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Global styles
│   ├── public/                  # Static assets
│   ├── index.html               # HTML template
│   ├── package.json             # Frontend dependencies
│   ├── vite.config.js           # Vite configuration
│   └── tailwind.config.js       # Tailwind CSS configuration
├── package.json                 # Root package.json for scripts
└── README.md                    # This file
```

## 🛠️ API Endpoints

### Items (Inventory)
- `GET /api/items` - Get all items with filtering and pagination
- `GET /api/items/{id}` - Get specific item
- `POST /api/items` - Create new item
- `PUT /api/items/{id}` - Update item
- `DELETE /api/items/{id}` - Soft delete item
- `GET /api/items/low-stock` - Get low stock items

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Additional Controllers
The application includes controllers for Customers, Suppliers, Invoices, and Purchases following similar RESTful patterns.

## 🔧 Configuration

### Database Configuration
Update the connection string in `backend/WholesaleERP.API/appsettings.json` to match your SQL Server setup:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=your-server;Database=WholesaleERPDb;Trusted_Connection=true;MultipleActiveResultSets=true;TrustServerCertificate=true"
  }
}
```

### JWT Configuration
Configure JWT settings in `appsettings.json`:

```json
{
  "Jwt": {
    "Key": "your-super-secret-key-change-in-production",
    "Issuer": "WholesaleERP",
    "Audience": "WholesaleERP-Users",
    "ExpiryMinutes": 1440
  }
}
```

### CORS Configuration
The API is configured to allow requests from the frontend development server. Update CORS settings in `Program.cs` for production deployment.

## 📱 Mobile Features

- **Touch Optimized**: All interactive elements meet the 44px minimum touch target size
- **Responsive Design**: Adapts seamlessly from mobile to desktop
- **Bottom Navigation**: Easy thumb access on mobile devices
- **Swipe Gestures**: Natural mobile interactions
- **PWA Ready**: Can be installed as a native app
- **Offline Indicators**: Shows connection status
- **Safe Area Support**: Respects device notches and rounded corners

## 🚀 Deployment

### Backend Deployment
1. Build the application:
   ```bash
   dotnet build --configuration Release
   ```

2. Publish the application:
   ```bash
   dotnet publish --configuration Release --output ./publish
   ```

3. Deploy to your preferred hosting service (IIS, Azure App Service, etc.)

### Frontend Deployment
1. Build the frontend:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your web server or CDN

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Future Enhancements

- **Barcode Scanning**: Mobile barcode scanning for inventory
- **Push Notifications**: Real-time alerts for low stock and payments
- **Multi-language Support**: Internationalization
- **Advanced Reporting**: Charts and analytics dashboard
- **Email Integration**: Automated invoice sending
- **Multi-location Support**: Multiple warehouse management
- **Role-based Access Control**: User permissions and roles
- **API Rate Limiting**: Enhanced security and performance
- **Audit Logging**: Comprehensive activity tracking

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ for wholesale businesses everywhere**
