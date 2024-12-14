import React from 'react';
import { Navigate } from 'react-router-dom';

const Privaterouter = ({ children }) => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');

    if (!isAuthenticated) {
        // Redirect to the admin login page if not authenticated
        return <Navigate to="/admin" />;
    }

    return children; // Render the protected component if authenticated
};

export default Privaterouter;
