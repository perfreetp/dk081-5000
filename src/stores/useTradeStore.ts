import { create } from 'zustand'

export interface StepItem {
  name: string
  status: 'completed' | 'active' | 'pending' | 'timeout'
  time?: string
}

export interface Order {
  id: string
  type: 'sell' | 'buy'
  game: string
  status: string
  currentStep: number
  totalSteps: number
  amount: number
  createdAt: string
  steps: StepItem[]
}

export interface AccountInfo {
  id: string
  game: string
  server: string
  level: string
  description: string
  price: number
  verifyScore: number
  verifyItems: { name: string; passed: boolean }[]
  imageTags: string[]
}

export interface SellFormData {
  game: string
  server: string
  level: string
  description: string
  price: number
  contactPhone: string
}

interface TradeState {
  sellStep: number
  buyStep: number
  currentOrder: Order | null
  orders: Order[]
  accountInfo: AccountInfo | null
  sellForm: SellFormData

  updateSellStep: (step: number) => void
  updateBuyStep: (step: number) => void
  setSellForm: (data: Partial<SellFormData>) => void
  addOrder: (order: Order) => void
  updateOrder: (id: string, updates: Partial<Order>) => void
  resetSell: () => void
  resetBuy: () => void
}

const initialSellForm: SellFormData = {
  game: '',
  server: '',
  level: '',
  description: '',
  price: 0,
  contactPhone: '',
}

export const useTradeStore = create<TradeState>((set) => ({
  sellStep: 0,
  buyStep: 0,
  currentOrder: null,
  orders: [],
  accountInfo: null,
  sellForm: initialSellForm,

  updateSellStep: (step) => set({ sellStep: step }),
  updateBuyStep: (step) => set({ buyStep: step }),
  setSellForm: (data) =>
    set((state) => ({ sellForm: { ...state.sellForm, ...data } })),
  addOrder: (order) =>
    set((state) => ({ orders: [...state.orders, order] })),
  updateOrder: (id, updates) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, ...updates } : o
      ),
    })),
  resetSell: () => set({ sellStep: 0, sellForm: initialSellForm }),
  resetBuy: () => set({ buyStep: 0 }),
}))
