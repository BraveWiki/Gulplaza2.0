import { create } from 'zustand'

type View = 'home' | 'cart' | 'product-detail' | 'add-product' | 'checkout'

interface ViewStore {
  currentView: View
  selectedProductId: string | null
  setView: (view: View) => void
  setSelectedProduct: (productId: string | null) => void
  goToProductDetail: (productId: string) => void
}

export const useViewStore = create<ViewStore>((set) => ({
  currentView: 'home',
  selectedProductId: null,

  setView: (view) => set({ currentView: view, selectedProductId: null }),

  setSelectedProduct: (productId) => set({ selectedProductId: productId }),

  goToProductDetail: (productId) =>
    set({ currentView: 'product-detail', selectedProductId: productId }),
}))
