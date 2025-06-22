import React, { useState, useEffect } from 'react';
import '../types.js'; // For type context
import { BANGLE_SIZES } from '../constants.js';


const StarRatingDisplay = ({ rating, reviews }) => {
  if (typeof rating !== 'number' || rating < 0 || rating > 5) return null;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center mb-4">
      <div className="flex text-yellow-500 text-xl sm:text-2xl">
        {[...Array(fullStars)].map((_, i) => <i key={`full-${i}`} className="fas fa-star"></i>)}
        {halfStar && <i key="half" className="fas fa-star-half-alt"></i>}
        {[...Array(emptyStars)].map((_, i) => <i key={`empty-${i}`} className="far fa-star"></i>)}
      </div>
      {reviews !== undefined && <span className="ml-2 text-stone-600 text-sm sm:text-base">({reviews} reviews)</span>}
    </div>
  );
};

const BangleDetail = ({ bangle, onAddToCart }) => {
  const [selectedColorVariant, setSelectedColorVariant] = useState(
    bangle.colorVariants.length > 0 ? bangle.colorVariants[0] : null
  );
  const [selectedSize, setSelectedSize] = useState(
    bangle.availableSizes.length > 0 ? bangle.availableSizes[0] : null
  );
  const [mainImage, setMainImage] = useState(bangle.baseImageUrl);
  const [addedToCartMessage, setAddedToCartMessage] = useState('');

  useEffect(() => {
    if (selectedColorVariant) {
      setMainImage(selectedColorVariant.imageUrl);
    } else {
      setMainImage(bangle.baseImageUrl);
    }
  }, [selectedColorVariant, bangle.baseImageUrl]);

  useEffect(() => {
    // Reset selected color and size if bangle changes
    setSelectedColorVariant(bangle.colorVariants.length > 0 ? bangle.colorVariants[0] : null);
    setSelectedSize(bangle.availableSizes.length > 0 ? bangle.availableSizes[0] : null);
  }, [bangle]);


  const handleSelectColor = (variant) => {
    setSelectedColorVariant(variant);
  };

  const handleSelectSize = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCartClick = () => {
    if (!selectedColorVariant && bangle.colorVariants.length > 0) {
        setAddedToCartMessage("Please select a color.");
        setTimeout(() => setAddedToCartMessage(''), 2000);
        return;
    }
    if (!selectedSize) {
        setAddedToCartMessage("Please select a size.");
        setTimeout(() => setAddedToCartMessage(''), 2000);
        return;
    }
    
    // Ensure selectedColorVariant is not null if there are color variants
    const colorToAdd = selectedColorVariant || (bangle.colorVariants.length > 0 ? bangle.colorVariants[0] : {id: 'default', colorName: 'Default', imageUrl: bangle.baseImageUrl});

    if (colorToAdd && selectedSize) {
        onAddToCart(bangle, colorToAdd, selectedSize);
        setAddedToCartMessage("Added to Cart ✔");
        setTimeout(() => setAddedToCartMessage(''), 2000);
    }
  };
  
  const formatSizeDisplay = (sizeValue) => {
    return sizeValue.replace('.', '/');
  }

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {/* Image Gallery Column */}
        <div className="flex flex-col items-center">
          <div className="mb-4 rounded-lg overflow-hidden shadow-lg w-full aspect-square max-h-[450px] md:max-h-[500px]">
            <img 
              src={mainImage} 
              alt={selectedColorVariant ? `${bangle.name} - ${selectedColorVariant.colorName}` : bangle.name} 
              className="w-full h-full object-cover transition-all duration-300 ease-in-out"
            />
          </div>
          {bangle.colorVariants.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2 w-full justify-center">
              {bangle.colorVariants.map(variant => (
                <button
                  key={variant.id}
                  onClick={() => handleSelectColor(variant)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden border-2 transition-all duration-200 flex-shrink-0
                    ${selectedColorVariant?.id === variant.id 
                      ? 'border-amber-500 scale-110 ring-2 ring-amber-500 ring-offset-2 shadow-lg' 
                      : 'border-stone-200 hover:border-amber-400 hover:scale-105'}`}
                  aria-label={`Select color ${variant.colorName}`}
                  title={variant.colorName}
                >
                  <img src={variant.imageUrl} alt={variant.colorName} className="w-full h-full object-cover"/>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Column */}
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-800 mb-2">{bangle.name}</h1>
          {bangle.rating !== undefined && <StarRatingDisplay rating={bangle.rating} reviews={bangle.reviews} />}
          <p className="text-3xl sm:text-4xl font-semibold text-rose-600 mb-5 sm:mb-6">
            ₹{bangle.price.toLocaleString('en-IN')}
          </p>
          
          <div className="mb-5 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-stone-700 mb-1 sm:mb-2">Description</h2>
            <p className="text-stone-600 leading-relaxed text-sm sm:text-base">{bangle.description}</p>
          </div>

          {bangle.material && (
             <div className="mb-5 sm:mb-6">
              <h3 className="text-md sm:text-lg font-semibold text-stone-700 mb-1">Material:</h3>
              <p className="text-stone-600 text-sm sm:text-base">{bangle.material}</p>
            </div>
          )}

          {bangle.colorVariants.length > 0 && (
            <div className="mb-5 sm:mb-6">
              <h3 className="text-md sm:text-lg font-semibold text-stone-700 mb-2">
                Color: <span className="font-normal text-stone-600">{selectedColorVariant?.colorName || 'Select a color'}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {bangle.colorVariants.map(variant => (
                  <button
                    key={variant.id}
                    onClick={() => handleSelectColor(variant)}
                    className={`p-0.5 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1
                      ${selectedColorVariant?.id === variant.id ? 'ring-2 ring-amber-500 ring-offset-1' : ''}`}
                    style={{ backgroundColor: variant.hexColor || 'transparent' }}
                    title={variant.colorName}
                    aria-label={`Select ${variant.colorName}`}
                    aria-pressed={selectedColorVariant?.id === variant.id}
                  >
                     {variant.hexColor ? (
                        <span style={{ backgroundColor: variant.hexColor }} className="block w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-stone-300 shadow-sm"></span>
                     ) : (
                        <img src={variant.imageUrl} alt={variant.colorName} className="w-9 h-9 sm:w-10 sm:h-10 object-cover rounded-md border border-stone-300" />
                     )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {bangle.availableSizes.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h3 className="text-md sm:text-lg font-semibold text-stone-700 mb-2">
                Size: <span className="font-normal text-stone-600">{selectedSize ? formatSizeDisplay(selectedSize) : 'Select a size'}</span>
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {bangle.availableSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => handleSelectSize(size)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md border text-sm sm:text-base font-medium transition-colors duration-150
                      ${selectedSize === size 
                        ? 'bg-amber-500 text-white border-amber-500 shadow-md' 
                        : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 hover:border-amber-400'}`}
                    aria-pressed={selectedSize === size}
                  >
                    {formatSizeDisplay(size)}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="relative">
            <button 
              onClick={handleAddToCartClick}
              className={`w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out text-base sm:text-lg flex items-center justify-center
                ${(!selectedSize || (bangle.colorVariants.length > 0 && !selectedColorVariant)) ? 'opacity-50 cursor-not-allowed' : '' }`}
              disabled={!selectedSize || (bangle.colorVariants.length > 0 && !selectedColorVariant)}
              aria-label="Add bangle to cart"
            >
              <i className="fas fa-cart-plus mr-2 sm:mr-3"></i> 
              {addedToCartMessage && addedToCartMessage.includes("Added") ? addedToCartMessage : "Add to Cart"}
            </button>
            {addedToCartMessage && !addedToCartMessage.includes("Added") && (
                <p className="text-xs text-red-500 mt-1 text-center absolute -bottom-5 left-0 right-0">{addedToCartMessage}</p>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default BangleDetail;