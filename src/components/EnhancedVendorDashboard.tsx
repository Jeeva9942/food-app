import React, { useState, useEffect } from 'react';
import { LogOut, Search, Star, MapPin, Filter, ShoppingCart, Bell, User, GitCompare as Compare, Heart, Package, TrendingUp, Award, Phone, Mail, Eye, ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SupplierComparison from './SupplierComparison';

interface Supplier {
  _id: string;
  profile: {
    businessName: string;
    phone: string;
    location: {
      coordinates: [number, number];
    };
    products: string[];
    fssaiNumber: string;
  };
  rating: {
    average: number;
    count: number;
  };
  verified: boolean;
  email: string;
  products: any[];
  recentReviews: any[];
}

const EnhancedVendorDashboard: React.FC = () => {
  const { user, logout, token } = useAuth();
  const [activeTab, setActiveTab] = useState('suppliers');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    minRating: 0,
    maxDistance: 50,
    verified: false,
    priceRange: { min: 0, max: 1000 }
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchSuppliers();
    loadFavorites();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [suppliers, searchTerm, filters]);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(`${API_URL}/suppliers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (response.ok) {
        setSuppliers(data.suppliers);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    const savedFavorites = localStorage.getItem(`favorites_${user?.id}`);
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  };

  const applyFilters = () => {
    let filtered = suppliers.filter(supplier => {
      // Search filter
      const matchesSearch = !searchTerm || 
        supplier.profile.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.profile.products.some(product => 
          product.toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Category filter
      const matchesCategory = !filters.category || 
        supplier.profile.products.includes(filters.category);

      // Rating filter
      const matchesRating = supplier.rating.average >= filters.minRating;

      // Verified filter
      const matchesVerified = !filters.verified || supplier.verified;

      return matchesSearch && matchesCategory && matchesRating && matchesVerified;
    });

    setFilteredSuppliers(filtered);
  };

  const toggleFavorite = (supplierId: string) => {
    const newFavorites = favorites.includes(supplierId)
      ? favorites.filter(id => id !== supplierId)
      : [...favorites, supplierId];
    
    setFavorites(newFavorites);
    localStorage.setItem(`favorites_${user?.id}`, JSON.stringify(newFavorites));
  };

  const toggleSupplierSelection = (supplierId: string) => {
    setSelectedSuppliers(prev => 
      prev.includes(supplierId)
        ? prev.filter(id => id !== supplierId)
        : [...prev, supplierId]
    );
  };

  const handleCompare = () => {
    if (selectedSuppliers.length >= 2) {
      setShowComparison(true);
    }
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minRating: 0,
      maxDistance: 50,
      verified: false,
      priceRange: { min: 0, max: 1000 }
    });
    setSearchTerm('');
  };

  const categories = ['Vegetables', 'Fruits', 'Spices', 'Grains', 'Dairy', 'Meat', 'Oil', 'Other'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TrustSupply Vendor</h1>
                <p className="text-sm text-gray-600">{user?.profile?.businessName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {selectedSuppliers.length > 0 && (
                <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                  <Compare className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-800 font-medium">
                    {selectedSuppliers.length} selected
                  </span>
                  {selectedSuppliers.length >= 2 && (
                    <button
                      onClick={handleCompare}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                    >
                      Compare
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedSuppliers([])}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800 font-medium">{user?.profile?.location}</span>
              </div>
              
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </button>
              
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            {[
              { id: 'suppliers', label: 'Find Suppliers', icon: Search },
              { id: 'orders', label: 'My Orders', icon: Package },
              { id: 'favorites', label: 'Favorites', icon: Heart },
              { id: 'profile', label: 'Profile', icon: User },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Suppliers Tab */}
        {activeTab === 'suppliers' && (
          <div className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search suppliers, products, or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center space-x-2 px-4 py-3 border rounded-lg transition-colors ${
                      showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <SlidersHorizontal className="h-5 w-5" />
                    <span>Filters</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {(searchTerm || filters.category || filters.minRating > 0 || filters.verified) && (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={filters.category}
                        onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Rating: {filters.minRating}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.5"
                        value={filters.minRating}
                        onChange={(e) => setFilters(prev => ({ ...prev, minRating: parseFloat(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Distance: {filters.maxDistance}km
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={filters.maxDistance}
                        onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="flex items-center space-x-2 mt-6">
                        <input
                          type="checkbox"
                          checked={filters.verified}
                          onChange={(e) => setFilters(prev => ({ ...prev, verified: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">FSSAI Verified Only</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Found {filteredSuppliers.length} suppliers
                {searchTerm && ` for "${searchTerm}"`}
              </p>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Highest Rated</option>
                  <option>Nearest</option>
                  <option>Most Reviews</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>

            {/* Suppliers Grid */}
            <div className="grid gap-6">
              {filteredSuppliers.map((supplier) => (
                <div key={supplier._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={selectedSuppliers.includes(supplier._id)}
                              onChange={() => toggleSupplierSelection(supplier._id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                              <span>{supplier.profile.businessName}</span>
                              {supplier.verified && (
                                <Award className="h-5 w-5 text-green-600" title="FSSAI Verified" />
                              )}
                            </h3>
                            <p className="text-sm text-gray-600">FSSAI: {supplier.profile.fssaiNumber}</p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => toggleFavorite(supplier._id)}
                          className={`p-2 rounded-full transition-colors ${
                            favorites.includes(supplier._id)
                              ? 'text-red-500 bg-red-50 hover:bg-red-100'
                              : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <Heart className={`h-5 w-5 ${favorites.includes(supplier._id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{supplier.rating.average.toFixed(1)}</span>
                          <span className="text-gray-600">({supplier.rating.count} reviews)</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">2.5 km away</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{supplier.products.length} products</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-green-600 font-medium">₹50-500/kg</span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Products:</strong> {supplier.profile.products.join(', ')}
                        </p>
                        
                        {supplier.recentReviews.length > 0 && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Latest Review:</p>
                            <p className="text-sm text-gray-700 italic">
                              "{supplier.recentReviews[0].comment?.substring(0, 100)}..."
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Phone className="h-4 w-4" />
                          <span>{supplier.profile.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{supplier.email}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col space-y-2 lg:w-48">
                      <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                      <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Phone className="h-4 w-4" />
                        <span>Contact Now</span>
                      </button>
                      <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <ShoppingCart className="h-4 w-4" />
                        <span>Order Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredSuppliers.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
              </div>
            )}
          </div>
        )}

        {/* Other tabs content would go here */}
        {activeTab !== 'suppliers' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
            </h3>
            <p className="text-gray-600">This section is under development.</p>
          </div>
        )}
      </div>

      {/* Supplier Comparison Modal */}
      {showComparison && (
        <SupplierComparison
          supplierIds={selectedSuppliers}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
};

export default EnhancedVendorDashboard;