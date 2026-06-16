import React from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Shield, Check, AlertTriangle, Clock, Phone,
  FileText, Eye, Lock
} from 'lucide-react'
import { useTradeStore, type Order } from '@/stores/useTradeStore'
import { mockOrders } from '@/data/mockData'

const FamilyView: React.FC = () => {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const storeOrders = useTradeStore((s) => s.orders)
  const allOrders = [...mockOrders, ...storeOrders]
  const order = allOrders.find(o => o.id === orderId)

  if (!order) {
    return (
      <div className="min-h-screen bg-warm-bg flex flex-col items-center justify-center p-6">
        <AlertTriangle className="w-16 h-16 text-warm-muted mb-4" />
        <p className="text-elder-lg text-warm-muted">找不到这个订单</p>
        <p className="text-elder-sm text-warm-muted mt-2">请确认链接是否正确，或让家人重新分享</p>
      </div>
    )
  }

  const hasTimeout = order.steps.some(s => s.status === 'timeout')
  const activeStep = order.steps.find(s => s.status === 'active' || s.status === 'timeout')

  return (
    <div className="min-h-screen bg-warm-bg">
      <div className="bg-safe text-white p-4 flex items-center gap-3">
        <Eye className="w-6 h-6" />
        <div>
          <p className="text-elder-lg font-bold">家人查看模式</p>
          <p className="text-elder-sm text-white/80">只能查看，不能操作订单</p>
        </div>
        <Lock className="w-5 h-5 ml-auto opacity-60" />
      </div>

      <div className="p-4 space-y-4">
        <div className="elder-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-elder-xs text-warm-muted">{order.id}</span>
            <span className={`text-elder-xs font-semibold px-2 py-1 rounded-full ${
              order.type === 'sell' ? 'bg-brand-100 text-brand-600' : 'bg-safe/10 text-safe'
            }`}>
              {order.type === 'sell' ? '卖号' : '买号'}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-elder-lg font-bold text-warm-text">{order.game}</span>
            <span className="text-elder-lg font-bold text-brand">¥{order.amount}</span>
          </div>
          <p className="text-elder-sm text-warm-muted mt-1">下单时间：{order.createdAt}</p>
        </div>

        <div className={`rounded-elder p-4 ${
          hasTimeout
            ? 'bg-danger/10 border border-danger/30'
            : 'bg-brand-50 border border-brand/20'
        }`}>
          <div className="flex items-start gap-3">
            {hasTimeout ? (
              <AlertTriangle className="w-6 h-6 text-danger flex-shrink-0" />
            ) : (
              <Clock className="w-6 h-6 text-brand flex-shrink-0" />
            )}
            <div>
              <p className={`text-elder-base font-bold ${
                hasTimeout ? 'text-danger' : 'text-brand'
              }`}>
                {hasTimeout ? '⚠️ 有步骤超时' : '当前状态'}
              </p>
              <p className="text-elder-sm text-warm-text mt-1">
                {activeStep ? activeStep.name : order.status}
              </p>
              {activeStep?.hint && (
                <p className="text-elder-sm text-warm-muted mt-1">{activeStep.hint}</p>
              )}
            </div>
          </div>
        </div>

        <div className="elder-card">
          <h3 className="text-elder-base font-bold text-warm-text mb-3">订单进度</h3>
          <div className="space-y-0">
            {order.steps.map((step, i) => (
              <div key={step.name} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.status === 'completed' ? 'bg-safe text-white'
                    : step.status === 'active' ? 'bg-brand text-white'
                    : step.status === 'timeout' ? 'bg-danger text-white'
                    : 'bg-warm-border text-warm-muted'
                  }`}>
                    {step.status === 'completed' ? <Check className="w-3 h-3" />
                    : step.status === 'timeout' ? <AlertTriangle className="w-3 h-3" />
                    : null}
                  </div>
                  {i < order.steps.length - 1 && (
                    <div className={`w-0.5 flex-1 my-1 ${
                      step.status === 'completed' ? 'bg-safe/40' : 'bg-warm-border'
                    }`} />
                  )}
                </div>
                <div className="pb-4 flex-1 min-w-0">
                  <p className={`text-elder-sm font-semibold ${
                    step.status === 'pending' ? 'text-warm-muted' : 'text-warm-text'
                  }`}>{step.name}</p>
                  {step.time && <p className="text-elder-xs text-warm-muted">{step.time}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="elder-card bg-warn/10 border border-warn/30">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-6 h-6 text-warn flex-shrink-0" />
            <span className="text-elder-base font-bold text-warn">安全提醒</span>
          </div>
          <div className="space-y-2">
            <p className="text-elder-sm text-warm-text">· 不要帮别人操作转账或提供验证码</p>
            <p className="text-elder-sm text-warm-text">· 有问题让下单的家人联系客服</p>
            <p className="text-elder-sm text-warm-text">· 钱在平台保管，不会丢失</p>
            <p className="text-elder-sm text-warm-text">· 不要相信任何私下联系的"客服"</p>
          </div>
        </div>

        <div className="elder-card">
          <div className="flex items-center gap-2 mb-3">
            <Phone className="w-5 h-5 text-brand" />
            <p className="text-elder-base font-semibold text-warm-text">联系客服</p>
          </div>
          <p className="text-elder-sm text-warm-muted mb-3">如有疑问，可以让下单的家人联系客服，或者直接拨打：</p>
          <button
            onClick={() => window.open('tel:4001234567')}
            className="elder-btn-primary w-full flex items-center justify-center gap-2"
          >
            <Phone className="w-5 h-5" />
            拨打客服电话 400-123-4567
          </button>
        </div>

        <div className="text-center py-4">
          <p className="text-elder-xs text-warm-muted">
            这是只读页面，您无法操作或修改订单
          </p>
          <p className="text-elder-xs text-warm-muted mt-1">
            安心号 · 平台担保交易
          </p>
        </div>
      </div>
    </div>
  )
}

export default FamilyView
