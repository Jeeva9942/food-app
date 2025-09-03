import React from 'react';
import { ShoppingCart, Store, Shield, Star, Users, TrendingUp, LogIn } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';

const LandingPage: React.FC = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  const handleVendorLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup',
        user_type: 'vendor'
      }
    });
  };

  const handleSupplierLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup',
        user_type: 'supplier'
      }
    });
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-blue-500 p-3 rounded-xl shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                  TrustSupply
                </h1>
                <p className="text-sm text-gray-600 font-medium">Trusted Raw Materials for Street Food</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Features</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">About</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/20 to-blue-100/20"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Connect with <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Verified Suppliers</span>
              <br />
              Build <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Trusted Partnerships</span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              India's first platform connecting street food vendors with FSSAI-verified raw material suppliers. 
              Get the best prices, ensure quality, and build lasting business relationships.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 mb-16 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="font-medium">FSSAI Verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-medium">10,000+ Vendors</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-600" />
                <span className="font-medium">4.8/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <span className="font-medium">₹2Cr+ Transactions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Login Options */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Path</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of vendors and suppliers already transforming their business
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Vendor Card */}
            <div className="group relative bg-white p-8 rounded-3xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-2xl w-20 h-20 mx-auto mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ShoppingCart className="h-10 w-10 text-blue-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Street Food Vendor</h3>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  Find trusted suppliers, compare prices, and get the best raw materials for your street food business.
                </p>
                
                <ul className="text-left space-y-4 mb-8">
                  <li className="flex items-center text-gray-700">
                    <div className="bg-yellow-100 p-1 rounded-full mr-3">
                      <Star className="h-4 w-4 text-yellow-600" />
                    </div>
                    <span>Access verified suppliers with ratings</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="bg-green-100 p-1 rounded-full mr-3">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <span>Compare prices across multiple suppliers</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="bg-blue-100 p-1 rounded-full mr-3">
                      <Shield className="h-4 w-4 text-blue-600" />
                    </div>
                    <span>Ensure quality with FSSAI verification</span>
                  </li>
                </ul>
                
                <button
                  onClick={handleVendorLogin}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Join as Vendor</span>
                </button>
              </div>
            </div>

            {/* Supplier Card */}
            <div className="group relative bg-white p-8 rounded-3xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-6 rounded-2xl w-20 h-20 mx-auto mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Store className="h-10 w-10 text-orange-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Raw Material Supplier</h3>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  Connect with street food vendors, showcase your products, and grow your business network.
                </p>
                
                <ul className="text-left space-y-4 mb-8">
                  <li className="flex items-center text-gray-700">
                    <div className="bg-purple-100 p-1 rounded-full mr-3">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <span>Reach thousands of potential customers</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="bg-green-100 p-1 rounded-full mr-3">
                      <Shield className="h-4 w-4 text-green-600" />
                    </div>
                    <span>Build trust with FSSAI verification</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="bg-blue-100 p-1 rounded-full mr-3">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                    </div>
                    <span>Increase sales with bulk orders</span>
                  </li>
                </ul>
                
                <button
                  onClick={handleSupplierLogin}
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Join as Supplier</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Why Choose TrustSupply?
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built specifically for India's street food ecosystem with features that matter most
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-10 w-10 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">FSSAI Verified</h4>
              <p className="text-gray-600 leading-relaxed">All suppliers are verified with valid FSSAI certificates and quality standards for your peace of mind</p>
            </div>
            
            <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-10 w-10 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Best Prices</h4>
              <p className="text-gray-600 leading-relaxed">Compare prices across suppliers and access bulk purchase discounts to maximize your profit margins</p>
            </div>
            
            <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Star className="h-10 w-10 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Peer Reviews</h4>
              <p className="text-gray-600 leading-relaxed">Real reviews from fellow vendors help you make informed decisions and find the best suppliers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Active Vendors</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">5,000+</div>
              <div className="text-blue-100">Verified Suppliers</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">₹2Cr+</div>
              <div className="text-blue-100">Monthly Transactions</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">4.8/5</div>
              <div className="text-blue-100">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-blue-500 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">TrustSupply</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Empowering India's street food vendors with trusted supplier networks. 
                Building bridges between quality suppliers and passionate food entrepreneurs.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Vendors</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Find Suppliers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compare Prices</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bulk Orders</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Quality Assurance</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Suppliers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Get Verified</a></li>
                <li><a href="#" className="hover:text-white transition-colors">List Products</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Manage Orders</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TrustSupply. All rights reserved. Made with ❤️ for India's street food community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;