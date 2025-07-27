import React, { useState, useEffect } from 'react';
import { X, Star, MapPin, Package, TrendingUp, Award, Phone, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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
}

interface ComparisonData {
  supplier: Supplier;
  products: any[];
  totalProducts: number;
  reviewCount: number;
  ratingBreakdown: {
    quality: number;
    delivery: number;
    pricing: number;
    communication: number;
  };
  priceRange: {
    min: number;
    max: number;
  };
}

interface Props {
  supplierIds: string[];
  onClose: () => void;
}

const SupplierComparison: React.FC<Props> = ({ supplierIds, onClose }) => {
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchComparisonData();
  }, [supplierIds]);

  const fetchComparisonData = async () => {
    try {
      const response = await fetch(`${API_URL}/suppliers/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ supplierIds }),
      });

      const data = await response.json();
      if (response.ok) {
        setComparisonData(data.comparison);
      }
    } catch (error) {
      console.error('Error fetching comparison data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-yellow-600';
    if (rating >= 3.5) return 'text-orange-600';
    return 'text-red-600';
  };

  const getBestValue = (values: number[], isHigherBetter: boolean = true) => {
    if (isHigherBetter) {
      return Math.max(...values);
    }
    return Math.min(...values);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center mt-4">Loading comparison...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Supplier Comparison</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900 w-48">
                    Criteria
                  </th>
                  {comparisonData.map((data, index) => (
                    <th key={index} className="text-center py-4 px-4 min-w-64">
                      <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg p-4">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <Package className="h-5 w-5 text-blue-600" />
                          {data.supplier.verified && (
                            <Award className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {data.supplier.profile.businessName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          FSSAI: {data.supplier.profile.fssaiNumber}
                        </p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Overall Rating */}
                <tr>
                  <td className="py-4 px-4 font-medium text-gray-900">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span>Overall Rating</span>
                    </div>
                  </td>
                  {comparisonData.map((data, index) => {
                    const isHighest = data.supplier.rating.average === 
                      getBestValue(comparisonData.map(d => d.supplier.rating.average));
                    return (
                      <td key={index} className="py-4 px-4 text-center">
                        <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full ${
                          isHighest ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          <Star className="h-4 w-4 fill-current" />
                          <span className="font-semibold">
                            {data.supplier.rating.average.toFixed(1)}
                          </span>
                          <span className="text-sm">
                            ({data.supplier.rating.count})
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Quality Rating */}
                <tr>
                  <td className="py-4 px-4 font-medium text-gray-900">Quality Rating</td>
                  {comparisonData.map((data, index) => {
                    const isHighest = data.ratingBreakdown.quality === 
                      getBestValue(comparisonData.map(d => d.ratingBreakdown.quality));
                    return (
                      <td key={index} className="py-4 px-4 text-center">
                        <span className={`font-semibold ${
                          isHighest ? 'text-green-600' : getRatingColor(data.ratingBreakdown.quality)
                        }`}>
                          {data.ratingBreakdown.quality.toFixed(1)}/5
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Delivery Rating */}
                <tr>
                  <td className="py-4 px-4 font-medium text-gray-900">Delivery Rating</td>
                  {comparisonData.map((data, index) => {
                    const isHighest = data.ratingBreakdown.delivery === 
                      getBestValue(comparisonData.map(d => d.ratingBreakdown.delivery));
                    return (
                      <td key={index} className="py-4 px-4 text-center">
                        <span className={`font-semibold ${
                          isHighest ? 'text-green-600' : getRatingColor(data.ratingBreakdown.delivery)
                        }`}>
                          {data.ratingBreakdown.delivery.toFixed(1)}/5
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Pricing Rating */}
                <tr>
                  <td className="py-4 px-4 font-medium text-gray-900">Pricing Rating</td>
                  {comparisonData.map((data, index) => {
                    const isHighest = data.ratingBreakdown.pricing === 
                      getBestValue(comparisonData.map(d => d.ratingBreakdown.pricing));
                    return (
                      <td key={index} className="py-4 px-4 text-center">
                        <span className={`font-semibold ${
                          isHighest ? 'text-green-600' : getRatingColor(data.ratingBreakdown.pricing)
                        }`}>
                          {data.ratingBreakdown.pricing.toFixed(1)}/5
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Price Range */}
                <tr>
                  <td className="py-4 px-4 font-medium text-gray-900">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <span>Price Range</span>
                    </div>
                  </td>
                  {comparisonData.map((data, index) => {
                    const isLowest = data.priceRange.min === 
                      getBestValue(comparisonData.map(d => d.priceRange.min), false);
                    return (
                      <td key={index} className="py-4 px-4 text-center">
                        <div className={`inline-block px-3 py-1 rounded-full ${
                          isLowest ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          <span className="font-semibold">
                            ₹{data.priceRange.min} - ₹{data.priceRange.max}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Total Products */}
                <tr>
                  <td className="py-4 px-4 font-medium text-gray-900">Total Products</td>
                  {comparisonData.map((data, index) => {
                    const isHighest = data.totalProducts === 
                      getBestValue(comparisonData.map(d => d.totalProducts));
                    return (
                      <td key={index} className="py-4 px-4 text-center">
                        <span className={`font-semibold ${
                          isHighest ? 'text-green-600' : 'text-gray-800'
                        }`}>
                          {data.totalProducts}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Review Count */}
                <tr>
                  <td className="py-4 px-4 font-medium text-gray-900">Total Reviews</td>
                  {comparisonData.map((data, index) => {
                    const isHighest = data.reviewCount === 
                      getBestValue(comparisonData.map(d => d.reviewCount));
                    return (
                      <td key={index} className="py-4 px-4 text-center">
                        <span className={`font-semibold ${
                          isHighest ? 'text-green-600' : 'text-gray-800'
                        }`}>
                          {data.reviewCount}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Contact Information */}
                <tr>
                  <td className="py-4 px-4 font-medium text-gray-900">Contact</td>
                  {comparisonData.map((data, index) => (
                    <td key={index} className="py-4 px-4 text-center">
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-1 text-sm">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{data.supplier.profile.phone}</span>
                        </div>
                        <div className="flex items-center justify-center space-x-1 text-sm">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="truncate">{data.supplier.email}</span>
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Action Buttons */}
                <tr>
                  <td className="py-4 px-4 font-medium text-gray-900">Actions</td>
                  {comparisonData.map((data, index) => (
                    <td key={index} className="py-4 px-4 text-center">
                      <div className="space-y-2">
                        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          View Details
                        </button>
                        <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm">
                          Contact Supplier
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparison Summary</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-green-600 mb-2">Best Overall Rating</h4>
              <p className="text-sm text-gray-600">
                {comparisonData.find(d => 
                  d.supplier.rating.average === getBestValue(comparisonData.map(d => d.supplier.rating.average))
                )?.supplier.profile.businessName}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-blue-600 mb-2">Most Products</h4>
              <p className="text-sm text-gray-600">
                {comparisonData.find(d => 
                  d.totalProducts === getBestValue(comparisonData.map(d => d.totalProducts))
                )?.supplier.profile.businessName}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-orange-600 mb-2">Best Pricing</h4>
              <p className="text-sm text-gray-600">
                {comparisonData.find(d => 
                  d.priceRange.min === getBestValue(comparisonData.map(d => d.priceRange.min), false)
                )?.supplier.profile.businessName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierComparison;