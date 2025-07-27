import React, { useState } from 'react';
import { ArrowLeft, Upload, Shield, CheckCircle, AlertCircle } from 'lucide-react';

type Props = {
  onNavigate: (page: 'landing') => void;
  onLogin: (userData: any, userType: 'seller') => void;
};

const SellerAuth: React.FC<Props> = ({ onNavigate, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    businessName: '',
    phone: '',
    address: '',
    fssaiNumber: '',
    gstNumber: '',
  });
  const [certificates, setCertificates] = useState<File[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'failed' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCertificates([...certificates, ...Array.from(e.target.files)]);
    }
  };

  const removeCertificate = (index: number) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  const validateFSSAI = (fssaiNumber: string): boolean => {
    // FSSAI number is typically 14 digits
    const fssaiRegex = /^\d{14}$/;
    return fssaiRegex.test(fssaiNumber);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!isLogin) {
        // Validate FSSAI number
        if (!validateFSSAI(formData.fssaiNumber)) {
          alert('Please enter a valid 14-digit FSSAI number');
          setIsSubmitting(false);
          return;
        }

        // Simulate certificate verification process
        setVerificationStatus('pending');
        
        // Simulate API call for FSSAI verification
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock verification result (in real app, this would be an API call)
        const isValid = Math.random() > 0.3; // 70% success rate for demo
        
        if (isValid) {
          setVerificationStatus('verified');
          // Simulate successful registration
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const userData = {
            email: formData.email,
            businessName: formData.businessName,
            fssaiNumber: formData.fssaiNumber,
            verified: true,
            certificates: certificates.length,
          };
          
          onLogin(userData, 'seller');
        } else {
          setVerificationStatus('failed');
        }
      } else {
        // Simulate login
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const userData = {
          email: formData.email,
          businessName: 'Demo Business',
          fssaiNumber: '12345678901234',
          verified: true,
          certificates: 3,
        };
        
        onLogin(userData, 'seller');
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </button>
          <div className="text-center">
            <div className="bg-orange-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="h-8 w-8 text-orange-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Supplier Login' : 'Join as Supplier'}
            </h1>
            <p className="text-gray-600">
              {isLogin ? 'Welcome back! Sign in to your supplier account' : 'Get verified and start connecting with vendors'}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <>
                {/* Business Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Verification Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      FSSAI Number * <span className="text-xs text-gray-500">(14 digits)</span>
                    </label>
                    <input
                      type="text"
                      name="fssaiNumber"
                      value={formData.fssaiNumber}
                      onChange={handleInputChange}
                      placeholder="12345678901234"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GST Number (Optional)
                    </label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Certificate Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Certificates *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Upload FSSAI certificate, quality certificates, or other relevant documents
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="certificate-upload"
                    />
                    <label
                      htmlFor="certificate-upload"
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-orange-700 transition-colors"
                    >
                      Choose Files
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Supported formats: PDF, JPG, PNG (Max 5MB each)
                    </p>
                  </div>

                  {/* Uploaded Files */}
                  {certificates.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {certificates.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeCertificate(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Verification Status */}
                {verificationStatus && (
                  <div className={`p-4 rounded-lg flex items-center space-x-3 ${
                    verificationStatus === 'pending' ? 'bg-yellow-50 text-yellow-800' :
                    verificationStatus === 'verified' ? 'bg-green-50 text-green-800' :
                    'bg-red-50 text-red-800'
                  }`}>
                    {verificationStatus === 'pending' && <AlertCircle className="h-5 w-5" />}
                    {verificationStatus === 'verified' && <CheckCircle className="h-5 w-5" />}
                    {verificationStatus === 'failed' && <AlertCircle className="h-5 w-5" />}
                    <span>
                      {verificationStatus === 'pending' && 'Verifying your FSSAI certificate...'}
                      {verificationStatus === 'verified' && 'Certificate verified successfully!'}
                      {verificationStatus === 'failed' && 'Certificate verification failed. Please check your FSSAI number.'}
                    </span>
                  </div>
                )}
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || verificationStatus === 'pending'}
              className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account & Verify'}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-orange-600 hover:text-orange-800 font-semibold"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerAuth;