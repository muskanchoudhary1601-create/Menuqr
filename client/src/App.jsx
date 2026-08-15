import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Features from './pages/Features';
import PricingPage from './pages/PricingPage';
import HowItWorks from './pages/HowItWorks';
import Contact from './pages/Contact';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import RestaurantProfile from './pages/RestaurantProfile';
import MenuCategories from './pages/MenuCategories';
import MenuItems from './pages/MenuItems';
import PublicMenu from './pages/PublicMenu';
import QrCodePage from './pages/QrCodePage';
import QrPrint from './pages/QrPrint';
import ThemeSettings from './pages/ThemeSettings';
import Analytics from './pages/Analytics';
import Billing from './pages/Billing';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/restaurant"
            element={
              <ProtectedRoute>
                <RestaurantProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/menu/categories"
            element={
              <ProtectedRoute>
                <MenuCategories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/menu/items"
            element={
              <ProtectedRoute>
                <MenuItems />
              </ProtectedRoute>
            }
          />
          <Route
            path="/qr-code"
            element={
              <ProtectedRoute>
                <QrCodePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/qr-code/print"
            element={
              <ProtectedRoute>
                <QrPrint />
              </ProtectedRoute>
            }
          />
          <Route
            path="/theme"
            element={
              <ProtectedRoute>
                <ThemeSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/billing"
            element={
              <ProtectedRoute>
                <Billing />
              </ProtectedRoute>
            }
          />
          {/* Public digital menu — no auth. React Router ranks static
              segments (e.g. /menu/categories) above this dynamic one, so
              there's no collision with the routes above. */}
          <Route path="/menu/:restaurantSlug" element={<PublicMenu />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
