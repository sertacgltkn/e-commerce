// src/types/index.ts

// DİKKAT: Baştaki 'export' kelimesi olmak zorunda!
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}