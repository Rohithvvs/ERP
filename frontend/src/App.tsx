import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import MobileLayout from './components/layout/MobileLayout'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import ItemForm from './pages/ItemForm'
import Categories from './pages/Categories'
import Customers from './pages/Customers'
import CustomerForm from './pages/CustomerForm'
import Suppliers from './pages/Suppliers'
import Invoices from './pages/Invoices'
import InvoiceForm from './pages/InvoiceForm'
import Purchases from './pages/Purchases'
import Reports from './pages/Reports'
import './App.css'

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div className="App min-h-screen bg-gray-50">
      {!isOnline && (
        <div className="bg-warning-600 text-white text-center py-2 text-sm font-medium">
          You're currently offline. Some features may be limited.
        </div>
      )}
      
      <MobileLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Inventory Routes */}
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventory/new" element={<ItemForm />} />
          <Route path="/inventory/:id/edit" element={<ItemForm />} />
          <Route path="/categories" element={<Categories />} />
          
          {/* Customer Routes */}
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/new" element={<CustomerForm />} />
          <Route path="/customers/:id/edit" element={<CustomerForm />} />
          
          {/* Supplier Routes */}
          <Route path="/suppliers" element={<Suppliers />} />
          
          {/* Invoice Routes */}
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/invoices/new" element={<InvoiceForm />} />
          <Route path="/invoices/:id/edit" element={<InvoiceForm />} />
          
          {/* Purchase Routes */}
          <Route path="/purchases" element={<Purchases />} />
          
          {/* Reports */}
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </MobileLayout>
    </div>
  )
}

export default App