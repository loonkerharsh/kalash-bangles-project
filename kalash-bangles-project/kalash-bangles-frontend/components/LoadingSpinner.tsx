import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-amber-600" role="status" aria-live="polite">
      <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 sm:border-[5px] border-amber-500 border-t-transparent rounded-full animate-spin mb-4 sm:mb-5"></div>
      <p className="text-lg sm:text-xl font-semibold">Loading Kalash Treasures...</p>
      <p className="text-sm text-stone-500">Please wait a moment.</p>
    </div>
  );
};

export default LoadingSpinner;