import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Check, AlertTriangle, Volume2, Share2, FileText,
  Download, Forward, ClipboardList, Phone, Clock, Shield,
  Users, Copy, CheckCircle2, MessageSquare, Hourglass
} from 'lucide-react'
import { useTradeStore, type Order } from '@/stores/useTradeStore'
import { mockOrders } from '@/data/mockData'

type TabKey = 'active' | 'timeout' | 'completed'

const stepHintMap: Record<string, string> = {
  '提交账号信息': '您已提交，平台正在审核',
  '平台验号': '平台在检查账号信息真不真实，一般1-2小时',
  '买家付款至担保': '正在等买家付款，钱到平台保管，您不用着急',
  '卖家换绑账号': '该您操作了！客服会电话教您一步步换绑，不确定就打客服电话',
  '平台放款': '换绑完成，平台正在把钱打到您的账户',
  '选购账号': '您已选定账号',
  '确认购买': '购买已确认',
  '付款至担保账户': '您的钱已在平台保管，安全！不会到卖家手里',
  '买家验收确认': '等卖家换绑完成后，您确认没问题才算交易完成',
}

const getStepHint = (stepName: string, status: string, orderType: string): string => {
  if (status === 'timeout') {
    const isSell = orderType === 'sell'
    if (stepName.includes('换绑')) {
      return isSell
        ? '换绑超时了！您的账号还安全，请联系客服，客服会手把手教您操作'
        : '卖家换绑超时了！您的钱还在平台保管，不会丢。建议联系客服催促卖家'
    }
    if (stepName.includes('验号')) return '验号超时了，平台正在加急处理，您也可以联系客服了解情况'
    if (stepName.includes('付款')) return '买家付款超时，平台会催促买家，您也可以联系客服'
    return '这一步超时了，建议联系客服了解情况'
  }
  return stepHintMap[stepName] || ''
}

const getActiveStepInfo = (order: Order): string => {
  const activeStep = order.steps.find(s => s.status === 'active' || s.status === 'timeout')
  if (!activeStep) return ''
  if (activeStep.status === 'timeout') {
    if (activeStep.name.includes('换绑') && order.type === 'sell') {
      return '该您换绑了，但好像卡住了——别急，打客服电话，我们手把手教您'
    }
    if (activeStep.name.includes('换绑') && order.type === 'buy') {
      return '卖家换绑超时了，您的钱安全，客服会帮您催卖家'
    }
    return '这一步等太久了，建议联系客服'
  }
  if (activeStep.name.includes('付款') && order.type === 'sell') {
    return '正在等买家付钱，您的钱由平台保管，到账了会通知您'
  }
  if (activeStep.name.includes('换绑') && order.type === 'sell') {
    return '现在该您换绑了！不确定怎么操作？点下面电话按钮，客服教您'
  }
  if (activeStep.name.includes('验号')) {
    return '平台正在验号，稍等一下就好'
  }
  return activeStep.name + ' 进行中'
}

const formatDate = (date: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const Orders: React.FC = () => {
  const navigate = useNavigate()
  const storeOrders = useTradeStore((s) => s.orders)
  const setSupportContext = useTradeStore((s) => s.setSupportContext)
  const addCsContactRecord = useTradeStore((s) => s.addCsContactRecord)
  const addReceiptOperationLog = useTradeStore((s) => s.addReceiptOperationLog)
  const generateFamilyShareCode = useTradeStore((s) => s.generateFamilyShareCode)
  const [activeTab, setActiveTab] = useState<TabKey>('active')
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const allOrders = [...mockOrders, ...storeOrders]

  const filtered = allOrders.filter((o) => {
    if (activeTab === 'active') return o.status === '进行中'
    if (activeTab === 'timeout') return o.status === '异常超时'
    return o.status === '已完成'
  })

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 2500)
  }

  const handleShare = (order: Order) => {
    let code = order.familyShareCode
    if (!code) {
      code = generateFamilyShareCode(order.id)
    }
    const shareUrl = `${window.location.origin}/family-view?orderId=${order.id}&code=${code}`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('链接已复制，发给家人就能看订单进度')
      }).catch(() => {
        showToast('链接已复制，发给家人就能看订单进度')
      })
    } else {
      showToast('链接已复制，发给家人就能看订单进度')
    }
  }



  const handleAddCsContact = (order: Order, reason: string) => {
    const now = new Date()
    const expectedAt = new Date(now.getTime() + 2 * 60 * 60 * 1000)
    addCsContactRecord(order.id, {
      time: formatDate(now),
      reason,
      status: '待处理',
      expectedFeedbackAt: formatDate(expectedAt),
    })
    showToast('已提交客服处理，预计2小时内回复')
  }

  const handleTimeoutContact = (order: Order) => {
    const timeoutStep = order.steps.find(s => s.status === 'timeout')
    if (!timeoutStep) return
    const now = new Date()
    const expectedAt = new Date(now.getTime() + 2 * 60 * 60 * 1000)
    addCsContactRecord(order.id, {
      time: formatDate(now),
      reason: `${timeoutStep.name}超时，请求协助`,
      timeoutNode: timeoutStep.name,
      status: '待处理',
      expectedFeedbackAt: formatDate(expectedAt),
    })
    showToast('已提交超时处理申请，客服会尽快联系您')
  }

  const handleDownload = (order: Order, docType: string) => {
    const now = new Date()
    addReceiptOperationLog(order.id, {
      type: 'download',
      docType,
      time: formatDate(now),
    })
    showToast(`${docType}已保存到手机，可在文件管理中查看`)
  }

  const handleForward = (order: Order, docType: string) => {
    const now = new Date()
    addReceiptOperationLog(order.id, {
      type: 'forward',
      docType,
      time: formatDate(now),
    })
    showToast(`${docType}分享链接已复制`)
  }

  const handleForwardAll = (order: Order) => {
    const docs = getReceiptDocs(order)
    const now = new Date()
    docs.forEach(doc => {
      addReceiptOperationLog(order.id, {
        type: 'forward',
        docType: doc.type,
        time: formatDate(now),
        target: '家人',
      })
    })
    showToast('全部凭证已打包，可转发给家人')
  }

  const renderTimelineStep = (
    step: Order['steps'][0],
    isLast: boolean,
    order: Order
  ) => (
    <div className="flex gap-3" key={step.name}>
      <div className="flex flex-col items-center">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
            step.status === 'completed'
              ? 'bg-safe text-white'
              : step.status === 'active'
              ? 'bg-brand text-white animate-pulse-slow'
              : step.status === 'timeout'
              ? 'bg-danger text-white animate-blink'
              : 'bg-warm-border text-warm-muted'
          }`}
        >
          {step.status === 'completed' ? (
            <Check className="w-4 h-4" />
          ) : step.status === 'timeout' ? (
            <AlertTriangle className="w-4 h-4" />
          ) : null}
        </div>
        {!isLast && (
          <div className={`w-0.5 flex-1 my-1 ${
            step.status === 'completed' ? 'bg-safe/40' : 'bg-warm-border'
          }`} />
        )}
      </div>
      <div className="pb-5 flex-1 min-w-0">
        <p className={`text-elder-base font-semibold ${
          step.status === 'pending' ? 'text-warm-muted' : 'text-warm-text'
        }`}>
          {step.name}
        </p>
        {step.time && (
          <p className="text-elder-xs text-warm-muted mt-0.5">{step.time}</p>
        )}
        {step.hint && (step.status === 'active' || step.status === 'timeout') && (
          <p className={`text-elder-sm mt-1 leading-relaxed ${
            step.status === 'timeout' ? 'text-danger font-semibold' : 'text-brand'
          }`}>
            {step.hint}
          </p>
        )}
        {!step.hint && (step.status === 'active' || step.status === 'timeout') && (
          <p className={`text-elder-sm mt-1 leading-relaxed ${
            step.status === 'timeout' ? 'text-danger font-semibold' : 'text-brand'
          }`}>
            {getStepHint(step.name, step.status, order.type)}
          </p>
        )}
        {step.status === 'timeout' && (
          <button
            className="mt-2 flex items-center gap-1 text-brand text-elder-sm font-semibold underline"
            onClick={(e) => { e.stopPropagation(); handleTimeoutContact(order) }}
          >
            <Phone className="w-4 h-4" />
            联系客服处理
          </button>
        )}
      </div>
    </div>
  )

  const getReceiptDocs = (order: Order) => {
    const docs = [
      { type: '交易合同', time: order.createdAt, desc: '平台担保交易协议', ready: true },
    ]
    const payStep = order.steps.find(s =>
      s.name.includes('付款') && s.status === 'completed'
    )
    if (payStep) {
      docs.push({
        type: order.type === 'sell' ? '收款确认' : '付款凭证',
        time: payStep.time || '',
        desc: order.type === 'sell' ? '平台确认已收到买家款项' : '您已付款至平台担保账户',
        ready: true,
      })
    }
    const bindStep = order.steps.find(s =>
      s.name.includes('换绑') && s.status === 'completed'
    )
    if (bindStep) {
      docs.push({
        type: '换绑确认书',
        time: bindStep.time || '',
        desc: '账号已成功换绑，双方确认',
        ready: true,
      })
    }
    if (order.status === '已完成') {
      docs.push({
        type: '交易完成确认',
        time: order.completedAt || order.steps.slice(-1)[0]?.time || '',
        desc: '交易全部完成，凭证可留存备查',
        ready: true,
      })
    }
    return docs
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case '待处理':
        return 'bg-warn/10 text-warn'
      case '处理中':
        return 'bg-brand/10 text-brand'
      case '已解决':
        return 'bg-safe/10 text-safe'
      default:
        return 'bg-warm-border text-warm-muted'
    }
  }

  const renderExpanded = (order: Order) => {
    const activeInfo = getActiveStepInfo(order)
    const hasTimeout = order.steps.some(s => s.status === 'timeout')
    const receiptDocs = getReceiptDocs(order)
    const sortedCsRecords = [...order.csContactRecords].reverse()
    const sortedReceiptLogs = [...order.receiptOperationLogs].reverse()

    return (
      <div className="mt-4 pt-4 border-t border-warm-border" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-brand-50 to-warm-bg rounded-elder p-4 mb-4 border border-brand/20">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-elder-xs text-warm-muted">{order.id}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-elder-xs font-semibold px-2 py-0.5 rounded-full ${
                  order.type === 'sell' ? 'bg-brand-100 text-brand-600' : 'bg-safe/10 text-safe'
                }`}>
                  {order.type === 'sell' ? '卖号' : '买号'}
                </span>
                {order.status === '已完成' ? (
                  <span className="text-elder-xs font-semibold px-2 py-0.5 rounded-full bg-safe/10 text-safe flex items-center gap-1">
                    <Check className="w-3 h-3" /> 已完成
                  </span>
                ) : hasTimeout ? (
                  <span className="text-elder-xs font-semibold px-2 py-0.5 rounded-full bg-danger/10 text-danger flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> 异常超时
                  </span>
                ) : (
                  <span className="text-elder-xs font-semibold px-2 py-0.5 rounded-full bg-brand/10 text-brand flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 进行中
                  </span>
                )}
              </div>
            </div>
            <p className="text-elder-xl font-bold text-brand">¥{order.amount}</p>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand flex-shrink-0" />
            <div>
              <p className="text-elder-base font-semibold text-warm-text">{order.game}</p>
              {order.server && <p className="text-elder-sm text-warm-muted">{order.server}</p>}
            </div>
          </div>
          {order.status === '已完成' && order.completedAt && (
            <div className="mt-3 pt-3 border-t border-brand/10">
              <p className="text-elder-sm text-warm-muted">
                完成时间：<span className="text-warm-text font-semibold">{order.completedAt}</span>
              </p>
            </div>
          )}
        </div>

        {activeInfo && (
          <div className={`rounded-elder p-4 mb-4 ${
            hasTimeout
              ? 'bg-danger/10 border border-danger/30'
              : 'bg-brand-50 border border-brand/20'
          }`}>
            <div className="flex items-start gap-3">
              {hasTimeout ? (
                <AlertTriangle className="w-6 h-6 text-danger flex-shrink-0 mt-0.5" />
              ) : (
                <Clock className="w-6 h-6 text-brand flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`text-elder-base font-bold ${
                  hasTimeout ? 'text-danger' : 'text-brand'
                }`}>
                  {hasTimeout ? '⚠️ 有步骤超时了' : '当前进度'}
                </p>
                <p className={`text-elder-sm mt-1 leading-relaxed ${
                  hasTimeout ? 'text-warm-text' : 'text-warm-muted'
                }`}>
                  {activeInfo}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-0 mb-5">
          {order.steps.map((step, i) =>
            renderTimelineStep(step, i === order.steps.length - 1, order)
          )}
        </div>

        {hasTimeout && (
          <div className="mb-5 bg-gradient-to-r from-danger/10 to-warn/10 rounded-elder p-4 flex items-center gap-3">
            <Volume2 className="w-6 h-6 text-danger flex-shrink-0" />
            <div className="flex-1">
              <p className="text-elder-sm font-semibold text-warm-text">
                有步骤超时了，您的钱在平台很安全，不会丢
              </p>
            </div>
            <button
              className="elder-btn-primary text-elder-sm min-h-0 px-4 py-2"
              onClick={() => handleTimeoutContact(order)}
            >
              联系客服
            </button>
          </div>
        )}

        <div className="mb-5">
          <p className="text-elder-base font-semibold text-warm-text mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-brand" />
            家人共享
          </p>
          <div className="bg-brand-50 rounded-elder p-4 border border-brand/20">
            {order.familyShareCode ? (
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-elder-xs text-warm-muted">分享码</p>
                  <p className="text-elder-base font-mono font-bold text-warm-text">{order.familyShareCode}</p>
                </div>
                <button
                  className="elder-btn-secondary gap-2"
                  onClick={() => handleShare(order)}
                >
                  <Copy className="w-5 h-5" />
                  复制分享链接
                </button>
              </div>
            ) : (
              <button
                className="elder-btn-secondary w-full gap-2 mb-3"
                onClick={() => handleShare(order)}
              >
                <Share2 className="w-5 h-5" />
                生成家人查看链接
              </button>
            )}
            {order.familyViewRecords.length > 0 && (
              <div className="pt-3 border-t border-brand/10">
                <p className="text-elder-sm text-warm-text mb-2">
                  已有<span className="text-brand font-bold">{order.familyViewRecords.length}</span>位家人查看过
                </p>
                <div className="space-y-2">
                  {order.familyViewRecords.map((record, i) => (
                    <div key={i} className="flex items-center justify-between text-elder-sm">
                      <span className="text-warm-muted">{record.viewedAt}</span>
                      <span className="text-warm-text">{record.viewerInfo || '家人'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-elder-base font-semibold text-warm-text flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand" />
              客服联系记录
            </p>
            <button
              className="elder-btn-secondary text-elder-sm min-h-0 px-3 py-1.5 gap-1"
              onClick={() => handleAddCsContact(order, '主动联系客服咨询')}
            >
              <Phone className="w-4 h-4" />
              联系客服
            </button>
          </div>
          {sortedCsRecords.length === 0 ? (
            <div className="bg-warm-bg rounded-elder p-6 text-center">
              <MessageSquare className="w-10 h-10 text-warm-muted mx-auto mb-2" />
              <p className="text-elder-sm text-warm-muted">暂无客服联系记录</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedCsRecords.map((record) => (
                <div key={record.id} className="bg-warm-bg rounded-elder p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-elder-sm font-semibold text-warm-text">{record.reason}</p>
                    <span className={`text-elder-xs font-semibold px-2 py-0.5 rounded-full ${getStatusBadgeColor(record.status)}`}>
                      {record.status}
                    </span>
                  </div>
                  <p className="text-elder-xs text-warm-muted mb-2">{record.time}</p>
                  {record.expectedFeedbackAt && (
                    <p className="text-elder-sm text-warn mb-2 flex items-center gap-1">
                      <Hourglass className="w-4 h-4" />
                      预计反馈时间：{record.expectedFeedbackAt}
                    </p>
                  )}
                  {record.notes && (
                    <p className="text-elder-sm text-warm-text bg-brand-50 rounded-lg p-2">
                      {record.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-brand" />
            <p className="text-elder-base font-semibold text-warm-text">交易凭证</p>
          </div>
          <div className="space-y-2">
            {receiptDocs.map((doc) => (
              <div
                key={doc.type}
                className="flex items-center gap-3 bg-brand-50 rounded-elder-sm p-3"
              >
                <FileText className="w-5 h-5 text-brand flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-elder-sm font-semibold text-warm-text">{doc.type}</p>
                  <p className="text-elder-xs text-warm-muted">{doc.desc}</p>
                  {doc.time && <p className="text-elder-xs text-warm-muted">{doc.time}</p>}
                </div>
                <button
                  className="p-2 text-warm-muted active:text-safe rounded-lg active:bg-safe/10 transition-colors"
                  onClick={() => handleDownload(order, doc.type)}
                  title="下载"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  className="p-2 text-warm-muted active:text-brand rounded-lg active:bg-brand/10 transition-colors"
                  onClick={() => handleForward(order, doc.type)}
                  title="转发"
                >
                  <Forward className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          {sortedReceiptLogs.length > 0 && (
            <div className="mt-4 pt-4 border-t border-warm-border">
              <p className="text-elder-sm font-semibold text-warm-text mb-3">最近操作记录</p>
              <div className="space-y-2">
                {sortedReceiptLogs.map((log) => (
                  <div key={log.id} className="flex items-center gap-3 text-elder-sm">
                    {log.type === 'download' ? (
                      <Download className="w-4 h-4 text-safe flex-shrink-0" />
                    ) : (
                      <Forward className="w-4 h-4 text-brand flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <span className="text-warm-text">
                        {log.type === 'download' ? '已下载' : '已转发'} {log.docType}
                      </span>
                      {log.target && (
                        <span className="text-warm-muted ml-2">→ {log.target}</span>
                      )}
                    </div>
                    <span className="text-warm-muted text-elder-xs">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {order.status === '已完成' && (
          <div className="bg-gradient-to-br from-safe/20 via-brand/10 to-warm-bg rounded-elder p-5 border border-safe/30">
            <div className="text-center mb-4">
              <p className="text-elder-xl font-bold text-warm-text mb-1">🎉 交易已完成</p>
              <p className="text-elder-base text-warm-text">
                您的{order.game}账号交易已完成，¥{order.amount}已到账
              </p>
            </div>
            <div className="bg-white/60 rounded-elder p-4 mb-4">
              <p className="text-elder-sm font-semibold text-warm-text mb-3">交易文档清单</p>
              <div className="space-y-2">
                {receiptDocs.map((doc) => (
                  <div key={doc.type} className="flex items-center gap-2 text-elder-sm">
                    {doc.ready ? (
                      <CheckCircle2 className="w-5 h-5 text-safe flex-shrink-0" />
                    ) : (
                      <Hourglass className="w-5 h-5 text-warn flex-shrink-0" />
                    )}
                    <span className={doc.ready ? 'text-warm-text' : 'text-warm-muted'}>
                      {doc.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <button
              className="elder-btn-primary w-full gap-2 mb-4"
              onClick={() => handleForwardAll(order)}
            >
              <Share2 className="w-5 h-5" />
              一键转发给家人
            </button>
            {order.familyViewRecords.length > 0 && (
              <div className="pt-4 border-t border-safe/20">
                <p className="text-elder-sm text-warm-text mb-2">
                  家人查看记录（共{order.familyViewRecords.length}人）
                </p>
                <div className="space-y-1">
                  {order.familyViewRecords.map((record, i) => (
                    <div key={i} className="flex items-center justify-between text-elder-xs">
                      <span className="text-warm-muted">{record.viewedAt}</span>
                      <span className="text-warm-text">{record.viewerInfo || '家人'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const getOrderStatusBadge = (order: Order) => {
    if (order.status === '异常超时' || order.steps.some(s => s.status === 'timeout')) {
      return (
        <span className="text-elder-xs font-semibold px-2 py-1 rounded-full bg-danger/10 text-danger flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          超时
        </span>
      )
    }
    if (order.status === '已完成') {
      return (
        <span className="text-elder-xs font-semibold px-2 py-1 rounded-full bg-safe/10 text-safe flex items-center gap-1">
          <Check className="w-3 h-3" />
          完成
        </span>
      )
    }
    return (
      <span className="text-elder-xs font-semibold px-2 py-1 rounded-full bg-brand/10 text-brand flex items-center gap-1">
        <Clock className="w-3 h-3" />
        进行中
      </span>
    )
  }

  const tabConfig: { key: TabKey; label: string; count: number }[] = [
    { key: 'active', label: '进行中', count: allOrders.filter(o => o.status === '进行中').length },
    { key: 'timeout', label: '异常超时', count: allOrders.filter(o => o.status === '异常超时').length },
    { key: 'completed', label: '已完成', count: allOrders.filter(o => o.status === '已完成').length },
  ]

  return (
    <div className="min-h-screen bg-warm-bg pb-6">
      <div className="px-4 pt-4">
        <h1 className="elder-section-title mb-5">我的订单</h1>

        <div className="flex gap-2 mb-5 border-b border-warm-border">
          {tabConfig.map((tab) => (
            <button
              key={tab.key}
              className={`pb-2 text-elder-base font-semibold transition-colors relative flex items-center gap-1 ${
                activeTab === tab.key ? 'text-brand' : 'text-warm-muted'
              }`}
              onClick={() => {
                setActiveTab(tab.key)
                setSelectedOrder(null)
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-elder-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? 'bg-brand text-white' : 'bg-warm-border text-warm-muted'
                }`}>
                  {tab.count}
                </span>
              )}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-full" />
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <ClipboardList className="w-16 h-16 text-warm-muted mb-4" />
            <p className="text-elder-lg text-warm-muted mb-6">
              {activeTab === 'timeout' ? '没有异常订单' : activeTab === 'completed' ? '还没有完成的订单' : '还没有订单'}
            </p>
            {activeTab === 'active' && (
              <div className="flex gap-3">
                <button className="elder-btn-primary" onClick={() => navigate('/sell')}>
                  去卖号
                </button>
                <button className="elder-btn-secondary" onClick={() => navigate('/buy')}>
                  去买号
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <div
                key={order.id}
                className={`elder-card cursor-pointer active:shadow-card-hover transition-shadow ${
                  order.status === '异常超时' || order.steps.some(s => s.status === 'timeout')
                    ? 'border-l-4 border-l-danger'
                    : ''
                }`}
                onClick={() =>
                  setSelectedOrder(selectedOrder === order.id ? null : order.id)
                }
              >
                <div className="flex items-center justify-between">
                  <span className="text-elder-xs text-warm-muted">
                    {order.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-elder-xs font-semibold px-2 py-0.5 rounded-full ${
                        order.type === 'sell'
                          ? 'bg-brand-100 text-brand-600'
                          : 'bg-safe/10 text-safe'
                      }`}
                    >
                      {order.type === 'sell' ? '卖号' : '买号'}
                    </span>
                    {getOrderStatusBadge(order)}
                  </div>
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
                  {getActiveStepInfo(order) || order.steps[order.currentStep - 1]?.name || order.status}
                </p>

                {selectedOrder === order.id && renderExpanded(order)}
              </div>
            ))}
          </div>
        )}
      </div>

      {toastMsg && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-warm-text text-white text-elder-base px-6 py-3 rounded-elder shadow-lg z-50 text-center max-w-[300px]">
          {toastMsg}
        </div>
      )}
    </div>
  )
}

export default Orders
