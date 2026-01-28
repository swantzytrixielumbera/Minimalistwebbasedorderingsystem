export interface Product {
  id: string;
  name: string;
  category: 'Ceiling' | 'Wall' | 'Decorative' | 'LED Bulbs' | 'Fixtures';
  price: number;
  stock: number;
  image: string;
  description: string;
  lowStockThreshold: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
  promoCode?: string;
  discount?: number;
}

export interface Promotion {
  id: string;
  code: string;
  discount: number; // percentage
  validFrom: string;
  validTo: string;
  active: boolean;
  maxUses?: number; // maximum number of times this promo can be used
  currentUses?: number; // current number of times this promo has been used
}

export interface Review {
  id: string;
  productId: string;
  orderId: string;
  customerName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export const initialProducts: Product[] = [
  {
    id: 'p1',
    name: 'Modern LED Ceiling Light',
    category: 'Ceiling',
    price: 2499,
    stock: 45,
    image: 'ceiling-modern',
    description: 'Energy-efficient LED ceiling light with modern design',
    lowStockThreshold: 10
  },
  {
    id: 'p2',
    name: 'Crystal Chandelier',
    category: 'Ceiling',
    price: 8999,
    stock: 8,
    image: 'chandelier',
    description: 'Elegant crystal chandelier for luxurious spaces',
    lowStockThreshold: 5
  },
  {
    id: 'p3',
    name: 'Wall Sconce Light',
    category: 'Wall',
    price: 1299,
    stock: 32,
    image: 'wall-sconce',
    description: 'Contemporary wall sconce with adjustable brightness',
    lowStockThreshold: 15
  },
  {
    id: 'p4',
    name: 'Outdoor Wall Lantern',
    category: 'Wall',
    price: 1899,
    stock: 18,
    image: 'outdoor-lantern',
    description: 'Weather-resistant outdoor wall lantern',
    lowStockThreshold: 10
  },
  {
    id: 'p5',
    name: 'Pendant Decorative Light',
    category: 'Decorative',
    price: 3499,
    stock: 4,
    image: 'pendant-decorative',
    description: 'Artistic pendant light for statement decor',
    lowStockThreshold: 8
  },
  {
    id: 'p6',
    name: 'Table Lamp Decorative',
    category: 'Decorative',
    price: 1599,
    stock: 25,
    image: 'table-lamp',
    description: 'Stylish table lamp with decorative base',
    lowStockThreshold: 12
  },
  {
    id: 'p7',
    name: 'LED Bulb 9W Warm White',
    category: 'LED Bulbs',
    price: 199,
    stock: 150,
    image: 'led-bulb-warm',
    description: '9W LED bulb with warm white light',
    lowStockThreshold: 50
  },
  {
    id: 'p8',
    name: 'LED Bulb 12W Cool White',
    category: 'LED Bulbs',
    price: 249,
    stock: 120,
    image: 'led-bulb-cool',
    description: '12W LED bulb with cool white light',
    lowStockThreshold: 50
  },
  {
    id: 'p9',
    name: 'RGB Smart LED Bulb',
    category: 'LED Bulbs',
    price: 799,
    stock: 6,
    image: 'smart-bulb',
    description: 'WiFi-enabled RGB smart LED bulb',
    lowStockThreshold: 20
  },
  {
    id: 'p10',
    name: 'Track Light Fixture',
    category: 'Fixtures',
    price: 3299,
    stock: 15,
    image: 'track-light',
    description: 'Adjustable track light fixture system',
    lowStockThreshold: 8
  },
  {
    id: 'p11',
    name: 'Recessed Light Fixture',
    category: 'Fixtures',
    price: 899,
    stock: 42,
    image: 'recessed-fixture',
    description: 'Flush mount recessed light fixture',
    lowStockThreshold: 20
  },
  {
    id: 'p12',
    name: 'Industrial Fixture Set',
    category: 'Fixtures',
    price: 4599,
    stock: 3,
    image: 'industrial-fixture',
    description: 'Complete industrial-style fixture set',
    lowStockThreshold: 5
  }
];

export const initialOrders: Order[] = [
  {
    id: 'o1',
    customerName: 'Juan Santos',
    items: [
      { productId: 'p1', productName: 'Modern LED Ceiling Light', quantity: 2, price: 2499 },
      { productId: 'p7', productName: 'LED Bulb 9W Warm White', quantity: 10, price: 199 }
    ],
    total: 6988,
    status: 'pending',
    date: '2026-01-22'
  },
  {
    id: 'o2',
    customerName: 'Maria Cruz',
    items: [
      { productId: 'p2', productName: 'Crystal Chandelier', quantity: 1, price: 8999 }
    ],
    total: 8999,
    status: 'processing',
    date: '2026-01-21'
  },
  {
    id: 'o3',
    customerName: 'Roberto Diaz',
    items: [
      { productId: 'p3', productName: 'Wall Sconce Light', quantity: 4, price: 1299 },
      { productId: 'p6', productName: 'Table Lamp Decorative', quantity: 2, price: 1599 }
    ],
    total: 8394,
    status: 'completed',
    date: '2026-01-20'
  },
  {
    id: 'o4',
    customerName: 'Ana Garcia',
    items: [
      { productId: 'p10', productName: 'Track Light Fixture', quantity: 1, price: 3299 },
      { productId: 'p8', productName: 'LED Bulb 12W Cool White', quantity: 8, price: 249 }
    ],
    total: 5291,
    status: 'completed',
    date: '2026-01-19'
  }
];

export const initialPromotions: Promotion[] = [
  {
    id: 'pr1',
    code: 'NEWYEAR2026',
    discount: 15,
    validFrom: '2026-01-01',
    validTo: '2026-01-31',
    active: true,
    maxUses: 50,
    currentUses: 3
  },
  {
    id: 'pr2',
    code: 'WELCOME10',
    discount: 10,
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    active: true,
    maxUses: 100,
    currentUses: 12
  }
];

export const initialReviews: Review[] = [
  {
    id: 'r1',
    productId: 'p3',
    orderId: 'o3',
    customerName: 'Roberto Diaz',
    rating: 5,
    comment: 'Excellent products and fast delivery! Very satisfied with my purchase.',
    date: '2026-01-21'
  },
  {
    id: 'r2',
    productId: 'p10',
    orderId: 'o4',
    customerName: 'Ana Garcia',
    rating: 4,
    comment: 'Good quality lights. The track fixture works perfectly in my studio.',
    date: '2026-01-20'
  }
];

// Helper function to initialize data in localStorage
export const initializeData = () => {
  if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(initialProducts));
  }
  if (!localStorage.getItem('orders')) {
    localStorage.setItem('orders', JSON.stringify(initialOrders));
  }
  if (!localStorage.getItem('promotions')) {
    localStorage.setItem('promotions', JSON.stringify(initialPromotions));
  }
  if (!localStorage.getItem('reviews')) {
    localStorage.setItem('reviews', JSON.stringify(initialReviews));
  }
};

// Helper functions to manage data
export const getProducts = (): Product[] => {
  const data = localStorage.getItem('products');
  return data ? JSON.parse(data) : initialProducts;
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem('products', JSON.stringify(products));
};

export const getOrders = (): Order[] => {
  const data = localStorage.getItem('orders');
  return data ? JSON.parse(data) : initialOrders;
};

export const saveOrders = (orders: Order[]) => {
  localStorage.setItem('orders', JSON.stringify(orders));
};

export const getPromotions = (): Promotion[] => {
  const data = localStorage.getItem('promotions');
  return data ? JSON.parse(data) : initialPromotions;
};

export const savePromotions = (promotions: Promotion[]) => {
  localStorage.setItem('promotions', JSON.stringify(promotions));
};

export const getReviews = (): Review[] => {
  const data = localStorage.getItem('reviews');
  return data ? JSON.parse(data) : initialReviews;
};

export const saveReviews = (reviews: Review[]) => {
  localStorage.setItem('reviews', JSON.stringify(reviews));
};