import { ReactNode, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { 
  Home, 
  Package, 
  Users, 
  FileText, 
  ShoppingCart, 
  BarChart3,
  Menu,
  X,
  Bell,
  Settings
} from 'lucide-react'

interface MobileLayoutProps {
  children: ReactNode
}

interface NavItem {
  path: string
  label: string
  icon: ReactNode
}

const navigationItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
  { path: '/inventory', label: 'Inventory', icon: <Package size={20} /> },
  { path: '/customers', label: 'Customers', icon: <Users size={20} /> },
  { path: '/invoices', label: 'Invoices', icon: <FileText size={20} /> },
  { path: '/reports', label: 'Reports', icon: <BarChart3 size={20} /> },
]

const moreItems: NavItem[] = [
  { path: '/suppliers', label: 'Suppliers', icon: <ShoppingCart size={20} /> },
  { path: '/purchases', label: 'Purchases', icon: <ShoppingCart size={20} /> },
  { path: '/categories', label: 'Categories', icon: <Package size={20} /> },
]

export default function MobileLayout({ children }: MobileLayoutProps) {
  const location = useLocation()
  const [showSidebar, setShowSidebar] = useState(false)
  const [notifications] = useState(3) // Placeholder for notification count

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') return true
    return location.pathname.startsWith(path)
  }

  const getPageTitle = () => {
    const currentPath = location.pathname
    if (currentPath === '/' || currentPath === '/dashboard') return 'Dashboard'
    
    const navItem = [...navigationItems, ...moreItems].find(item => 
      currentPath.startsWith(item.path)
    )
    return navItem?.label || 'ERP'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowSidebar(true)}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {getPageTitle()}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <Bell size={20} />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-danger-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </button>
            
            {/* Settings */}
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowSidebar(false)} />
          <div className="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button 
                onClick={() => setShowSidebar(false)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            
            <nav className="p-4 space-y-2">
              {[...navigationItems, ...moreItems].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setShowSidebar(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom">
        <div className="grid grid-cols-5 h-16">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive(item.path)
                  ? 'text-primary-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}