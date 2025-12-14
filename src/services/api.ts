// src/services/api.ts
import axios from 'axios';
import type { Product } from '../types';

const BASE_URL = 'https://fakestoreapi.com';

// Ürünleri çeken asenkron fonksiyon
export const getProducts = async (): Promise<Product[]> => {
  // <Product[]> diyerek axios'a dönen verinin bir Ürün Listesi olduğunu söylüyoruz
  const response = await axios.get<Product[]>(`${BASE_URL}/products`);
  return response.data;
};

export const getProduct = async (id: string): Promise<Product> => {
  const response = await axios.get<Product>(`${BASE_URL}/products/${id}`);
  return response.data;
};