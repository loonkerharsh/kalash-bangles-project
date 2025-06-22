import '../types.js'; // Keep for type context during development

// Define the base URL for your local backend API
const BASE_API_URL = 'http://localhost:3001/api'; // Common port for Node.js backends

export const getCategories = async () => {
  try {
    const response = await fetch(`${BASE_API_URL}/categories`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch categories' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getCategories:", error);
    throw error; // Re-throw to be caught by the calling component
  }
};

export const getBanglesByCategoryId = async (categoryId) => {
  try {
    const response = await fetch(`${BASE_API_URL}/bangles?categoryId=${categoryId}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Failed to fetch bangles for category ${categoryId}` }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error in getBanglesByCategoryId for ${categoryId}:`, error);
    throw error;
  }
};

export const getBangleById = async (bangleId) => {
  try {
    const response = await fetch(`${BASE_API_URL}/bangles/${bangleId}`);
    if (!response.ok) {
      if (response.status === 404) return null; // Bangle not found
      const errorData = await response.json().catch(() => ({ message: `Failed to fetch bangle ${bangleId}` }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error)
 {
    console.error(`Error in getBangleById for ${bangleId}:`, error);
    throw error;
  }
};

// Placeholder for future API call to create an order
export const createOrder = async (cartItems, customerDetails) => {
  try {
    const response = await fetch(`${BASE_API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: cartItems, customer: customerDetails }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to create order' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in createOrder:", error);
    throw error;
  }
};