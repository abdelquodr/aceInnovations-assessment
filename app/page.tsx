// app/page.tsx
import { ProductGrid } from '../app/components/product/ProductGrid';
import { ProductFilters } from '../app/components/filter/ProductFilters';
import { Header } from '../app/components/layout/Header';
import { ProductModal } from '../app/components/product/ProductModal';
import { productService } from '../app/services/api';

// Pre-fetch products on the server
async function getProducts() {
  try {
    const products = await productService.getProducts();
    return { products, error: null };
  } catch (error) {
    return { products: [], error: error instanceof Error ? error.message : 'Failed to load products' };
  }
}

export default async function HomePage() {
  const { products: initialProducts, error } = await getProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header initialProducts={initialProducts} initialError={error} />
      <main className="pt-20 max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductFilters />
        <ProductGrid />
      </main>

      <ProductModal />
    </div>
  );
}