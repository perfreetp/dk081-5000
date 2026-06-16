import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, AlertTriangle, Volume2, Share2, FileText, Download, Forward, ClipboardList } from 'lucide-react'
import { useTradeStore } from '@/stores/useTradeStore'
import { mockOrders } from '@/data/mockData'

type TabKey = 'active' | 'completed'

const Orders: React.FC = () => {
  const navigate = useNavigate()
  const storeOrders = useTradeStore((s) => s.orders)
  const [activeTab, setActiveTab] = useState<TabKey>('active')
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)

  const allOrders = [...mockOrders, ...storeOrders]
  const filtered = allOrders.filter((o) =>
    activeTab === 'active' ? o.status === '进行中' : o.status === '已完成'
  )

  const hasTimeout = (order: typeof allOrders[number]) =>
    order.steps.some((s) => s.status === 'timeout')

  const handleShare = () => {
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const renderTimelineStep = (
    step: { name: string; status: string; time?: string },
    isLast: boolean
  ) => (
    <div key={step.name} className="flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
            step.status === 'completed'
              ? 'bg-safe text-white'
              : step.status === 'active'
              ? 'bg-warn text-white animate-pulse-slow'
              : step.status === 'timeout'
              ? 'bg-danger text-white animate-blink'
              : 'bg-warm-border text-warm-muted'
          }`}
        >
          {step.status === 'completed' ? (
            <Check className="w-4 h-4" />
          ) : step.status === 'timeout' ? (
            <AlertTriangle className="w-3 h-3" />
          ) : null}
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 bg-warm-border my-1" />
        )}
      </div>
      <div className="pb-5 flex-1 min-w-0">
        <p
          className={`text-elder-sm font-semibold ${
            step.status === 'pending' ? 'text-warm-muted' : 'text-warm-text'
          }`}
        >
          {step.name}
        </p>
        {step.time && (
          <p className="text-elder-xs text-warm-muted mt-0.5">{step.time}</p>
        )}
        {step.status === 'timeout' && (
          <p className="text-elder-xs text-danger mt-1">
            超时了{' '}
            <span
              className="text-brand underline"
              onClick={() => navigate('/support')}
            >
              联系客服
            </span>
          </p>
        )}
      </div>
    </div>
  )

  const renderExpanded = (order: typeof allOrders[number]) => (
    <div className="mt-4 pt-4 border-t border-warm-border">
      <div className="space-y-0">
        {order.steps.map((step, i) =>
          renderTimelineStep(step, i === order.steps.length - 1)
        )}
      </div>

      {hasTimeout(order) && (
        <div className="mt-4 bg-gradient-to-r from-danger/10 to-warn/10 rounded-elder p-4 flex items-center gap-3">
          <Volume2 className="w-6 h-6 text-danger flex-shrink-0" />
          <div className="flex-1">
            <p className="text-elder-sm font-semibold text-warm-text">
              这个步骤等太久了，建议联系客服
            </p>
          </div>
          <button
            className="elder-btn-primary text-elder-sm min-h-0 px-4 py-2"
            onClick={() => navigate('/support')}
          >
            立即联系
          </button>
        </div>
      )}

      <div className="mt-5">
        <p className="text-elder-base font-semibold text-warm-text mb-3">
          分享给家人一起看着
        </p>
        <button
          className="elder-btn-secondary w-full gap-2"
          onClick={handleShare}
        >
          <Share2 className="w-5 h-5" />
          生成分享链接
        </button>
        <p className="text-elder-xs text-warm-muted mt-2 text-center">
          家人只能查看，不能操作
        </p>
      </div>

      {order.status === '已完成' && (
        <div className="mt-5">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-brand" />
            <p className="text-elder-base font-semibold text-warm-text">
              交易凭证
            </p>
          </div>
          <div className="space-y-2">
            {[
              { type: '交易合同', date: order.createdAt },
              { type: '付款凭证', date: order.steps.find((s) => s.status === 'completed')?.time || '' },
              { type: '收款凭证', date: order.steps.slice(-1)[0]?.time || '' },
            ].map((r) => (
              <div
                key={r.type}
                className="flex items-center gap-3 bg-brand-50 rounded-elder-sm p-3"
              >
                <FileText className="w-5 h-5 text-brand flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-elder-sm font-semibold text-warm-text">{r.type}</p>
                  <p className="text-elder-xs text-warm-muted">{r.date}</p>
                </div>
                <button className="p-2 text-warm-muted active:text-brand">
                  <Download className="w-5 h-5" />
                </button>
                <button className="p-2 text-warm-muted active:text-brand">
                  <Forward className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-warm-bg pb-6">
      <div className="px-4 pt-4">
        <h1 className="elder-section-title mb-5">我的订单</h1>

        <div className="flex gap-6 mb-5 border-b border-warm-border">
          {(['active', 'completed'] as TabKey[]).map((tab) => (
            <button
              key={tab}
              className={`pb-2 text-elder-lg font-semibold transition-colors relative ${
                activeTab === tab ? 'text-brand' : 'text-warm-muted'
              }`}
              onClick={() => {
                setActiveTab(tab)
                setSelectedOrder(null)
              }}
            >
              {tab === 'active' ? '进行中' : '已完成'}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-full" />
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <ClipboardList className="w-16 h-16 text-warm-muted mb-4" />
            <p className="text-elder-lg text-warm-muted mb-6">还没有订单</p>
            <div className="flex gap-3">
              <button
                className="elder-btn-primary"
                onClick={() => navigate('/sell')}
              >
                去卖号
              </button>
              <button
                className="elder-btn-secondary"
                onClick={() => navigate('/buy')}
              >
                去买号
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <div
                key={order.id}
                className="elder-card cursor-pointer active:shadow-card-hover transition-shadow"
                onClick={() =>
                  setSelectedOrder(selectedOrder === order.id ? null : order.id)
                }
              >
                <div className="flex items-center justify-between">
                  <span className="text-elder-xs text-warm-muted">
                    {order.id}
                  </span>
                  <span
                    className={`text-elder-xs font-semibold px-2 py-0.5 rounded-full ${
                      order.type === 'sell'
                        ? 'bg-brand-100 text-brand-600'
                        : 'bg-safe/10 text-safe'
                    }`}
                  >
                    {order.type === 'sell' ? '卖号' : '买号'}
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-elder-lg font-bold text-warm-text">
                    {order.game}
                  </span>
                  <span className="text-elder-lg font-bold text-brand">
                    ¥{order.amount}
                  </span>
                </div>
                <p className="text-elder-sm text-warm-muted mt-1">
                  {order.steps[order.currentStep - 1]?.name || order.status}
                </p>

                {selectedOrder === order.id && renderExpanded(order)}
              </div>
            ))}
          </div>
        )}
      </div>

      {showToast && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-warm-text text-white text-elder-base px-6 py-3 rounded-elder shadow-lg z-50">
          分享链接已复制
        </div>
      )}
    </div>
  )
}

export default Orders
