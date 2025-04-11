import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized</h1>
        <p className="text-gray-700 mb-6">
          You do not have permission to access this page. Please contact the admin if you think this is a mistake.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2 bg-blue-500 text-white text-center rounded-md hover:bg-blue-600 transition"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;