import React from 'react';
import '../types.js'; // For type context

const CategoryItem = ({ category, onSelectCategory }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 ease-in-out group flex flex-col"
      onClick={() => onSelectCategory(category)}
      onKeyPress={(e) => e.key === 'Enter' && onSelectCategory(category)}
      tabIndex={0}
      role="button"
      aria-label={`View ${category.name}`}
    >
      <div className="relative h-56 sm:h-64 w-full overflow-hidden">
        <img 
          src={category.imageUrl} 
          alt={category.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 group-hover:from-black/30 transition-all duration-300"></div>
         <h2 className="absolute bottom-4 left-4 text-2xl font-semibold text-white p-2 bg-black/30 rounded">
          {category.name}
        </h2>
      </div>
      <div className="p-5 flex-grow flex flex-col justify-between">
        <p className="text-sm text-stone-600 mb-4 line-clamp-3">{category.description}</p>
        <button 
          aria-hidden="true"
          className="mt-auto w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out text-sm group-hover:ring-2 group-hover:ring-amber-300 group-hover:ring-offset-2"
        >
          Explore {category.name}
        </button>
      </div>
    </div>
  );
};

export default CategoryItem;