import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100">
      <AlertTriangle size={64} className="text-red-500 mb-6" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">404 - Not Found</h1>
      <p className="text-gray-600 max-w-md mb-8">
        The page you are looking for does not exist.
      </p>
      <Link to="/" className="btn btn-primary">
        <Home size={18} className="mr-2" />
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
