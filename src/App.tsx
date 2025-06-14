import { Routes, Route, Navigate } from 'react-router-dom'
import { Theme } from '@radix-ui/themes'
import DashboardLayout from './components/DashboardLayout'
import Dashboard from './pages/dashboard/Dashboard'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Profile from './pages/dashboard/Profile'
import Settings from './pages/dashboard/Settings'
import Forms from './pages/dashboard/Forms'
import Users from './pages/dashboard/Users'
import Products from './pages/dashboard/Products'
import Orders from './pages/dashboard/Orders'
import Analytics from './pages/dashboard/Analytics'
import Transactions from './pages/dashboard/Transactions'
import Tracking from './pages/dashboard/Tracking'
import NotFound from './pages/errors/NotFound'
import ServerError from './pages/errors/ServerError'
import { ThemeProvider, useTheme } from './lib/theme-context'
import { AuthProvider, ProtectedRoute, useAuth } from './lib/auth-context'
import { ToastProvider } from './components/notifications/toast-context'
import { ErrorBoundary } from './components/ui/ErrorBoundary'

function AppRoutes() {
  const { themeConfig, getSystemTheme } = useTheme()
  const { isAuthenticated } = useAuth()
  
  // Determine the actual appearance based on theme
  const getAppearance = () => {
    return themeConfig.appearance === 'inherit' ? getSystemTheme() : themeConfig.appearance
  }
  
  return (
    <Theme 
      accentColor={themeConfig.accentColor as any} 
      grayColor={themeConfig.grayColor as any} 
      radius={themeConfig.radius as any || "medium"} 
      scaling="100%"
      appearance={getAppearance()}
      hasBackground={themeConfig.hasBackground}
    >
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/500" element={<ServerError />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="forms" element={<Forms />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="tracking" element={<Tracking />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Theme>
  )
}

function App() {
  return (
    <ErrorBoundary showErrorDetails={true}>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App