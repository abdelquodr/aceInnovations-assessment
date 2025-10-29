'use client';

import { useEffect } from 'react';
import { useProductStore } from '../stores/useProductStore';
import { productService } from '../services/api';

export const useProducts = () => {
  const {
    products,
    apiState,
    setProducts,
    setApiState,
  } = useProductStore();

  useEffect(() => {
    const fetchProducts = async () => {
      // Don't refetch if we already have products
      if (products.length > 0) return;

      setApiState({ loading: true, error: null });
      try {
        const data = await productService.getProducts();
        setProducts(data);
        setApiState({ loading: false });
      } catch (error) {
        setApiState({ 
          loading: false, 
          error: error instanceof Error ? error.message : 'Failed to fetch products' 
        });
      }
    };

    fetchProducts();
  }, [setProducts, setApiState, products.length]);

  return { apiState };
};