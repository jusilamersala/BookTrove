import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ children, requiredRole = 'user' }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const rolesToMatch = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  
  const hasAccess = rolesToMatch.includes(user.role);

  if (!hasAccess) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <div className="alert alert-danger shadow-sm border-0 py-4" role="alert">
          <h4 className="alert-heading fw-bold">⚠️ Qasja e Ndaluar!</h4>
          <hr />
          <p className="mb-0">
            Roli juaj (<strong>{user.role}</strong>) nuk ka leje për të aksesuar këtë faqe. 
            Ju lutem kontaktoni administratorin nëse mendoni se ky është një gabim.
          </p>
          <button 
            className="btn btn-outline-danger mt-3" 
            onClick={() => window.location.href = '/'}
          >
            Kthehu në Fillim
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;