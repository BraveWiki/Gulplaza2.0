import { create } from 'zustand'

export interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  shopkeeperId: string
  imageUrl?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalAmount: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id)
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }
      }
      return { items: [...state.items, item] }
    }),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== productId),
    })),

  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === productId ? { ...i, quantity: Math.max(0, quantity) } : i
      ),
    })),

  clearCart: () => set({ items: [] }),

  getTotalAmount: () =>
    get().items.reduce((total, item) => total + item.price * item.quantity, 0),

  getTotalItems: () =>
    get().items.reduce((total, item) => total + item.quantity, 0),
}))
