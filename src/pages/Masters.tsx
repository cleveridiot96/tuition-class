
import React from 'react';
import { Navigate } from 'react-router-dom';

// This component redirects to the Master page to maintain compatibility
const Masters = () => {
  return <Navigate to="/master" replace />;
};

export default Masters;
