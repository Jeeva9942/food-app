import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import SellerDashboard from './components/SellerDashboard';
import EnhancedVendorDashboard from './components/EnhancedVendorDashboard';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { user, loading } = useAuth();
  const { isLoading } = useAuth0();

  if (loading || isLoading) {
    return <LoadingSpinner />;
  }

  // If user is logged in, show appropriate dashboard
  if (user) {
    if (user.userType === 'supplier') {
      return <SellerDashboard user={user} onLogout={() => {}} />;
    } else {
      return <EnhancedVendorDashboard />;
    }
  }

  return <LandingPage />;
}

export default App;