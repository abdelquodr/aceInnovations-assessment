'use client';

import React from 'react';
import { useProductStore } from '../../stores/useProductStore';
import { ProductCard } from './ProductCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useProducts } from '../../hooks/useProducts';

export const ProductGrid: React.FC = () => {
  const { filteredProducts, apiState } = useProductStore();
  useProducts(); // Initialize products if needed

  if (apiState.loading) {
    return <LoadingSpinner />;
  }

  if (apiState.error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg mb-2">Error loading products</div>
        <div className="text-gray-600">{apiState.error}</div>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600 text-lg">No products found</div>
        <div className="text-gray-500">Try adjusting your filters</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};