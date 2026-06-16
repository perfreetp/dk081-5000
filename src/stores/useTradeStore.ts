import { create } from 'zustand'
import { mockOrders } from '@/data/mockData'

export interface StepItem {
  name: string
  status: 'completed' | 'active' | 'pending' | 'timeout'
  time?: string
  hint?: string
}

export interface FamilyViewRecord {
  viewedAt: string
  viewerInfo?: string
}

export interface CsContactRecord {
  id: string
  time: string
  reason: string
  timeoutNode?: string
  status: '待处理' | '处理中' | '已解决'
  expectedFeedbackAt?: string
  notes?: string
}

export interface ReceiptOperationLog {
  id: string
  type: 'download' | 'forward'
  docType: string
  time: string
  target?: string
}

export interface Order {
  id: string
  type: 'sell' | 'buy'
  game: string
  server?: string
  level?: string
  status: '进行中' | '已完成' | '异常超时'
  currentStep: number
  totalSteps: number
  amount: number
  createdAt: string
  completedAt?: string
  steps: StepItem[]
  sellFormInfo?: string
  contactPhone?: string
  familyShareCode?: string
  familyViewRecords: FamilyViewRecord[]
  csContactRecords: CsContactRecord[]
  receiptOperationLogs: ReceiptOperationLog[]
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
  supportContextDetail: {
    orderId?: string
    game?: string
    server?: string
    currentStep?: string
    reason?: string
    contactPhone?: string
    timeoutNode?: string
    expectedFeedbackAt?: string
  }

  updateSellStep: (step: number) => void
  updateBuyStep: (step: number) => void
  setSellForm: (data: Partial<SellFormData>) => void
  addOrder: (order: Order) => void
  updateOrder: (id: string, updates: Partial<Order>) => void
  resetSell: () => void
  resetBuy: () => void
  setSupportContext: (ctx: string) => void
  setSupportContextDetail: (detail: Partial<TradeState['supportContextDetail']>) => void
  addCsContactRecord: (orderId: string, record: Omit<CsContactRecord, 'id'>) => void
  addReceiptOperationLog: (orderId: string, log: Omit<ReceiptOperationLog, 'id'>) => void
  addFamilyViewRecord: (orderId: string, record: FamilyViewRecord) => void
  generateFamilyShareCode: (orderId: string) => string
  getOrderByShareCode: (code: string) => Order | undefined
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
    let stored: Order[] = []
    if (raw) {
      const parsed = JSON.parse(raw)
      stored = parsed.map((o: Order) => ({
        ...o,
        familyViewRecords: o.familyViewRecords || [],
        csContactRecords: o.csContactRecords || [],
        receiptOperationLogs: o.receiptOperationLogs || [],
      }))
    }
    const mockIds = new Set(mockOrders.map((m) => m.id))
    const storedFiltered = stored.filter((s) => !mockIds.has(s.id))
    const mockMerged = mockOrders.map((mock) => {
      const found = stored.find((s) => s.id === mock.id)
      if (found) return found
      return { ...mock } as Order
    })
    return [...mockMerged, ...storedFiltered]
  } catch {
    return mockOrders as Order[]
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
  supportContextDetail: {},

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
  setSupportContextDetail: (detail) =>
    set((state) => ({
      supportContextDetail: { ...state.supportContextDetail, ...detail },
    })),
  addCsContactRecord: (orderId, record) => {
    const newRecord = { ...record, id: `CS${Date.now()}` }
    const newOrders = get().orders.map((o) =>
      o.id === orderId
        ? { ...o, csContactRecords: [...o.csContactRecords, newRecord] }
        : o
    )
    saveOrders(newOrders)
    set({ orders: newOrders })
  },
  addReceiptOperationLog: (orderId, log) => {
    const newLog = { ...log, id: `LOG${Date.now()}` }
    const newOrders = get().orders.map((o) =>
      o.id === orderId
        ? { ...o, receiptOperationLogs: [...o.receiptOperationLogs, newLog] }
        : o
    )
    saveOrders(newOrders)
    set({ orders: newOrders })
  },
  addFamilyViewRecord: (orderId, record) => {
    const newOrders = get().orders.map((o) =>
      o.id === orderId
        ? { ...o, familyViewRecords: [...o.familyViewRecords, record] }
        : o
    )
    saveOrders(newOrders)
    set({ orders: newOrders })
  },
  generateFamilyShareCode: (orderId) => {
    const code = `AX${orderId.slice(-6)}${Date.now().toString().slice(-4)}`
    const newOrders = get().orders.map((o) =>
      o.id === orderId ? { ...o, familyShareCode: code } : o
    )
    saveOrders(newOrders)
    set({ orders: newOrders })
    return code
  },
  getOrderByShareCode: (code) => {
    return get().orders.find(
      (o) => o.familyShareCode === code || o.id === code
    )
  },
}))
