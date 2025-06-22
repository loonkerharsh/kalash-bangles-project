import React from 'react';

const CartItemControls = ({ quantity, onIncrease, onDecrease }) => {
  return (
    <div className="flex items-center justify-center space-x-2 my-2 md:my-0">
      <button
        onClick={onDecrease}
        disabled={quantity <= 0} // Disable if quantity is already 0 or less (should be removed if 0)
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-md border border-amber-300 text-amber-700 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        aria-label="Decrease quantity"
      >
        <i className="fas fa-minus text-xs"></i>
      </button>
      <span className="text-sm sm:text-base font-medium text-stone-700 w-8 text-center" aria-live="polite">
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-md border border-amber-300 text-amber-700 hover:bg-amber-100 transition-colors flex items-center justify-center"
        aria-label="Increase quantity"
      >
        <i className="fas fa-plus text-xs"></i>
      </button>
    </div>
  );
};

export default CartItemControls;