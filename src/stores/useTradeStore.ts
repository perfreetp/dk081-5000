import { create } from 'zustand'

export interface StepItem {
  name: string
  status: 'completed' | 'active' | 'pending' | 'timeout'
  time?: string
  hint?: string
}

export interface Order {
  id: string
  type: 'sell' | 'buy'
  game: string
  status: '进行中' | '已完成' | '异常超时'
  currentStep: number
  totalSteps: number
  amount: number
  createdAt: string
  completedAt?: string
  steps: StepItem[]
  sellFormInfo?: string
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
  supportContext: string

  updateSellStep: (step: number) => void
  updateBuyStep: (step: number) => void
  setSellForm: (data: Partial<SellFormData>) => void
  addOrder: (order: Order) => void
  updateOrder: (id: string, updates: Partial<Order>) => void
  resetSell: () => void
  resetBuy: () => void
  setSupportContext: (ctx: string) => void
}

const initialSellForm: SellFormData = {
  game: '',
  server: '',
  level: '',
  description: '',
  price: 0,
  contactPhone: '',
}

const STORAGE_KEY = 'anxinhao_orders'

const loadOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveOrders = (orders: Order[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  } catch {}
}

export const useTradeStore = create<TradeState>((set, get) => ({
  sellStep: 0,
  buyStep: 0,
  currentOrder: null,
  orders: loadOrders(),
  accountInfo: null,
  sellForm: initialSellForm,
  supportContext: '',

  updateSellStep: (step) => set({ sellStep: step }),
  updateBuyStep: (step) => set({ buyStep: step }),
  setSellForm: (data) =>
    set((state) => ({ sellForm: { ...state.sellForm, ...data } })),
  addOrder: (order) => {
    const newOrders = [...get().orders, order]
    saveOrders(newOrders)
    set({ orders: newOrders })
  },
  updateOrder: (id, updates) => {
    const newOrders = get().orders.map((o) =>
      o.id === id ? { ...o, ...updates } : o
    )
    saveOrders(newOrders)
    set({ orders: newOrders })
  },
  resetSell: () => set({ sellStep: 0, sellForm: initialSellForm }),
  resetBuy: () => set({ buyStep: 0 }),
  setSupportContext: (ctx) => set({ supportContext: ctx }),
}))
