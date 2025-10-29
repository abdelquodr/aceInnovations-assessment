// components/layout/Header.tsx
'use client';

import { Package } from 'lucide-react';
import { CartSummary } from '../cart/CartSummary';
import { useProductStore } from '../../stores/useProductStore';
import { useEffect } from 'react';
import { Product } from '../../types';

interface HeaderProps {
  initialProducts: Product[];
  initialError: string | null;
}

export function Header({ initialProducts, initialError }: HeaderProps) {
  const { setProducts, setApiState } = useProductStore();

  useEffect(() => {
    // Initialize store with server-fetched data
    if (initialProducts.length > 0) {
      setProducts(initialProducts);
    }
    if (initialError) {
      setApiState({ error: initialError, loading: false });
    }
  }, [initialProducts, initialError, setProducts, setApiState]);

  return (
    // Make the header fixed at the top so it remains stagnant while the
    // page content scrolls. Keep existing styling and spacing.
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
          </div>
          <CartSummary />
        </div>
      </div>
    </header>
  );
}