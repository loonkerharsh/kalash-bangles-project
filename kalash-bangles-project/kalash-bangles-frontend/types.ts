// This file primarily serves for TypeScript type checking during development.
// In a no-build JavaScript environment, these interfaces are erased.
// The .js extension is used to prevent MIME type or loading issues if imported.

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
}

export interface BangleColorVariant {
  id: string;
  colorName: string;
  hexColor?: string; 
  imageUrl: string;
}

export interface Bangle {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  baseImageUrl: string;
  description: string;
  availableSizes: string[];
  colorVariants: BangleColorVariant[];
  material?: string; 
  rating?: number; 
  reviews?: number; 
}

export interface CartItem {
  bangle: Bangle;
  selectedColorVariant: BangleColorVariant;
  selectedSize: string;
  quantity: number;
}

// Since interfaces are compile-time only, this file will be effectively empty at runtime.
// If you were to export actual JS values (like enums compiled to objects), they would go here.
export const _placeholder = null; // Adding a dummy export to make it a valid module if strictly needed by some tools