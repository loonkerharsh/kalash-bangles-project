
import { API_BASE_URL } from '../constants';
import { Category, Bangle, Order, CategoryFormData, BangleFormData, OrderFormData } from '../types';

// Helper function for API requests
async function fetchApi<T,>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = { ...options.headers };
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  if (response.status === 204) { // No Content
    return null as T; 
  }
  return response.json();
}

// Category API functions
export const getCategories = (): Promise<Category[]> => fetchApi('/categories');
export const getCategoryById = (id: string): Promise<Category> => fetchApi(`/categories/${id}`);

export const createCategory = (categoryData: CategoryFormData): Promise<Category> => {
  const formData = new FormData();
  formData.append('id', categoryData.id);
  formData.append('name', categoryData.name);
  if (categoryData.description) formData.append('description', categoryData.description);
  if (categoryData.imageUrl && categoryData.imageUrl instanceof File) {
    formData.append('imageFile', categoryData.imageUrl); // Backend expects 'imageFile'
  }
  return fetchApi('/categories', { method: 'POST', body: formData });
};

export const updateCategory = (id: string, categoryData: Partial<CategoryFormData>): Promise<Category> => {
  const formData = new FormData();
  if (categoryData.name) formData.append('name', categoryData.name);
  if (categoryData.description) formData.append('description', categoryData.description);
  if (categoryData.imageUrl && categoryData.imageUrl instanceof File) {
    formData.append('imageFile', categoryData.imageUrl);
  } else if (typeof categoryData.imageUrl === 'string') {
    // If it's a string, it means don't change or backend handles clearing it if empty.
    // To explicitly clear an image, backend might need a specific flag or null value.
    // For now, if string, we don't append it as imageFile, assuming backend keeps old if not sent.
  }
  // The ID 'id' itself is not updatable via path, but for consistency if other fields are updatable:
  // if (categoryData.id) formData.append('id', categoryData.id); 

  return fetchApi(`/categories/${id}`, { method: 'PUT', body: formData });
};
export const deleteCategory = (id: string): Promise<void> => fetchApi(`/categories/${id}`, { method: 'DELETE' });

// Bangle API functions
export const getBangles = (categoryId?: string): Promise<Bangle[]> => {
  const endpoint = categoryId ? `/bangles?categoryId=${categoryId}` : '/bangles';
  return fetchApi(endpoint);
};
export const getBangleById = (id: string): Promise<Bangle> => fetchApi(`/bangles/${id}`);

export const createBangle = (bangleData: BangleFormData): Promise<Bangle> => {
    const formData = new FormData();
    formData.append('id', bangleData.id);
    formData.append('name', bangleData.name);
    formData.append('categoryId', bangleData.categoryId);
    formData.append('price', bangleData.price.toString());
    if (bangleData.description) formData.append('description', bangleData.description);
    formData.append('availableSizes', JSON.stringify(bangleData.availableSizes));
    if (bangleData.material) formData.append('material', bangleData.material);
    if (bangleData.rating !== undefined) formData.append('rating', bangleData.rating.toString());
    if (bangleData.reviews !== undefined) formData.append('reviews', bangleData.reviews.toString());

    if (bangleData.baseImageUrl && bangleData.baseImageUrl instanceof File) {
        formData.append('baseImageFile', bangleData.baseImageUrl);
    }

    // Handle color variants
    bangleData.colorVariants.forEach((variant, index) => {
        formData.append(`colorVariants[${index}][id]`, variant.id);
        formData.append(`colorVariants[${index}][colorName]`, variant.colorName);
        if (variant.hexColor) formData.append(`colorVariants[${index}][hexColor]`, variant.hexColor);
        if (variant.imageUrl instanceof File) {
            formData.append(`colorVariants[${index}][imageFile]`, variant.imageUrl, variant.imageUrl.name);
        } else if (typeof variant.imageUrl === 'string') {
            formData.append(`colorVariants[${index}][imageUrl]`, variant.imageUrl); // if it's an existing URL
        }
    });
    
    return fetchApi('/bangles', { method: 'POST', body: formData });
};

export const updateBangle = (id: string, bangleData: Partial<BangleFormData>): Promise<Bangle> => {
    const formData = new FormData();
    // Only append fields that are present in bangleData
    if (bangleData.name) formData.append('name', bangleData.name);
    if (bangleData.categoryId) formData.append('categoryId', bangleData.categoryId);
    if (bangleData.price !== undefined) formData.append('price', bangleData.price.toString());
    if (bangleData.description) formData.append('description', bangleData.description);
    if (bangleData.availableSizes) formData.append('availableSizes', JSON.stringify(bangleData.availableSizes));
    if (bangleData.material) formData.append('material', bangleData.material);
    if (bangleData.rating !== undefined) formData.append('rating', bangleData.rating.toString());
    if (bangleData.reviews !== undefined) formData.append('reviews', bangleData.reviews.toString());

    if (bangleData.baseImageUrl && bangleData.baseImageUrl instanceof File) {
        formData.append('baseImageFile', bangleData.baseImageUrl);
    } else if (typeof bangleData.baseImageUrl === 'string' && bangleData.baseImageUrl !== '') {
        // formData.append('baseImageUrl', bangleData.baseImageUrl); // If you want to send existing URL
    }


    if (bangleData.colorVariants) {
      bangleData.colorVariants.forEach((variant, index) => {
          formData.append(`colorVariants[${index}][id]`, variant.id); // existing or new ID for variant
          formData.append(`colorVariants[${index}][colorName]`, variant.colorName);
          if (variant.hexColor) formData.append(`colorVariants[${index}][hexColor]`, variant.hexColor);
          
          if (variant.imageUrl instanceof File) {
              formData.append(`colorVariants[${index}][imageFile]`, variant.imageUrl, variant.imageUrl.name);
          } else if (typeof variant.imageUrl === 'string') {
             // Backend needs to know if this is an existing image URL or if it should be cleared/unchanged
             formData.append(`colorVariants[${index}][imageUrl]`, variant.imageUrl);
          }
      });
    }
    return fetchApi(`/bangles/${id}`, { method: 'PUT', body: formData });
};

export const deleteBangle = (id: string): Promise<void> => fetchApi(`/bangles/${id}`, { method: 'DELETE' });

// Order API functions
export const getOrders = (): Promise<Order[]> => fetchApi('/orders');
export const getOrderById = (id: number): Promise<Order> => fetchApi(`/orders/${id}`);
export const updateOrderStatus = (id: number, status: Order['status']): Promise<Order> => {
  return fetchApi(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
};

// Frontend does not create orders via admin panel as per spec, only POST /api/orders (for customer app)
// export const createOrder = (orderData: OrderFormData): Promise<Order> => fetchApi('/orders', { method: 'POST', body: JSON.stringify(orderData) });

