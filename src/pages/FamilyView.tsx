import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Shield, Check, AlertTriangle, Clock, Phone,
  Eye, Lock, RefreshCw, Link2Off, Info, FileText, Package
} from 'lucide-react'
import { useTradeStore, type Order } from '@/stores/useTradeStore'

const VIEWER_KEY_STORAGE = 'anxinhao_viewer_key'

const generateViewerKey = (): string => {
  try {
    let key = localStorage.getItem(VIEWER_KEY_STORAGE)
    if (!key) {
      key = `viewer_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      localStorage.setItem(VIEWER_KEY_STORAGE, key)
    }
    return key
  } catch {
    return `viewer_${Date.now()}`
  }
}

const FamilyView: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const shareCodeParam = searchParams.get('shareCode')
  const codeParam = searchParams.get('code')
  const orderId = searchParams.get('orderId')
  const [refreshKey, setRefreshKey] = useState(0)
  const [viewerKey] = useState<string>(() => generateViewerKey())

  const storeOrders = useTradeStore((s) => s.orders)
  const getOrderByShareCode = useTradeStore((s) => s.getOrderByShareCode)
  const addFamilyViewRecord = useTradeStore((s) => s.addFamilyViewRecord)
  const markFamilyViewCsClicked = useTradeStore((s) => s.markFamilyViewCsClicked)

  const shareCode = shareCodeParam || codeParam

  let order: Order | undefined
  if (shareCode) {
    order = getOrderByShareCode(shareCode) || storeOrders.find(o => o.familyShareCode === shareCode)
  }
  if (!order && orderId) {
    order = storeOrders.find(o => o.id === orderId)
  }

  const myRecord = useMemo(() => {
    if (!order) return null
    return order.familyViewRecords.find((r) => r.viewerKey === viewerKey)
  }, [order, viewerKey, refreshKey])

  useEffect(() => {
    if (order) {
      addFamilyViewRecord(order.id, viewerKey, '家人')
    }
  }, [order, viewerKey, refreshKey, addFamilyViewRecord])

  if (!order) {
    return (
      <div className="min-h-screen bg-warm-bg flex flex-col items-center p-6">
        <div className="w-full max-w-md flex flex-col items-center pt-8">
          <div className="w-24 h-24 bg-danger/10 rounded-full flex items-center justify-center mb-6">
            <Link2Off className="w-12 h-12 text-danger" />
          </div>

          <h1 className="text-elder-xl font-bold text-warm-text text-center mb-3">
            链接已失效
          </h1>

          <p className="text-elder-base text-warm-muted text-center mb-8 px-4">
            这个分享链接已经失效了，请让下单的家人重新分享给您
          </p>

          <div className="elder-card w-full mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-brand" />
              <span className="text-elder-base font-bold text-warm-text">重新获取链接步骤</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-brand font-bold text-elder-sm">1</span>
                </div>
                <p className="text-elder-sm text-warm-text pt-1">让下单的家人打开安心号App</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-brand font-bold text-elder-sm">2</span>
                </div>
                <p className="text-elder-sm text-warm-text pt-1">点击底部"订单进度"，找到对应的订单</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-brand font-bold text-elder-sm">3</span>
                </div>
                <p className="text-elder-sm text-warm-text pt-1">点击订单展开详情，找到"家人共享"区域</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-brand font-bold text-elder-sm">4</span>
                </div>
                <p className="text-elder-sm text-warm-text pt-1">点击"复制分享链接"，再重新发给您</p>
              </div>
            </div>
          </div>

          <div className="elder-card w-full bg-brand-50 border-2 border-brand/30 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-6 h-6 text-brand" />
              <span className="text-elder-base font-bold text-brand">如有疑问请拨打客服</span>
            </div>
            <button
              onClick={() => window.open('tel:4001234567')}
              className="elder-btn-primary w-full text-elder-lg py-4"
            >
              <Phone className="w-7 h-7" />
              400-123-4567
            </button>
          </div>

          <div className="text-center pt-4">
            <p className="text-elder-xs text-warm-muted">
              安心号 · 平台担保交易
            </p>
          </div>
        </div>
      </div>
    )
  }

  const hasTimeout = order.steps.some(s => s.status === 'timeout')
  const activeStep = order.steps.find(s => s.status === 'active' || s.status === 'timeout')

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleCsPhone = () => {
    markFamilyViewCsClicked(order!.id, viewerKey)
    window.open('tel:4001234567')
  }

  const handleGoReceipt = () => {
    navigate(`/receipt-package?orderId=${order!.id}&family=1`)
  }

  return (
    <div className="min-h-screen bg-warm-bg">
      <div className="bg-gradient-to-r from-brand to-brand-dark p-4 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full flex items-center gap-2">
            <Eye className="w-4 h-4 text-white" />
            <span className="text-elder-sm font-bold text-white">家人查看模式</span>
            <Lock className="w-4 h-4 text-white/80" />
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 text-elder-sm text-white font-semibold bg-white/20 px-4 py-2 rounded-full active:bg-white/30 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            刷新
          </button>
        </div>

        <div className="bg-white rounded-elder p-5 shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-elder-xs text-warm-muted font-mono">{order.id}</span>
                <span className={`text-elder-xs font-bold px-2.5 py-1 rounded-full ${
                  order.status === '已完成' ? 'bg-safe/10 text-safe' :
                  order.status === '异常超时' ? 'bg-danger/10 text-danger' :
                  'bg-brand-100 text-brand'
                }`}>
                  {order.status}
                </span>
                <span className={`text-elder-xs font-bold px-2.5 py-1 rounded-full ${
                  order.type === 'sell' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                }`}>
                  {order.type === 'sell' ? '卖号' : '买号'}
                </span>
                {myRecord && myRecord.hasRead && (
                  <span className="text-elder-xs font-bold px-2.5 py-1 rounded-full bg-safe/10 text-safe flex items-center gap-1">
                    <Check className="w-3 h-3" /> 已读
                  </span>
                )}
              </div>
              <h1 className="text-elder-xl font-bold text-warm-text mb-1">
                {order.game}
              </h1>
              {order.server && (
                <p className="text-elder-sm text-warm-muted">{order.server}</p>
              )}
              {order.level && (
                <p className="text-elder-sm text-warm-muted">{order.level}</p>
              )}
            </div>
          </div>

          <div className="border-t border-warm-border pt-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-elder-sm text-warm-muted mb-1">交易金额</p>
                <div className="flex items-baseline">
                  <span className="text-elder-sm text-brand font-semibold">¥</span>
                  <span className="text-4xl font-bold text-brand tracking-tight">
                    {order.amount}
                  </span>
                </div>
              </div>
              <button
                onClick={handleGoReceipt}
                className="flex items-center gap-1.5 text-elder-sm text-brand font-semibold bg-brand-50 px-4 py-2.5 rounded-full active:bg-brand-100 transition-colors border border-brand/20"
              >
                <Package className="w-4 h-4" />
                查看材料包
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 -mt-4 space-y-4">
        <div className={`rounded-elder p-4 ${
          hasTimeout
            ? 'bg-danger/10 border-2 border-danger/30'
            : 'bg-brand-50 border-2 border-brand/20'
        }`}>
          <div className="flex items-start gap-3">
            {hasTimeout ? (
              <AlertTriangle className="w-7 h-7 text-danger flex-shrink-0" />
            ) : (
              <Clock className="w-7 h-7 text-brand flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className={`text-elder-base font-bold ${
                hasTimeout ? 'text-danger' : 'text-brand'
              }`}>
                {hasTimeout ? '⚠️ 有步骤超时' : '当前状态'}
              </p>
              <p className="text-elder-base text-warm-text mt-1 font-semibold">
                {activeStep ? activeStep.name : order.status}
              </p>
              {activeStep?.hint && (
                <p className="text-elder-sm text-warm-muted mt-2">{activeStep.hint}</p>
              )}
            </div>
          </div>
        </div>

        <div className="elder-card">
          <h3 className="text-elder-base font-bold text-warm-text mb-4 flex items-center gap-2">
            <div className="w-1.5 h-5 bg-brand rounded-full" />
            订单进度
          </h3>
          <div className="space-y-0">
            {order.steps.map((step, i) => (
              <div key={step.name} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.status === 'completed' ? 'bg-safe text-white'
                    : step.status === 'active' ? 'bg-brand text-white'
                    : step.status === 'timeout' ? 'bg-danger text-white'
                    : 'bg-warm-border text-warm-muted'
                  }`}>
                    {step.status === 'completed' ? <Check className="w-4 h-4" />
                    : step.status === 'timeout' ? <AlertTriangle className="w-4 h-4" />
                    : <span className="text-elder-xs font-bold">{i + 1}</span>}
                  </div>
                  {i < order.steps.length - 1 && (
                    <div className={`w-0.5 flex-1 my-1 ${
                      step.status === 'completed' ? 'bg-safe/40' : 'bg-warm-border'
                    }`} />
                  )}
                </div>
                <div className="pb-5 flex-1 min-w-0">
                  <p className={`text-elder-sm font-semibold ${
                    step.status === 'pending' ? 'text-warm-muted' : 'text-warm-text'
                  }`}>{step.name}</p>
                  {step.time && <p className="text-elder-xs text-warm-muted mt-1">{step.time}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="elder-card bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="w-6 h-6 text-blue-600" />
            <span className="text-elder-base font-bold text-blue-700">联系客服</span>
          </div>
          <p className="text-elder-sm text-blue-800 mb-4">
            如有任何疑问，可随时拨打客服电话，我们会耐心为您解答
          </p>
          <button
            onClick={handleCsPhone}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-elder-lg rounded-elder py-4 flex items-center justify-center gap-2 shadow-lg transition-colors"
          >
            <Phone className="w-7 h-7" />
            立即拨打 400-123-4567
          </button>
          {myRecord && myRecord.clickedCsPhone && myRecord.lastCsClickAt && (
            <p className="text-elder-xs text-blue-700 mt-3 text-center">
              ✅ 您已于 {myRecord.lastCsClickAt} 拨打过客服
            </p>
          )}
        </div>

        <div className="elder-card bg-warn/10 border-2 border-warn/30">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-warn flex-shrink-0" />
            <span className="text-elder-base font-bold text-warn">安全提醒</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-warn rounded-full mt-2 flex-shrink-0" />
              <p className="text-elder-sm text-warm-text">不要帮别人操作转账或提供验证码</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-warn rounded-full mt-2 flex-shrink-0" />
              <p className="text-elder-sm text-warm-text">有问题让下单的家人联系客服</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-warn rounded-full mt-2 flex-shrink-0" />
              <p className="text-elder-sm text-warm-text">钱在平台保管，不会丢失</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-warn rounded-full mt-2 flex-shrink-0" />
              <p className="text-elder-sm text-warm-text">不要相信任何私下联系的"客服"</p>
            </div>
          </div>
        </div>

        <div className="elder-card">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-brand" />
            <span className="text-elder-base font-bold text-warm-text">交易凭证（只读）</span>
          </div>
          <p className="text-elder-sm text-warm-muted mb-3">
            家人端仅可查看，如需下载或转发请让下单人操作
          </p>
          <button
            onClick={handleGoReceipt}
            className="elder-btn-secondary w-full flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5" />
            查看所有交易凭证
          </button>
        </div>

        <div className="text-center py-4">
          <p className="text-elder-sm text-warm-muted font-semibold mb-1">
            🔒 只读页面，您无法操作或修改订单
          </p>
          <p className="text-elder-xs text-warm-muted mt-2">
            安心号 · 平台担保交易 · 安全可靠
          </p>
        </div>
      </div>
    </div>
  )
}

export default FamilyView
