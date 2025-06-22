import React from 'react';
import '../types.js'; // For type context
import CartItemControls from './CartItemControls.js'; 
// import { createOrder } from '../services/bangleService.js'; // Would be used for actual checkout

const CartView = ({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart,
  onContinueShopping
}) => {
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.bangle.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const total = subtotal;

  const formatSizeDisplay = (sizeValue) => {
    return sizeValue.replace('.', '/');
  }

  // const handleProceedToCheckout = async () => {
  //   // In a real app, you'd collect customer details here or ensure they are logged in.
  //   // For now, this is a placeholder.
  //   if (cartItems.length === 0) {
  //     alert("Your cart is empty!");
  //     return;
  //   }
  //   try {
  //     // const customerDetails = { name: "Test User", address: "123 Test St" }; // Example
  //     // const order = await createOrder(cartItems, customerDetails);
  //     // console.log("Order created:", order);
  //     // alert("Order placed successfully! (This is a demo)");
  //     // onClearCart(); // Optionally clear cart after successful order
  //     // onContinueShopping(); // Navigate away
  //     alert("Proceed to Checkout clicked! (Integration with payment gateway and order creation API needed here)");
  //   } catch (error) {
  //     console.error("Checkout failed:", error);
  //     alert("Checkout failed. Please try again. (This is a demo)");
  //   }
  // };


  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <i className="fas fa-shopping-bag fa-4x text-amber-400 mb-6"></i>
        <h1 className="text-3xl font-bold text-amber-700 mb-4">Your Kalash Cart is Empty</h1>
        <p className="text-stone-600 mb-8 text-lg">Looks like you haven't added any treasures yet.</p>
        <button
          onClick={onContinueShopping}
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out text-lg"
        >
          Explore Bangles
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-amber-700 mb-8 text-center">Your Shopping Cart</h1>
      
      <div className="bg-white shadow-xl rounded-lg p-4 sm:p-6">
        {/* Cart Items Header */}
        <div className="hidden md:grid grid-cols-6 gap-4 mb-4 pb-2 border-b border-stone-200 font-semibold text-stone-600">
          <div className="col-span-2">Product</div>
          <div>Price</div>
          <div>Quantity</div>
          <div>Total</div>
          <div>Action</div>
        </div>

        {/* Cart Items */}
        <div className="space-y-6">
          {cartItems.map(item => (
            <div 
              key={`${item.bangle.id}-${item.selectedColorVariant.id}-${item.selectedSize}`} 
              className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center pb-4 border-b border-stone-100 last:border-b-0"
              role="listitem"
            >
              <div className="col-span-1 md:col-span-2 flex items-center space-x-3">
                <img 
                  src={item.selectedColorVariant.imageUrl || item.bangle.baseImageUrl} 
                  alt={item.bangle.name} 
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md shadow"
                />
                <div>
                  <h2 className="text-sm sm:text-base font-semibold text-amber-800">{item.bangle.name}</h2>
                  <p className="text-xs sm:text-sm text-stone-500">Color: {item.selectedColorVariant.colorName}</p>
                  <p className="text-xs sm:text-sm text-stone-500">Size: {formatSizeDisplay(item.selectedSize)}</p>
                </div>
              </div>
              <div className="text-sm sm:text-base text-stone-700 md:text-center">
                <span className="md:hidden font-semibold">Price: </span>₹{item.bangle.price.toLocaleString('en-IN')}
              </div>
              <div className="md:text-center">
                 <CartItemControls
                    quantity={item.quantity}
                    onIncrease={() => onUpdateQuantity(item.bangle.id, item.selectedColorVariant.id, item.selectedSize, item.quantity + 1)}
                    onDecrease={() => onUpdateQuantity(item.bangle.id, item.selectedColorVariant.id, item.selectedSize, item.quantity - 1)}
                  />
              </div>
              <div className="text-sm sm:text-base font-semibold text-rose-600 md:text-center">
                <span className="md:hidden font-semibold">Subtotal: </span>₹{(item.bangle.price * item.quantity).toLocaleString('en-IN')}
              </div>
              <div className="md:text-center">
                <button
                  onClick={() => onRemoveItem(item.bangle.id, item.selectedColorVariant.id, item.selectedSize)}
                  className="text-red-500 hover:text-red-700 transition duration-150 text-sm font-medium"
                  aria-label={`Remove ${item.bangle.name} from cart`}
                >
                  <i className="fas fa-trash-alt mr-1"></i> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary & Actions */}
        <div className="mt-8 pt-6 border-t border-stone-200">
          <div className="flex justify-end mb-2">
            <button
                onClick={onClearCart}
                className="text-sm text-stone-500 hover:text-red-600 font-medium transition-colors"
                aria-label="Clear all items from cart"
            >
                <i className="fas fa-times-circle mr-1"></i> Clear Cart
            </button>
          </div>
          <div className="md:flex justify-between items-center">
            <div className="text-right mb-6 md:mb-0">
              <p className="text-lg text-stone-600">Subtotal: <span className="font-semibold text-xl">₹{subtotal.toLocaleString('en-IN')}</span></p>
              <p className="text-2xl font-bold text-amber-700 mt-1">
                Total: <span className="text-rose-600">₹{total.toLocaleString('en-IN')}</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                // onClick={handleProceedToCheckout} // Call the checkout handler
                onClick={() => alert("Proceed to Checkout clicked! Backend integration for order creation required.")}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition duration-150 text-lg"
                aria-label="Proceed to checkout"
              >
                <i className="fas fa-credit-card mr-2"></i> Proceed to Checkout
              </button>
            </div>
          </div>
           <p className="text-xs text-stone-500 mt-4 text-center md:text-right">Checkout functionality is for demonstration and requires backend integration.</p>
        </div>
      </div>
    </div>
  );
};

export default CartView;