import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, CartItem, ProductFilters, ApiState } from '../types';

interface ProductStore {
  // State
  products: Product[];
  filteredProducts: Product[];
  cart: CartItem[];
  filters: ProductFilters;
  apiState: ApiState;
  selectedProduct: Product | null;
  
  // Actions
  setProducts: (products: Product[]) => void;
  setFilters: (filters: Partial<ProductFilters>) => void;
  setApiState: (state: Partial<ApiState>) => void;
  setSelectedProduct: (product: Product | null) => void;
  applyFilters: () => void;
  
  // Computed
  categories: string[];
  cartTotal: number;
  cartCount: number;
  
  // Cart Actions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

// Safe storage for SSR
const storage = {
  getItem: (name: string) => {
    if (typeof window === 'undefined') return null;
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name: string, value: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(name);
  },
};



export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      // Initial state
      products: [],
      filteredProducts: [],
      cart: [],
      cartTotal: 0,
      cartCount: 0,
      filters: {
        category: '',
        search: '',
      },
      apiState: {
        loading: false,
        error: null,
      },
      selectedProduct: null,

      // Actions
      setProducts: (products) => {
        const cats = [...new Set(products.map(p => p.category))];
        set({ products, categories: cats });
        get().applyFilters();
      },

      setFilters: (newFilters) => {
        const filters = { ...get().filters, ...newFilters };
        set({ filters });
        get().applyFilters();
      },

      setApiState: (state) => {
        set({ apiState: { ...get().apiState, ...state } });
      },

      setSelectedProduct: (product) => {
        set({ selectedProduct: product });
      },

      // Computed values
      get categories() {
        return [...new Set(get().products.map(p => p.category))];
      },

      // cartTotal and cartCount are stored in state to ensure reactivity and
      // compatibility with the persist middleware. We update them whenever the
      // cart changes.

      // Filter logic
      applyFilters: () => {
        const { products, filters } = get();
        let filtered = products;

        if (filters.category) {
          filtered = filtered.filter(product => 
            product.category === filters.category
          );
        }

        if (filters.search) {
          filtered = filtered.filter(product =>
            product.title.toLowerCase().includes(filters.search.toLowerCase())
          );
        }

        set({ filteredProducts: filtered });
      },

      // Cart actions
      addToCart: (product) => {
        const { cart } = get();
        const existingItem = cart.find(item => item.product.id === product.id);

        if (existingItem) {
          get().updateQuantity(product.id, existingItem.quantity + 1);
        } else {
          const newCart = [...cart, { product, quantity: 1 }];
          const newCount = newCart.reduce((c, it) => c + it.quantity, 0);
          const newTotal = newCart.reduce((t, it) => t + it.product.price * it.quantity, 0);
          set({ cart: newCart, cartCount: newCount, cartTotal: newTotal });
        }
      },

      removeFromCart: (productId) => {
        const { cart } = get();
        const newCart = cart.filter(item => item.product.id !== productId);
        const newCount = newCart.reduce((c, it) => c + it.quantity, 0);
        const newTotal = newCart.reduce((t, it) => t + it.product.price * it.quantity, 0);
        set({ cart: newCart, cartCount: newCount, cartTotal: newTotal });
      },

      updateQuantity: (productId, quantity) => {
        const { cart } = get();
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        const newCart = cart.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        );
        const newCount = newCart.reduce((c, it) => c + it.quantity, 0);
        const newTotal = newCart.reduce((t, it) => t + it.product.price * it.quantity, 0);
        set({ cart: newCart, cartCount: newCount, cartTotal: newTotal });
      },

      clearCart: () => {
        set({ cart: [], cartCount: 0, cartTotal: 0 });
      },
    }),
    {
      name: 'product-store',
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({ cart: state.cart }),
      // When the store is rehydrated from storage, compute derived values
      // (cartCount and cartTotal) from the persisted cart so the UI is
      // immediately consistent.
      onRehydrateStorage: () => (state) => {
        if (state && state.cart) {
          const newCount = state.cart.reduce((c: number, it: CartItem) => c + it.quantity, 0);
          const newTotal = state.cart.reduce((t: number, it: CartItem) => t + it.product.price * it.quantity, 0);
          state.cartCount = newCount;
          state.cartTotal = newTotal;
        }
      },
    }
  )
);