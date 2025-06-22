import React from 'react';
import '../types.js'; // For type context
import CategoryItem from './CategoryItem.js';

const CategoryList = ({ categories, onSelectCategory }) => {
  return (
    <section aria-labelledby="categories-heading">
      <h1 id="categories-heading" className="text-3xl sm:text-4xl font-bold text-center text-amber-700 mb-8 sm:mb-12">
        Shop by Category
      </h1>
      {categories.length === 0 ? (
        <p className="text-center text-stone-600 text-lg">No categories available at the moment. Please check back later!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map(category => (
            <CategoryItem key={category.id} category={category} onSelectCategory={onSelectCategory} />
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoryList;