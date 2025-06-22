import React, { useState, useEffect, useCallback } from 'react';
import { Category, Bangle, CartItem, BangleColorVariant } from './types.js';
import { View } from './constants.js'; 
import Header from './components/Header.js';
import CategoryList from './components/CategoryList.js';
import BangleList from './components/BangleList.js';
import BangleDetail from './components/BangleDetail.js';
import CartView from './components/CartView.js';
import LoadingSpinner from './components/LoadingSpinner.js';
import { getCategories, getBanglesByCategoryId, getBangleById } from './services/bangleService.js';

const App = () => {
  const [currentView, setCurrentView] = useState(View.CATEGORIES);
  const [categories, setCategories] = useState([]);
  const [bangles, setBangles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBangle, setSelectedBangle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [previousView, setPreviousView] = useState(View.CATEGORIES);
  const [error, setError] = useState(null);


  const fetchAndSetCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Could not load categories. Please try again later.");
      setCategories([]); // Set to empty array on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndSetCategories();
  }, [fetchAndSetCategories]);

  const handleSelectCategory = async (category) => {
    setIsLoading(true);
    setError(null);
    setSelectedCategory(category);
    try {
      const fetchedBangles = await getBanglesByCategoryId(category.id);
      setBangles(fetchedBangles);
    } catch (err) {
      console.error(`Error fetching bangles for category ${category.id}:`, err);
      setError(`Could not load bangles for ${category.name}. Please try again later.`);
      setBangles([]); // Set to empty array on error
    }
    setPreviousView(currentView);
    setCurrentView(View.BANGLES);
    setIsLoading(false);
  };

  const handleSelectBangle = async (bangle) => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedBangle = await getBangleById(bangle.id);
      setSelectedBangle(fetchedBangle);
       if (!fetchedBangle) {
        setError(`Bangle details for ${bangle.name} could not be found.`);
      }
    } catch (err) {
      console.error(`Error fetching bangle ${bangle.id}:`, err);
      setError(`Could not load details for ${bangle.name}. Please try again later.`);
      setSelectedBangle(null); // Set to null on error
    }
    setPreviousView(currentView);
    setCurrentView(View.DETAIL);
    setIsLoading(false);
  };

  const navigateToHome = () => {
    setError(null);
    setPreviousView(currentView);
    setCurrentView(View.CATEGORIES);
    setSelectedCategory(null);
    setSelectedBangle(null);
    if (categories.length === 0 && !isLoading) fetchAndSetCategories(); // Refetch if categories are empty and not loading
  };
  
  const navigateToCart = () => {
    if (currentView !== View.CART) {
      setPreviousView(currentView);
      setCurrentView(View.CART);
    }
  };

  const navigateBack = () => {
    setError(null);
    if (currentView === View.CART) {
        setCurrentView(previousView); 
    } else if (currentView === View.DETAIL) {
      setCurrentView(View.BANGLES);
      setSelectedBangle(null);
    } else if (currentView === View.BANGLES) {
      setCurrentView(View.CATEGORIES);
      setSelectedCategory(null);
      setBangles([]);
    }
  };
  
  const getBackButtonText = () => {
    if (currentView === View.DETAIL) return "Back to Bangles";
    if (currentView === View.BANGLES) return "Back to Categories";
    if (currentView === View.CART) return "Continue Shopping";
    return "";
  };

  const handleAddToCart = (bangle, colorVariant, size, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.bangle.id === bangle.id && item.selectedColorVariant.id === colorVariant.id && item.selectedSize === size
      );
      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      }
      return [...prevItems, { bangle, selectedColorVariant: colorVariant, selectedSize: size, quantity }];
    });
  };

  const handleUpdateCartQuantity = (bangleId, colorVariantId, size, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.bangle.id === bangleId && item.selectedColorVariant.id === colorVariantId && item.selectedSize === size
          ? { ...item, quantity: Math.max(0, newQuantity) } 
          : item
      ).filter(item => item.quantity > 0) 
    );
  };

  const handleRemoveFromCart = (bangleId, colorVariantId, size) => {
    setCartItems(prevItems =>
      prevItems.filter(
        item => !(item.bangle.id === bangleId && item.selectedColorVariant.id === colorVariantId && item.selectedSize === size)
      )
    );
  };
  
  const handleClearCart = () => {
    setCartItems([]);
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const renderError = () => {
    if (!error) return null;
    return (
      <div className="my-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-center" role="alert">
        <p className="font-semibold">Oops! Something went wrong.</p>
        <p>{error}</p>
        <button 
          onClick={() => setError(null)} 
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Dismiss
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-pink-50 text-stone-800 flex flex-col">
      <Header 
        onHomeClick={navigateToHome} 
        cartItemCount={cartItemCount}
        onCartClick={navigateToCart}
      />
      <main className="container mx-auto px-4 py-8 flex-grow">
        {renderError()}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {!error && currentView !== View.CATEGORIES && ( // Only show back button if no global error and not on category view
              <button
                onClick={navigateBack}
                className="mb-6 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out flex items-center group"
                aria-label={getBackButtonText()}
              >
                <i className={`fas ${currentView === View.CART ? 'fa-arrow-left' : 'fa-arrow-left'} mr-2 transform group-hover:-translate-x-1 transition-transform`}></i>
                {getBackButtonText()}
              </button>
            )}
            {!error && currentView === View.CATEGORIES && (
              <CategoryList categories={categories} onSelectCategory={handleSelectCategory} />
            )}
            {!error && currentView === View.BANGLES && selectedCategory && (
              <BangleList
                bangles={bangles}
                categoryName={selectedCategory.name}
                onSelectBangle={handleSelectBangle}
              />
            )}
            {!error && currentView === View.DETAIL && selectedBangle && (
              <BangleDetail 
                bangle={selectedBangle} 
                onAddToCart={handleAddToCart}
              />
            )}
            {/* Cart view can still be shown even if other parts of the app had an error, as cart is client-side */}
            {currentView === View.CART && (
              <CartView 
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateCartQuantity}
                onRemoveItem={handleRemoveFromCart}
                onClearCart={handleClearCart}
                onContinueShopping={navigateBack}
              />
            )}
          </>
        )}
      </main>
      <footer className="text-center py-6 bg-amber-100/70 mt-auto">
        <p className="text-amber-700">&copy; {new Date().getFullYear()} Kalash Bangles. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;