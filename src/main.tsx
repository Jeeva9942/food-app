@@ .. @@
 import React from 'react'
 import ReactDOM from 'react-dom/client'
 import { Auth0Provider } from '@auth0/auth0-react'
 import App from './App.tsx'
 import './index.css'
 
+const domain = import.meta.env.VITE_AUTH0_DOMAIN;
+const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
+const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
+
+if (!domain || !clientId) {
+  throw new Error('Auth0 configuration is missing. Please check your environment variables.');
+}
+
 ReactDOM.createRoot(document.getElementById('root')!).render(
   <React.StrictMode>
     <Auth0Provider
-      domain={import.meta.env.VITE_AUTH0_DOMAIN}
-      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
-      authorizationParams={{
-        redirect_uri: window.location.origin
-      }}
+      domain={domain}
+      clientId={clientId}
+      authorizationParams={{
+        redirect_uri: window.location.origin,
+        audience: audience,
+        scope: "openid profile email"
+      }}
+      useRefreshTokens={true}
+      cacheLocation="localstorage"
     >
       <App />
     </Auth0Provider>
   </React.StrictMode>,
 )