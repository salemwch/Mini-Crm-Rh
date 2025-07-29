import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import Lottie from 'lottie-react';
import loadingAnimation from "../assets/animation/loading.json";

const PrivateRoute = ({ children, roles = [] }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  

  try {
    if (loading) {
      

      return (
        <div style={{ width: 200, margin: "auto" }}>
          <Lottie animationData={loadingAnimation} loop={true} />
        </div>
      );
      
    }
    

    if (!user && location.pathname !== '/') {
      console.warn(`[PrivateRoute] Unauthorized access attempt to ${location.pathname} - redirecting to /`);
      return <Navigate to="/" replace state={{ from: location }} />;
    }

    if (roles.length > 0 && !roles.includes(user?.role)) {
      console.warn(`[PrivateRoute] User role '${user?.role}' unauthorized for route ${location.pathname}`);
      return <Navigate to="/unauthorized" replace />;
    }
    console.warn('[PrivateRoute] roles required:', roles);
console.warn('[PrivateRoute] user role:', user?.role);
console.warn('[PrivateRoute] roles.includes(user?.role):', roles.includes(user?.role));
    return children;
    
  } catch (error) {
    console.error('[PrivateRoute] Unexpected error:', error);
    console.warn('[PrivateRoute] roles required:', roles);
console.warn('[PrivateRoute] user role:', user?.role);
console.warn('[PrivateRoute] roles.includes(user?.role):', roles.includes(user?.role));
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem', color: 'red' }}>
        <h2>Something went wrong.</h2>
        <p>Please try refreshing the page or contact support if the issue persists.</p>
      </div>
    );
  }
};

export default PrivateRoute;