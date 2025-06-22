
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import CategoryListPage from './pages/categories/CategoryListPage';
import CategoryFormPage from './pages/categories/CategoryFormPage';
import BangleListPage from './pages/bangles/BangleListPage';
import BangleFormPage from './pages/bangles/BangleFormPage';
import OrderListPage from './pages/orders/OrderListPage';
import OrderDetailPage from './pages/orders/OrderDetailPage';

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/categories" element={<CategoryListPage />} />
        <Route path="/categories/new" element={<CategoryFormPage />} />
        <Route path="/categories/edit/:id" element={<CategoryFormPage />} />
        <Route path="/bangles" element={<BangleListPage />} />
        <Route path="/bangles/new" element={<BangleFormPage />} />
        <Route path="/bangles/edit/:id" element={<BangleFormPage />} />
        <Route path="/orders" element={<OrderListPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
      </Routes>
    </Layout>
  );
};

export default App;
