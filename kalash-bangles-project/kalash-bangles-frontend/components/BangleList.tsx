import React from 'react';
import '../types.js'; // For type context
import BangleCard from './BangleCard.js';

const BangleList = ({ bangles, categoryName, onSelectBangle }) => {
  return (
    <section aria-labelledby="bangle-list-heading">
      <h1 id="bangle-list-heading" className="text-3xl sm:text-4xl font-bold text-amber-700 mb-3">
        {categoryName}
      </h1>
      <p className="text-stone-600 mb-8 sm:mb-10 text-base sm:text-lg">Explore our exquisite collection of {categoryName.toLowerCase()}.</p>
      
      {bangles.length === 0 ? (
        <div className="text-center py-12">
          <i className="fas fa-search fa-3x text-amber-400 mb-4"></i>
          <p className="text-stone-600 text-xl font-semibold">No bangles found in this category yet.</p>
          <p className="text-stone-500">Please check back soon or explore other categories!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {bangles.map(bangle => (
            <BangleCard key={bangle.id} bangle={bangle} onSelectBangle={onSelectBangle} />
          ))}
        </div>
      )}
    </section>
  );
};

export default BangleList;