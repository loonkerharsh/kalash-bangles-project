import React from 'react';
import '../types.js'; // For type context

const StarRating = ({ rating }) => {
  if (typeof rating !== 'number' || rating < 0 || rating > 5) return null;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center text-yellow-400">
      {[...Array(fullStars)].map((_, i) => <i key={`full-${i}`} className="fas fa-star text-sm"></i>)}
      {halfStar && <i key="half" className="fas fa-star-half-alt text-sm"></i>}
      {[...Array(emptyStars)].map((_, i) => <i key={`empty-${i}`} className="far fa-star text-sm"></i>)}
    </div>
  );
};


const BangleCard = ({ bangle, onSelectBangle }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-lg hover:shadow-xl overflow-hidden cursor-pointer flex flex-col justify-between transform hover:-translate-y-1 transition-all duration-300 ease-in-out group border border-amber-100 hover:border-amber-300"
      onClick={() => onSelectBangle(bangle)}
      onKeyPress={(e) => e.key === 'Enter' && onSelectBangle(bangle)}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${bangle.name}`}
    >
      <div className="relative h-52 sm:h-56 w-full overflow-hidden">
        <img 
          src={bangle.baseImageUrl} 
          alt={bangle.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {(bangle.rating || bangle.material) && (
           <div className="absolute top-2 right-2 bg-black/40 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1 backdrop-blur-sm">
             {bangle.rating && <StarRating rating={bangle.rating} />}
             {bangle.rating && bangle.reviews && <span className="text-xs">({bangle.reviews})</span>}
           </div>
        )}
         {bangle.colorVariants && bangle.colorVariants.length > 0 && (
          <div className="absolute bottom-2 left-2 flex space-x-1">
            {bangle.colorVariants.slice(0, 3).map(variant => (
              <span 
                key={variant.id} 
                className="block w-4 h-4 rounded-full border border-white/50 shadow-md"
                style={{ backgroundColor: variant.hexColor || '#ccc' }}
                title={variant.colorName}
              ></span>
            ))}
            {bangle.colorVariants.length > 3 && (
              <span className="block w-4 h-4 rounded-full border border-white/50 shadow-md bg-gray-300 text-gray-700 text-xs flex items-center justify-center">
                +{bangle.colorVariants.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-md font-semibold text-amber-800 group-hover:text-amber-600 transition-colors mb-1 truncate" title={bangle.name}>
          {bangle.name}
        </h3>
        {bangle.material && <p className="text-xs text-stone-500 mb-2">{bangle.material}</p>}
        <p className="text-lg font-bold text-rose-500 mt-auto">
          ₹{bangle.price.toLocaleString('en-IN')}
        </p>
      </div>
      <div className="p-3 bg-amber-50 border-t border-amber-100">
         <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-3 rounded-md transition duration-150 ease-in-out text-sm">
            View Details
          </button>
      </div>
    </div>
  );
};

export default BangleCard;