import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ children, requiredRole = 'user' }) => {
  const { user, isAdmin } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'admin' && !isAdmin()) {
    return (
      <div className="container mt-5 pt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Qasja e Ndaluar!</h4>
          <p>Ju nuk keni leje për të aksesuar këtë faqe. Vetëm administratorët mund të hijnë këtu.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
