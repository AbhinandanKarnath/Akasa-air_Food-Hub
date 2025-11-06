import React from 'react';

const CategoryFilter = ({ selectedCategory, setSelectedCategory }) => {
  const categories = ['All', 'Fruit', 'Vegetable', 'Non-veg', 'Breads'];

  return (
    <div className="flex justify-center">
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl shadow-md">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`
              px-6 py-3 rounded-xl font-medium transition-all duration-200 text-sm
              ${selectedCategory === category
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md transform scale-105'
                : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50 hover:scale-105'
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;