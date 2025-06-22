
export interface Category {
  id: string;
  name: string;
  imageUrl?: string | File; // Can be URL string or File object for upload
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BangleColorVariant {
  id: string; // User-defined, e.g., 'k001-red'
  bangleId?: string; // Set when associating with a bangle
  colorName: string;
  hexColor?: string;
  imageUrl: string | File; // Can be URL string or File object for upload
  createdAt?: string;
  updatedAt?: string;
}

export interface Bangle {
  id: string; // User-defined, e.g., 'kundan001'
  name: string;
  categoryId: string;
  price: number;
  baseImageUrl?: string | File; // Can be URL string or File object for upload
  description?: string;
  availableSizes: string[]; // Stored as JSON string in DB
  material?: string;
  rating?: number;
  reviews?: number;
  colorVariants: BangleColorVariant[];
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id?: number; // Optional as it's auto-incremented
  orderId?: number;
  bangleId: string;
  bangleName: string; // Denormalized
  colorVariantId?: string;
  colorName?: string; // Denormalized
  selectedSize: string;
  quantity: number;
  priceAtPurchase: number; // Denormalized
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerDetails {
  name: string;
  address: string;
  contact: string;
  // Add other fields as needed
}

export interface Order {
  id?: number; // Optional as it's auto-incremented
  customerDetails: CustomerDetails; 
  totalAmount: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
}

// For form data, especially when creating new items where ID might not exist yet
export type CategoryFormData = Omit<Category, 'createdAt' | 'updatedAt'>;
export type BangleFormData = Omit<Bangle, 'createdAt' | 'updatedAt' | 'colorVariants'> & {
  colorVariants: Array<Omit<BangleColorVariant, 'createdAt' | 'updatedAt' | 'bangleId'>>; // Variants specific for form
};
export type OrderFormData = Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'items'> & {
    items: Array<Omit<OrderItem, 'id' | 'orderId' | 'createdAt' | 'updatedAt'>>;
};

export const ORDER_STATUSES: Order['status'][] = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
