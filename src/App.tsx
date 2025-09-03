import React from 'react';
import { useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import SellerAuth from './components/SellerAuth';
import VendorAuth from './components/VendorAuth';
import SellerDashboard from './components/SellerDashboard';
import LoadingSpinner from './components/LoadingSpinner';
import EnhancedVendorDashboard from './components/EnhancedVendorDashboard';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
  if (isLoading) {
    return <LoadingSpinner />;
  }
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is logged in, show appropriate dashboard
  if (user) {
    if (user.userType === 'supplier') {
      return <SellerDashboard />;
    // Determine user type from Auth0 metadata or default behavior
    const userMetadata = user['https://trustsupply.app/user_metadata'] || {};
    const detectedUserType = userMetadata.user_type || 'vendor';
    
    if (detectedUserType === 'vendor') {
      return <EnhancedVendorDashboard />;
    } else {
      return <SellerDashboard />;
    }
  }

  if (showAuth && userType) {
    } else if (user.userType === 'vendor') {
      return <SellerAuth onBack={() => setShowAuth(false)} />;
    }
  }

  const handleSelectUserType = (type: 'vendor' | 'supplier') => {
    setUserType(type);
    setShowAuth(true);
  };

  return <LandingPage onSelectUserType={handleSelectUserType} />;
}

export default App;


export default App;