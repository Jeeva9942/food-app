import React, { useState } from 'react';
import { LogOut, Search, Star, MapPin, Filter, ShoppingCart, Bell, User } from 'lucide-react';

type Props = {
  user: any;
  onLogout: () => void;
};

const VendorDashboard: React.FC<Props> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('suppliers');
  const [searchTerm, setSearchTerm] = useState('');

  const suppliers = [
    {
      id: 1,
      name: 'Fresh Produce Co.',
      rating: 4.8,
      location: 'Azadpur Mandi, Delhi',
      products: ['Vegetables', 'Fruits', 'Herbs'],
      price: '₹50-200/kg',
      verified: true,
      distance: '2.5 km',
      orders: 45,
    },
    {
      id: 2,
      name: 'Spice Masters Ltd.',
      rating: 4.9,
      location: 'Khari Baoli, Delhi',
      products: ['Spices', 'Masalas', 'Dry Fruits'],
      price: '₹80-500/kg',
      verified: true,
      distance: '4.1 km',
      orders: 32,
    },
    {
      id: 3,
      name: 'Grain & Pulse Traders',
      rating: 4.6,
      location: 'Najafgarh, Delhi',
      products: ['Rice', 'Wheat', 'Lentils'],
      price: '₹30-120/kg',
      verified: true,
      distance: '8.3 km',
      orders: 67,
    },
  ];

  const recentOrders = [
    { id: '001', supplier: 'Fresh Produce Co.', items: 'Onions, Tomatoes, Potatoes', amount: '₹850', status: 'Delivered', date: '2 days ago' },
    { id: '002', supplier: 'Spice Masters Ltd.', items: 'Garam Masala, Cumin, Coriander', amount: '₹320', status: 'In Transit', date: '3 days ago' },
    { id: '003', supplier: 'Grain & Pulse Traders', items: 'Basmati Rice, Toor Dal', amount: '₹1,200', status: 'Processing', date: '5 days ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Vendor Dashboard</h1>
                <p className="text-sm text-gray-600">{user.businessName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded-full">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800 font-medium">{user.location}</span>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-5 w-5" />
              </button>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
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
          <nav className="flex space-x-8">
            {[
              { id: 'suppliers', label: 'Find Suppliers' },
              { id: 'orders', label: 'My Orders' },
              { id: 'favorites', label: 'Favorites' },
              { id: 'profile', label: 'Profile' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Suppliers Tab */}
        {activeTab === 'suppliers' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search suppliers, products, or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="h-5 w-5" />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {/* Suppliers Grid */}
            <div className="grid gap-6">
              {suppliers.map((supplier) => (
                <div key={supplier.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">{supplier.name}</h3>
                        {supplier.verified && (
                          <div className="bg-green-100 px-2 py-1 rounded-full flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-800 font-medium">FSSAI Verified</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{supplier.rating} ({supplier.orders} orders)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{supplier.distance}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Products: </span>
                          <span className="font-medium">{supplier.products.join(', ')}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Price Range: </span>
                          <span className="font-medium text-green-600">{supplier.price}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mt-2">{supplier.location}</p>
                    </div>
                    
                    <div className="mt-4 lg:mt-0 lg:ml-6 flex space-x-3">
                      <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                        View Details
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Contact Supplier
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Supplier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.supplier}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.items}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Vendor Profile</h3>
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                  <User className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <p className="text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                    <p className="text-gray-900">{user.businessName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-gray-900">{user.phone}</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <p className="text-gray-900">{user.location}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Food Type</label>
                    <p className="text-gray-900">{user.foodType}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800">Email verified - Ready to connect with suppliers!</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs content */}
        {activeTab === 'favorites' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Favorite Suppliers</h3>
            <p className="text-gray-600">Your favorite suppliers will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;