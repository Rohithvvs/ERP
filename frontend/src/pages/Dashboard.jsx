import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Package, 
  Users, 
  FileText, 
  DollarSign, 
  AlertTriangle,
  Plus,
  TrendingUp,
  ShoppingCart
} from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    totalCustomers: 0,
    pendingInvoices: 0,
    monthlyRevenue: 0,
    todaysSales: 0
  })
  const [lowStockItems, setLowStockItems] = useState([])
  const [recentInvoices, setRecentInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Simulate API calls - replace with actual API endpoints
      // In a real app, you'd make calls to your .NET Core API
      
      // Mock data for demonstration
      setTimeout(() => {
        setStats({
          totalItems: 156,
          lowStockItems: 12,
          totalCustomers: 89,
          pendingInvoices: 5,
          monthlyRevenue: 45230.50,
          todaysSales: 2850.75
        })
        
        setLowStockItems([
          { id: 1, name: 'iPhone 14 Pro', sku: 'IP14P-001', quantity: 3, threshold: 10, unit: 'pcs' },
          { id: 2, name: 'Samsung Galaxy S23', sku: 'SGS23-001', quantity: 1, threshold: 5, unit: 'pcs' },
          { id: 3, name: 'MacBook Pro 16"', sku: 'MBP16-001', quantity: 2, threshold: 8, unit: 'pcs' },
        ])
        
        setRecentInvoices([
          { id: 1, number: 'INV-2024-001', customer: 'Tech Solutions Ltd', amount: 2500.00, status: 'Paid' },
          { id: 2, number: 'INV-2024-002', customer: 'Digital Commerce Inc', amount: 1850.50, status: 'Pending' },
          { id: 3, number: 'INV-2024-003', customer: 'Mobile Store Chain', amount: 3200.75, status: 'Sent' },
        ])
        
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setLoading(false)
    }
  }

  const quickActions = [
    { 
      title: 'Add Item', 
      icon: <Package size={20} />, 
      path: '/inventory/new',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    { 
      title: 'New Invoice', 
      icon: <FileText size={20} />, 
      path: '/invoices/new',
      color: 'bg-green-500 hover:bg-green-600'
    },
    { 
      title: 'Add Customer', 
      icon: <Users size={20} />, 
      path: '/customers/new',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    { 
      title: 'Purchase Order', 
      icon: <ShoppingCart size={20} />, 
      path: '/purchases/new',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="p-4 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Customers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Sales</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.todaysSales)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingInvoices}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className={`flex flex-col items-center justify-center p-4 rounded-lg text-white transition-colors ${action.color}`}
            >
              {action.icon}
              <span className="text-sm font-medium mt-2">{action.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Low Stock Alert */}
      {stats.lowStockItems > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <h3 className="text-sm font-semibold text-red-800">Low Stock Alert</h3>
          </div>
          <p className="text-sm text-red-700 mb-3">
            {stats.lowStockItems} items are running low on stock
          </p>
          <div className="space-y-2">
            {lowStockItems.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">
                    {item.quantity} {item.unit}
                  </p>
                  <p className="text-xs text-gray-500">Min: {item.threshold}</p>
                </div>
              </div>
            ))}
          </div>
          <Link 
            to="/inventory?lowStock=true"
            className="block w-full text-center mt-3 py-2 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 transition-colors"
          >
            View All Low Stock Items
          </Link>
        </div>
      )}

      {/* Recent Invoices */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
          <Link 
            to="/invoices"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {recentInvoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{invoice.number}</p>
                <p className="text-sm text-gray-600">{invoice.customer}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{formatCurrency(invoice.amount)}</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                  invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {invoice.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Revenue */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100">Monthly Revenue</p>
            <p className="text-3xl font-bold">{formatCurrency(stats.monthlyRevenue)}</p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm">+12.5% from last month</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}