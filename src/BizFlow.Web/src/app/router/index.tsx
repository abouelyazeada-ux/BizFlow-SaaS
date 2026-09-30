import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Login } from '../../features/auth/Login';
import { Register } from '../../features/auth/Register';
import { useAuthStore } from '../../stores/authStore';

import React, { lazy } from 'react';

const CustomersPage = lazy(() => import('../../features/customers/pages/CustomersPage').then(m => ({ default: m.CustomersPage })));
const CustomerDetailsPage = lazy(() => import('../../features/customers/pages/CustomerDetailsPage').then(m => ({ default: m.CustomerDetailsPage })));
const ProductsPage = lazy(() => import('../../features/products/pages/ProductsPage').then(m => ({ default: m.ProductsPage })));
const ProductDetailsPage = lazy(() => import('../../features/products/pages/ProductDetailsPage').then(m => ({ default: m.ProductDetailsPage })));
const InvoicesPage = lazy(() => import('../../features/invoices/pages/InvoicesPage').then(m => ({ default: m.InvoicesPage })));
const InvoiceDetailsPage = lazy(() => import('../../features/invoices/pages/InvoiceDetailsPage').then(m => ({ default: m.InvoiceDetailsPage })));
const CreateInvoicePage = lazy(() => import('../../features/invoices/pages/CreateInvoicePage').then(m => ({ default: m.CreateInvoicePage })));
const DashboardPage = lazy(() => import('../../features/dashboard/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ProfilePage = lazy(() => import('../../features/account/pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() => import('../../features/account/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const NotificationsPage = lazy(() => import('../../features/account/pages/NotificationsPage').then(m => ({ default: m.NotificationsPage })));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);

  console.log('PROTECTED ROUTE: 8. hasHydrated', hasHydrated);
  console.log('PROTECTED ROUTE: 9. isAuthenticated', isAuthenticated);
  console.log('PROTECTED ROUTE: 10. token exists', !!token);
  console.log('PROTECTED ROUTE: 11. current pathname', window.location.pathname);

  if (!hasHydrated) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">Loading session...</div>;
  if (!isAuthenticated) {
    console.log('PROTECTED ROUTE: 12. Navigate("/login") is executed');
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  console.log('PUBLIC ROUTE: 13. hasHydrated', hasHydrated);
  console.log('PUBLIC ROUTE: 14. isAuthenticated', isAuthenticated);
  console.log('PUBLIC ROUTE: 15. current pathname', window.location.pathname);

  if (!hasHydrated) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">Loading session...</div>;
  if (isAuthenticated) {
    console.log('PUBLIC ROUTE: 16. redirect away from login happens');
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/customers', element: <CustomersPage /> },
      { path: '/customers/:id', element: <CustomerDetailsPage /> },
      { path: '/products', element: <ProductsPage /> },
      { path: '/products/:id', element: <ProductDetailsPage /> },
      { path: '/invoices', element: <InvoicesPage /> },
      { path: '/invoices/new', element: <CreateInvoicePage /> },
      { path: '/invoices/:id', element: <InvoiceDetailsPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/settings', element: <SettingsPage /> },
      { path: '/notifications', element: <NotificationsPage /> },
    ]
  },
  {
    element: <PublicRoute><AuthLayout /></PublicRoute>,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
    ]
  }
]);
