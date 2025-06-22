
import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to Kalash Bangles Admin Panel</h1>
      <p className="text-gray-600 text-lg mb-4">
        This is your central hub for managing products, categories, and orders for the Kalash Bangles e-commerce platform.
      </p>
      <p className="text-gray-600 text-lg">
        Use the navigation menu on the left to get started. You can:
      </p>
      <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1 pl-4">
        <li><i className="fas fa-tags mr-2 text-pink-500"></i>Manage product categories</li>
        <li><i className="fas fa-ring mr-2 text-pink-500"></i>Add, edit, and remove bangles and their variants</li>
        <li><i className="fas fa-box-open mr-2 text-pink-500"></i>View and update customer orders</li>
      </ul>
      <div className="mt-8 p-4 bg-pink-50 border-l-4 border-pink-500 text-pink-700 rounded-md">
        <p><i className="fas fa-info-circle mr-2"></i>Remember to save your changes frequently. All data modifications are live and will affect the customer-facing application.</p>
      </div>
    </div>
  );
};

export default DashboardPage;
