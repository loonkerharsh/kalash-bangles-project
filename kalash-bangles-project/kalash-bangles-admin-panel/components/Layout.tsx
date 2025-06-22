
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  iconClass: string;
  label: string;
  currentPath: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, iconClass, label, currentPath }) => {
  const isActive = currentPath === to || (to !== "/" && currentPath.startsWith(to));
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 text-gray-700 hover:bg-pink-100 hover:text-pink-700 rounded-lg transition-colors duration-200 ease-in-out ${
        isActive ? 'bg-pink-600 text-white hover:bg-pink-700' : ''
      }`}
    >
      <i className={`${iconClass} mr-3 w-5 text-center`}></i>
      {label}
    </Link>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg p-6 space-y-4">
        <div className="text-3xl font-bold text-pink-600 mb-8 text-center">
          Kalash Bangles
        </div>
        <nav className="space-y-2">
          <NavLink to="/" iconClass="fas fa-tachometer-alt" label="Dashboard" currentPath={location.pathname} />
          <NavLink to="/categories" iconClass="fas fa-tags" label="Categories" currentPath={location.pathname} />
          <NavLink to="/bangles" iconClass="fas fa-ring" label="Bangles" currentPath={location.pathname} />
          <NavLink to="/orders" iconClass="fas fa-box-open" label="Orders" currentPath={location.pathname} />
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
