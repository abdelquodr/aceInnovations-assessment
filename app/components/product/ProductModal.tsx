'use client';

import React, { useEffect } from 'react';
import { useProductStore } from '../../stores/useProductStore';
import { X, Star, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/Button';

export const ProductModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, cart } = useProductStore();
  
  const isInCart = cart.some(item => item.product.id === selectedProduct?.id);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProduct(null);
      }
    };

    if (selectedProduct) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedProduct, setSelectedProduct]);

  if (!selectedProduct) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-filter backdrop-blur-xs bg-opacity-50 shadow-gray-400 shadow-lg drop-shadow-md flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
          <button
            onClick={() => setSelectedProduct(null)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/2">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className="w-full h-64 object-contain bg-gray-100 rounded-lg"
              />
            </div>
            
            <div className="lg:w-1/2">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {selectedProduct.category}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">
                    {selectedProduct.rating.rate} ({selectedProduct.rating.count} reviews)
                  </span>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {selectedProduct.title}
              </h1>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {selectedProduct.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-gray-900">
                  ${selectedProduct.price}
                </span>
                <Button
                  onClick={() => addToCart(selectedProduct)}
                  variant={isInCart ? 'secondary' : 'primary'}
                  className="flex items-center space-x-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>{isInCart ? 'Added to Cart' : 'Add to Cart'}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};