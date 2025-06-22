import React from 'react';

const Header = ({ onHomeClick, cartItemCount, onCartClick }) => {
  return (
    <header className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 sm:py-5 flex justify-between items-center">
        <div 
          className="text-2xl sm:text-3xl font-bold tracking-tight cursor-pointer flex items-center group"
          onClick={onHomeClick}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && onHomeClick()}
          aria-label="Go to Kalash Bangles homepage"
        >
          <i className="fas fa-ring mr-2 sm:mr-3 text-xl sm:text-2xl transform group-hover:rotate-12 transition-transform duration-300"></i>
          Kalash Bangles
        </div>
        <nav className="flex items-center space-x-3 sm:space-x-4">
          <button 
            onClick={onHomeClick} 
            className="text-white hover:text-amber-100 transition duration-150 ease-in-out font-medium px-2 py-1 sm:px-3 sm:py-2 rounded-md text-sm sm:text-base flex items-center"
            aria-label="Home"
          >
            <i className="fas fa-home mr-1 sm:mr-2"></i> Home
          </button>
          <button 
            onClick={onCartClick} 
            className="text-white hover:text-amber-100 transition duration-150 ease-in-out font-medium px-2 py-1 sm:px-3 sm:py-2 rounded-md text-sm sm:text-base relative flex items-center"
            aria-label="View shopping cart"
          >
            <i className="fas fa-shopping-bag mr-1 sm:mr-2"></i> Cart
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border-2 border-amber-400">
                {cartItemCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;