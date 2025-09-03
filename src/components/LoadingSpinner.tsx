+import React from 'react';
+import { Shield } from 'lucide-react';
+
+const LoadingSpinner: React.FC = () => {
+  return (
+    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
+      <div className="text-center">
+        <div className="relative">
+          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
+            <Shield className="w-8 h-8 text-white" />
+          </div>
+          <div className="absolute inset-0 w-16 h-16 border-4 border-orange-500/30 rounded-xl animate-spin mx-auto"></div>
+        </div>
+        <h2 className="text-xl font-semibold text-gray-900 mb-2">TrustSupply</h2>
+        <p className="text-gray-600">Loading your dashboard...</p>
+      </div>
+    </div>
+  );
+};
+
+export default LoadingSpinner;
+