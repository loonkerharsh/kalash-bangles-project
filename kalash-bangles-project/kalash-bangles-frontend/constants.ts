import './types.js'; // Keep for type context during development, though it's effectively empty at runtime

export const View = {
  CATEGORIES: 0,
  BANGLES: 1,
  DETAIL: 2,
  CART: 3,
};

export const BANGLE_SIZES = ['2.2', '2.4', '2.6', '2.8', '2.10'];

// Mock data is no longer used by App.js for API calls,
// but can be kept for reference or local testing if API is down.
// Or, more appropriately, this data should be in your backend database.

export const BANGLE_CATEGORIES_DATA = [
  { id: 'kundan', name: 'Kundan Bangles', imageUrl: 'https://placehold.co/600x400/FFF0E0/B8860B?text=Elegant+Kundan+Style', description: 'Elegant Kundan bangles, perfect for traditional occasions.' },
  { id: 'crystal', name: 'Crystal Bangles', imageUrl: 'https://placehold.co/600x400/E0FFFF/4682B4?text=Sparkling+Crystal+Gems', description: 'Sparkling crystal bangles that add glamour to any outfit.' },
  { id: 'kada', name: 'Kada Bangles', imageUrl: 'https://placehold.co/600x400/FFD700/8B4513?text=Bold+Kada+Designs', description: 'Bold and beautiful Kada bangles for a statement look.' },
  { id: 'chudi', name: 'Chudi Sets', imageUrl: 'https://placehold.co/600x400/FFB6C1/FF69B4?text=Colorful+Chudi+Sets', description: 'Colorful and vibrant Chudi sets for everyday elegance.' },
  { id: 'oxidised', name: 'Oxidised Bangles', imageUrl: 'https://placehold.co/600x400/D3D3D3/696969?text=Chic+Oxidised+Metal', description: 'Bohemian and chic oxidised bangles.' },
  { id: 'meenakari', name: 'Meenakari Bangles', imageUrl: 'https://placehold.co/600x400/ADD8E6/00008B?text=Artistic+Meenakari+Work', description: 'Artistic Meenakari bangles with intricate enamel work.' },
];

