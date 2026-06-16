import { create } from 'zustand'
import { mockOrders } from '@/data/mockData'

export interface StepItem {
  name: string
  status: 'completed' | 'active' | 'pending' | 'timeout'
  time?: string
  hint?: string
}

export interface FamilyViewRecord {
  id: string
  viewerKey: string
  viewerInfo?: string
  firstViewedAt: string
  lastViewedAt: string
  viewCount: number
  hasRead: boolean
  clickedCsPhone: boolean
  lastCsClickAt?: string
}

export interface ShareRecord {
  id: string
  time: string
  target: string
  channel: string
  shareCode: string
}

export interface CsContactRecord {
  id: string
  time: string
  reason: string
  timeoutNode?: string
  status: '待受理' | '处理中' | '已反馈' | '已解决'
  expectedFeedbackAt?: string
  acceptedAt?: string
  feedbackAt?: string
  resolvedAt?: string
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
  shareRecords: ShareRecord[]
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
  updateCsContactRecordStatus: (orderId: string, recordId: string, status: CsContactRecord['status'], notes?: string) => void
  addReceiptOperationLog: (orderId: string, log: Omit<ReceiptOperationLog, 'id'>) => void
  addFamilyViewRecord: (orderId: string, viewerKey: string, viewerInfo?: string) => void
  markFamilyViewCsClicked: (orderId: string, viewerKey: string) => void
  addShareRecord: (orderId: string, record: Omit<ShareRecord, 'id'>) => void
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
        shareRecords: o.shareRecords || [],
        familyViewRecords: (o.familyViewRecords || []).map((r: any) => ({
          id: r.id || `FV${Math.random().toString(36).slice(2, 10)}`,
          viewerKey: r.viewerKey || r.viewerInfo || '匿名家人',
          viewerInfo: r.viewerInfo,
          firstViewedAt: r.firstViewedAt || r.viewedAt || r.lastViewedAt || new Date().toLocaleString('zh-CN'),
          lastViewedAt: r.lastViewedAt || r.viewedAt || new Date().toLocaleString('zh-CN'),
          viewCount: r.viewCount || 1,
          hasRead: r.hasRead !== undefined ? r.hasRead : true,
          clickedCsPhone: r.clickedCsPhone || false,
          lastCsClickAt: r.lastCsClickAt,
        })),
        csContactRecords: (o.csContactRecords || []).map((r: any) => ({
          ...r,
          status: r.status || '待受理',
        })),
        receiptOperationLogs: o.receiptOperationLogs || [],
      }))
    }
    const mockIds = new Set(mockOrders.map((m) => m.id))
    const storedFiltered = stored.filter((s) => !mockIds.has(s.id))
    const mockMerged = mockOrders.map((mock) => {
      const found = stored.find((s) => s.id === mock.id)
      if (found) return found
      return {
        ...mock,
        shareRecords: (mock as any).shareRecords || [],
        familyViewRecords: (mock.familyViewRecords || []).map((r: any, i: number) => ({
          id: r.id || `FV${mock.id}${i}`,
          viewerKey: r.viewerKey || r.viewerInfo || '家人',
          viewerInfo: r.viewerInfo || '家人',
          firstViewedAt: r.firstViewedAt || r.viewedAt,
          lastViewedAt: r.lastViewedAt || r.viewedAt,
          viewCount: r.viewCount || 1,
          hasRead: true,
          clickedCsPhone: r.clickedCsPhone || false,
        })),
      } as Order
    })
    return [...mockMerged, ...storedFiltered]
  } catch {
    return mockOrders.map((mock) => ({
      ...mock,
      shareRecords: (mock as any).shareRecords || [],
      familyViewRecords: (mock.familyViewRecords || []).map((r: any, i: number) => ({
        id: r.id || `FV${mock.id}${i}`,
        viewerKey: r.viewerKey || r.viewerInfo || '家人',
        viewerInfo: r.viewerInfo || '家人',
        firstViewedAt: r.firstViewedAt || r.viewedAt,
        lastViewedAt: r.lastViewedAt || r.viewedAt,
        viewCount: r.viewCount || 1,
        hasRead: true,
        clickedCsPhone: r.clickedCsPhone || false,
      })),
    } as Order))
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
    const newRecord: CsContactRecord = {
      ...record,
      id: `CS${Date.now()}`,
      status: record.status || '待受理',
      acceptedAt: record.status === '待受理' ? undefined : record.acceptedAt,
    }
    const newOrders = get().orders.map((o) =>
      o.id === orderId
        ? { ...o, csContactRecords: [...o.csContactRecords, newRecord] }
        : o
    )
    saveOrders(newOrders)
    set({ orders: newOrders })
  },
  updateCsContactRecordStatus: (orderId, recordId, status, notes) => {
    const now = new Date().toLocaleString('zh-CN')
    const newOrders = get().orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            csContactRecords: o.csContactRecords.map((r) =>
              r.id === recordId
                ? {
                    ...r,
                    status,
                    notes: notes || r.notes,
                    acceptedAt: status === '处理中' && !r.acceptedAt ? now : r.acceptedAt,
                    feedbackAt: status === '已反馈' && !r.feedbackAt ? now : r.feedbackAt,
                    resolvedAt: status === '已解决' && !r.resolvedAt ? now : r.resolvedAt,
                  }
                : r
            ),
          }
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
  addFamilyViewRecord: (orderId, viewerKey, viewerInfo) => {
    const now = new Date().toLocaleString('zh-CN')
    const newOrders = get().orders.map((o) => {
      if (o.id !== orderId) return o
      const existing = o.familyViewRecords.find((r) => r.viewerKey === viewerKey)
      if (existing) {
        return {
          ...o,
          familyViewRecords: o.familyViewRecords.map((r) =>
            r.viewerKey === viewerKey
              ? { ...r, lastViewedAt: now, viewCount: r.viewCount + 1, hasRead: true }
              : r
          ),
        }
      }
      const newRecord: FamilyViewRecord = {
        id: `FV${Date.now()}`,
        viewerKey,
        viewerInfo: viewerInfo || viewerKey,
        firstViewedAt: now,
        lastViewedAt: now,
        viewCount: 1,
        hasRead: true,
        clickedCsPhone: false,
      }
      return { ...o, familyViewRecords: [...o.familyViewRecords, newRecord] }
    })
    saveOrders(newOrders)
    set({ orders: newOrders })
  },
  markFamilyViewCsClicked: (orderId, viewerKey) => {
    const now = new Date().toLocaleString('zh-CN')
    const newOrders = get().orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            familyViewRecords: o.familyViewRecords.map((r) =>
              r.viewerKey === viewerKey
                ? { ...r, clickedCsPhone: true, lastCsClickAt: now }
                : r
            ),
          }
        : o
    )
    saveOrders(newOrders)
    set({ orders: newOrders })
  },
  addShareRecord: (orderId, record) => {
    const newRecord = { ...record, id: `SH${Date.now()}` }
    const newOrders = get().orders.map((o) =>
      o.id === orderId
        ? { ...o, shareRecords: [...o.shareRecords, newRecord] }
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
