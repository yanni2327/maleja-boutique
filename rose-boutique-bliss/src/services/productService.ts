import { productsApi } from './api';

export interface ProductVariant {
  size:  string;
  color: string;
  stock: number;
  sku:   string;
}

export interface Product {
  _id:         string;
  name:        string;
  description: string;
  price:       number;
  category:    string;
  images:      string[];
  badges:      string[];
  variants:    ProductVariant[];
  isActive:    boolean;
  createdAt:   string;
}

export interface ProductsResponse {
  products:    Product[];
  total:       number;
  page:        number;
  totalPages:  number;
}

// Obtener todos los productos con filtros opcionales
export const getProducts = async (params?: {
  category?: string;
  badge?:    string;
  search?:   string;
  page?:     number;
  limit?:    number;
}): Promise<ProductsResponse> => {
  const { data } = await productsApi.get('/products', { params });
  return data;
};

// Obtener un producto por ID
export const getProductById = async (id: string): Promise<Product> => {
  const { data } = await productsApi.get(`/products/${id}`);
  return data;
};

// Obtener categorías
export const getCategories = async (): Promise<{ _id: string; name: string; slug: string }[]> => {
  const { data } = await productsApi.get('/categories');
  return data;
};

// Subir producto con imágenes (admin)
export const createProduct = async (formData: FormData): Promise<Product> => {
  const { data } = await productsApi.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.product;
};
