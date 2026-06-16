import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, FileText, Download, Forward, Package,
  Clock, CheckCircle2, Hourglass, Shield, Eye, Lock
} from 'lucide-react'
import { useTradeStore, type Order } from '@/stores/useTradeStore'

const ReceiptPackage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const isFamilyView = searchParams.get('family') === '1'

  const orders = useTradeStore((s) => s.orders)
  const addReceiptOperationLog = useTradeStore((s) => s.addReceiptOperationLog)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const order = orders.find((o) => o.id === orderId) as Order | undefined

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 2500)
  }

  const getReceiptDocs = (order: Order) => {
    const docs: { type: string; time: string; desc: string; ready: boolean; sensitive?: boolean }[] = [
      {
        type: '交易合同',
        time: order.createdAt,
        desc: '平台担保交易协议，下单即生成',
        ready: true,
      },
    ]

    const payStep = order.steps.find((s) =>
      s.name.includes('付款') && s.status === 'completed'
    )
    if (payStep) {
      docs.push({
        type: order.type === 'sell' ? '收款确认' : '付款凭证',
        time: payStep.time || '',
        desc:
          order.type === 'sell'
            ? '平台确认已收到买家款项'
            : '您已付款至平台担保账户',
        ready: true,
        sensitive: true,
      })
    } else {
      docs.push({
        type: order.type === 'sell' ? '收款确认' : '付款凭证',
        time: '',
        desc: '等待买家付款，完成后平台自动生成',
        ready: false,
        sensitive: true,
      })
    }

    const bindStep = order.steps.find((s) =>
      s.name.includes('换绑') && s.status === 'completed'
    )
    if (bindStep) {
      docs.push({
        type: '换绑确认书',
        time: bindStep.time || '',
        desc: '账号已成功换绑至买家手机，双方确认',
        ready: true,
      })
    } else {
      docs.push({
        type: '换绑确认书',
        time: '',
        desc: '等待换绑操作完成，完成后自动生成',
        ready: false,
      })
    }

    if (order.status === '已完成') {
      docs.push({
        type: '交易完成确认',
        time: order.completedAt || order.steps.slice(-1)[0]?.time || '',
        desc: '交易全部流程完成，凭证可留存备查',
        ready: true,
      })
    } else {
      docs.push({
        type: '交易完成确认',
        time: '',
        desc: '所有步骤完成后，平台自动生成',
        ready: false,
      })
    }

    return docs
  }

  const handleDownload = (docType: string) => {
    if (!order || isFamilyView) return
    const now = new Date()
    const pad = (n: number) => n.toString().padStart(2, '0')
    addReceiptOperationLog(order.id, {
      type: 'download',
      docType,
      time: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`,
    })
    showToast(`${docType}已保存到手机，可在文件管理中查看`)
  }

  const handleForward = (docType: string) => {
    if (!order || isFamilyView) return
    const now = new Date()
    const pad = (n: number) => n.toString().padStart(2, '0')
    addReceiptOperationLog(order.id, {
      type: 'forward',
      docType,
      time: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`,
      target: '家人',
    })
    showToast(`${docType}分享链接已复制`)
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-warm-bg flex flex-col items-center justify-center p-6">
        <Package className="w-16 h-16 text-warm-muted mb-4" />
        <p className="text-elder-lg text-warm-muted mb-4">未找到对应订单</p>
        <button className="elder-btn-primary" onClick={() => navigate(-1)}>
          返回
        </button>
      </div>
    )
  }

  const receiptDocs = getReceiptDocs(order)
  const sortedLogs = [...order.receiptOperationLogs].reverse()
  const sortedShareRecords = [...order.shareRecords].reverse()

  return (
    <div className="min-h-screen bg-warm-bg pb-8">
      <div className="bg-gradient-to-r from-brand to-brand-dark p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-white active:bg-white/20 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-white" />
              <h1 className="text-elder-lg font-bold text-white">交易材料包</h1>
            </div>
            <p className="text-elder-sm text-white/80 mt-0.5">
              {order.game} · {order.id}
            </p>
          </div>
          {isFamilyView && (
            <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
              <Eye className="w-4 h-4 text-white" />
              <span className="text-elder-xs text-white font-bold">只读</span>
              <Lock className="w-3.5 h-3.5 text-white/80" />
            </div>
          )}
        </div>
      </div>

      <div className="p-4 -mt-2 space-y-4">
        <div className="bg-white rounded-elder p-4 shadow-sm border border-warm-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand" />
              <p className="text-elder-base font-bold text-warm-text">订单信息</p>
            </div>
            <span
              className={`text-elder-xs font-semibold px-2.5 py-1 rounded-full ${
                order.status === '已完成'
                  ? 'bg-safe/10 text-safe'
                  : order.status === '异常超时'
                  ? 'bg-danger/10 text-danger'
                  : 'bg-brand/10 text-brand'
              }`}
            >
              {order.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-elder-sm">
            <div>
              <p className="text-warm-muted">类型</p>
              <p className="text-warm-text font-semibold">
                {order.type === 'sell' ? '卖号' : '买号'}
              </p>
            </div>
            <div>
              <p className="text-warm-muted">金额</p>
              <p className="text-brand font-bold text-elder-lg">¥{order.amount}</p>
            </div>
            <div className="col-span-2">
              <p className="text-warm-muted">游戏 / 区服</p>
              <p className="text-warm-text font-semibold">
                {order.game}
                {order.server ? ` · ${order.server}` : ''}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-warm-muted">创建时间</p>
              <p className="text-warm-text font-semibold">{order.createdAt}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand" />
              <p className="text-elder-base font-bold text-warm-text">凭证材料</p>
            </div>
            <p className="text-elder-xs text-warm-muted">
              共 {receiptDocs.filter((d) => d.ready).length}/{receiptDocs.length} 份已生成
            </p>
          </div>
          <div className="space-y-3">
            {receiptDocs.map((doc) => (
              <div
                key={doc.type}
                className={`rounded-elder-sm p-4 border ${
                  doc.ready
                    ? 'bg-brand-50 border-brand/20'
                    : 'bg-warm-bg border-warm-border'
                }`}
              >
                <div className="flex items-start gap-3">
                  <FileText
                    className={`w-6 h-6 flex-shrink-0 mt-0.5 ${
                      doc.ready ? 'text-brand' : 'text-warm-muted'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className={`text-elder-base font-semibold ${
                          doc.ready ? 'text-warm-text' : 'text-warm-muted'
                        }`}
                      >
                        {doc.type}
                      </p>
                      {doc.sensitive && (
                        <span className="text-elder-xs px-2 py-0.5 rounded-full bg-warn/10 text-warn">
                          含敏感信息
                        </span>
                      )}
                      {!doc.ready && (
                        <span className="text-elder-xs px-2 py-0.5 rounded-full bg-warn/10 text-warn">
                          等待平台补齐
                        </span>
                      )}
                      {doc.ready && (
                        <CheckCircle2 className="w-4 h-4 text-safe flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-elder-sm text-warm-muted mt-1">{doc.desc}</p>
                    {doc.time && (
                      <p className="text-elder-xs text-warm-muted mt-1">
                        生成时间：{doc.time}
                      </p>
                    )}
                  </div>
                  {doc.ready && !isFamilyView && (
                    <div className="flex flex-col gap-2">
                      {!doc.sensitive ? (
                        <button
                          className="p-2 text-warm-muted active:text-safe rounded-lg active:bg-safe/10 transition-colors"
                          onClick={() => handleDownload(doc.type)}
                          title="下载"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      ) : (
                        <div className="text-elder-xs text-warn text-center px-2 py-1 bg-warn/5 rounded">
                          仅下单人<br />可下载
                        </div>
                      )}
                      <button
                        className="p-2 text-warm-muted active:text-brand rounded-lg active:bg-brand/10 transition-colors"
                        onClick={() => handleForward(doc.type)}
                        title="转发"
                      >
                        <Forward className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                  {doc.ready && isFamilyView && doc.sensitive && (
                    <div className="flex items-center gap-1 text-elder-xs text-warm-muted bg-warm-bg rounded-lg px-2 py-1">
                      <Lock className="w-3.5 h-3.5" />
                      不可下载
                    </div>
                  )}
                  {doc.ready && isFamilyView && !doc.sensitive && (
                    <div className="flex items-center gap-1 text-elder-xs text-warm-muted bg-warm-bg rounded-lg px-2 py-1">
                      <Eye className="w-3.5 h-3.5" />
                      仅查看
                    </div>
                  )}
                  {!doc.ready && (
                    <div className="flex items-center gap-1 text-elder-xs text-warm-muted">
                      <Hourglass className="w-4 h-4" />
                      <span>待生成</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {sortedShareRecords.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Forward className="w-5 h-5 text-brand" />
              <p className="text-elder-base font-bold text-warm-text">打包转发历史</p>
            </div>
            <div className="space-y-2">
              {sortedShareRecords.map((record) => (
                <div
                  key={record.id}
                  className="bg-warm-bg rounded-elder-sm p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Forward className="w-4 h-4 text-brand flex-shrink-0" />
                    <div>
                      <p className="text-elder-sm font-semibold text-warm-text">
                        已分享给 {record.target}
                      </p>
                      <p className="text-elder-xs text-warm-muted">
                        通过 {record.channel}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-elder-xs text-warm-muted">{record.time}</p>
                    <p className="text-elder-xs text-brand font-mono">
                      {record.shareCode}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {sortedLogs.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-brand" />
              <p className="text-elder-base font-bold text-warm-text">操作记录</p>
            </div>
            <div className="space-y-2">
              {sortedLogs.slice(0, 10).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-3 text-elder-sm"
                >
                  {log.type === 'download' ? (
                    <Download className="w-4 h-4 text-safe flex-shrink-0" />
                  ) : (
                    <Forward className="w-4 h-4 text-brand flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-warm-text">
                      {log.type === 'download' ? '已下载' : '已转发'} {log.docType}
                    </span>
                    {log.target && (
                      <span className="text-warm-muted ml-2">→ {log.target}</span>
                    )}
                  </div>
                  <span className="text-warm-muted text-elder-xs flex-shrink-0">
                    {log.time}
                  </span>
                </div>
              ))}
            </div>
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

export default ReceiptPackage