export const ALL_BANGLES_DATA = [
  // Kundan
  {
    id: 'kundan001', categoryId: 'kundan', name: 'Royal Kundan Set', price: 2999, baseImageUrl: 'https://placehold.co/400x300/FFF8DC/D2691E?text=Royal+Kundan+Set+Base',
    description: 'A majestic set of Kundan bangles, embedded with high-quality stones and pearls. Perfect for brides.',
    availableSizes: ['2.4', '2.6', '2.8'], material: 'Kundan Stones, Alloy', rating: 4.8, reviews: 150,
    colorVariants: [
      { id: 'k001-red', colorName: 'Ruby Red', hexColor: '#E0115F', imageUrl: 'https://placehold.co/300x200/FFE4E1/E0115F?text=Kundan+Ruby+Red' },
      { id: 'k001-green', colorName: 'Emerald Green', hexColor: '#50C878', imageUrl: 'https://placehold.co/300x200/E0EEE0/50C878?text=Kundan+Emerald+Green' },
    ]
  },
  {
    id: 'kundan002', categoryId: 'kundan', name: 'Elegant Single Kundan', price: 1200, baseImageUrl: 'https://placehold.co/400x300/FAF0E6/CD853F?text=Elegant+Kundan+Single',
    description: 'A single, intricately designed Kundan bangle that exudes class. Wear it solo or stack it.',
    availableSizes: ['2.6', '2.8'], material: 'Kundan, Gold-plated Alloy', rating: 4.5, reviews: 85,
    colorVariants: [
      { id: 'k002-white', colorName: 'Classic White', hexColor: '#F8F8FF', imageUrl: 'https://placehold.co/300x200/F5F5F5/696969?text=Kundan+Classic+White' },
      { id: 'k002-blue', colorName: 'Sapphire Blue', hexColor: '#0F52BA', imageUrl: 'https://placehold.co/300x200/E6E6FA/0F52BA?text=Kundan+Sapphire+Blue' },
    ]
  },
  // Crystal
  {
    id: 'crystal001', categoryId: 'crystal', name: 'Sparkling Crystal Pair', price: 899, baseImageUrl: 'https://placehold.co/400x300/F0FFFF/AFEEEE?text=Sparkling+Crystal+Pair',
    description: 'Dazzling pair of crystal bangles that catch the light beautifully. Ideal for parties.',
    availableSizes: ['2.2', '2.4', '2.6'], material: 'Austrian Crystals, Metal Alloy', rating: 4.6, reviews: 110,
    colorVariants: [
      { id: 'c001-clear', colorName: 'Clear Diamond', hexColor: '#FDF5E6', imageUrl: 'https://placehold.co/300x200/FFFFFF/B0C4DE?text=Crystal+Clear+Diamond' },
      { id: 'c001-pink', colorName: 'Rose Pink', hexColor: '#FFC0CB', imageUrl: 'https://placehold.co/300x200/FFF0F5/FFC0CB?text=Crystal+Rose+Pink' },
    ]
  },
  {
    id: 'crystal002', categoryId: 'crystal', name: 'Rainbow Crystal Chudi', price: 1500, baseImageUrl: 'https://placehold.co/400x300/E6E6FA/9370DB?text=Rainbow+Crystal+Chudi',
    description: 'A vibrant set of chudi style bangles with multi-colored crystals.',
    availableSizes: ['2.4', '2.6', '2.8', '2.10'], material: 'Mixed Crystals, Alloy', rating: 4.7, reviews: 95,
    colorVariants: [
      { id: 'c002-multi', colorName: 'Multicolor', imageUrl: 'https://placehold.co/300x200/F0F8FF/4169E1?text=Crystal+Multicolor+Splash' },
    ]
  },
  // Kada
  {
    id: 'kada001', categoryId: 'kada', name: 'Traditional Gold-Tone Kada', price: 1800, baseImageUrl: 'https://placehold.co/400x300/FFEC8B/B8860B?text=Gold+Tone+Kada',
    description: 'A classic gold-tone Kada with intricate carvings. Suitable for men and women.',
    availableSizes: ['2.8', '2.10'], material: 'Brass, Gold Plating', rating: 4.9, reviews: 200,
    colorVariants: [
      { id: 'kd001-gold', colorName: 'Antique Gold', hexColor: '#B08D57', imageUrl: 'https://placehold.co/300x200/F5DEB3/B08D57?text=Kada+Antique+Gold' },
    ]
  },
  // Chudi
  {
    id: 'chudi001', categoryId: 'chudi', name: 'Silk Thread Chudi Set', price: 650, baseImageUrl: 'https://placehold.co/400x300/FFFACD/FF4500?text=Silk+Thread+Chudi',
    description: 'A beautiful set of silk thread bangles in vibrant colors. Light-weight and comfortable.',
    availableSizes: ['2.2', '2.4', '2.6', '2.8'], material: 'Silk Thread, Plastic Base', rating: 4.3, reviews: 70,
    colorVariants: [
      { id: 'ch001-red', colorName: 'Festive Red', hexColor: '#FF0000', imageUrl: 'https://placehold.co/300x200/FFB6C1/FF0000?text=Chudi+Festive+Red' },
      { id: 'ch001-green', colorName: 'Leaf Green', hexColor: '#008000', imageUrl: 'https://placehold.co/300x200/90EE90/008000?text=Chudi+Leaf+Green' },
      { id: 'ch001-yellow', colorName: 'Sunny Yellow', hexColor: '#FFFF00', imageUrl: 'https://placehold.co/300x200/FFFFE0/DAA520?text=Chudi+Sunny+Yellow' },
    ]
  },
  // Oxidised
   {
    id: 'oxidised001', categoryId: 'oxidised', name: 'Boho Oxidised Silver Set', price: 950, baseImageUrl: 'https://placehold.co/400x300/E6E6FA/778899?text=Boho+Oxidised+Silver',
    description: 'Set of intricately designed oxidised silver bangles with tribal motifs.',
    availableSizes: ['2.4', '2.6', '2.8'], material: 'German Silver (Oxidised)', rating: 4.7, reviews: 130,
    colorVariants: [
      { id: 'ox001-silver', colorName: 'Oxidised Silver', hexColor: '#A9A9A9', imageUrl: 'https://placehold.co/300x200/DCDCDC/808080?text=Oxidised+Silver+Detail' },
    ]
  },
  // Meenakari
  {
    id: 'meenakari001', categoryId: 'meenakari', name: 'Peacock Meenakari Kada', price: 2200, baseImageUrl: 'https://placehold.co/400x300/E0FFFF/008080?text=Peacock+Meenakari+Kada',
    description: 'Stunning Meenakari Kada featuring a peacock design with vibrant enamel work.',
    availableSizes: ['2.6', '2.8'], material: 'Metal Alloy, Enamel', rating: 4.8, reviews: 160,
    colorVariants: [
      { id: 'mk001-bluegreen', colorName: 'Blue & Green Peacock', imageUrl: 'https://placehold.co/300x200/AFEEEE/20B2AA?text=Meena+Blue+Green' },
      { id: 'mk001-redgold', colorName: 'Red & Gold Floral', imageUrl: 'https://placehold.co/300x200/FFEBCD/FF7F50?text=Meena+Red+Gold' },
    ]
  }
];