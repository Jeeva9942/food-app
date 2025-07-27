import React from 'react';
import { useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import SellerAuth from './components/SellerAuth';
import VendorAuth from './components/VendorAuth';
import SellerDashboard from './components/SellerDashboard';
import EnhancedVendorDashboard from './components/EnhancedVendorDashboard';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is logged in, show appropriate dashboard
  if (user) {
    if (user.userType === 'supplier') {
      return <SellerDashboard />;
    } else if (user.userType === 'vendor') {
      return <EnhancedVendorDashboard />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingPage />
    </div>
  );
}

export default App;