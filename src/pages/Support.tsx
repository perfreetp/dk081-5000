import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, MessageCircle, AlertCircle, ChevronDown, Volume2, Upload, Send, X, Clock, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import { useTradeStore, type CsContactRecord } from '@/stores/useTradeStore'
import { faqItems, FAQItem } from '@/data/mockData'

const Support: React.FC = () => {
  const navigate = useNavigate()
  const supportContext = useTradeStore((s) => s.supportContext)
  const supportContextDetail = useTradeStore((s) => s.supportContextDetail)
  const setSupportContext = useTradeStore((s) => s.setSupportContext)
  const addCsContactRecord = useTradeStore((s) => s.addCsContactRecord)
  const updateCsContactRecordStatus = useTradeStore((s) => s.updateCsContactRecordStatus)
  const orders = useTradeStore((s) => s.orders)
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [form, setForm] = useState({ description: '', phone: '' })
  const [showContext, setShowContext] = useState(true)
  const [rerenderKey, setRerenderKey] = useState(0)

  const currentOrder = useMemo(() => {
    if (!supportContextDetail.orderId) return null
    return orders.find((o) => o.id === supportContextDetail.orderId) || null
  }, [supportContextDetail.orderId, orders, rerenderKey])

  const hasDetailData = Object.values(supportContextDetail).some((v) => v !== undefined && v !== '')

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case '待受理':
        return 'bg-warn/10 text-warn'
      case '处理中':
        return 'bg-brand/10 text-brand'
      case '已反馈':
        return 'bg-brand-dark/10 text-brand-dark'
      case '已解决':
        return 'bg-safe/10 text-safe'
      default:
        return 'bg-warm-border text-warm-muted'
    }
  }

  useEffect(() => {
    if (supportContext) {
      setShowContext(true)
    }
  }, [supportContext])

  const groupedFaqs = useMemo(() => {
    const extraFaqs: FAQItem[] = [
      {
        category: '换绑操作相关',
        question: '换绑是什么意思？',
        answer: '换绑就是把游戏账号绑定的手机号换成你的手机号。换绑完成后，卖家就不能再登录这个账号了，账号就真正属于你了。',
      },
      {
        category: '换绑操作相关',
        question: '换绑需要多久才能完成？',
        answer: '不同游戏换绑时间不一样，一般1-24小时内完成。换绑期间请不要登录账号，避免影响换绑进度。客服会全程跟踪，有问题随时联系。',
      },
      {
        category: '换绑操作相关',
        question: '换绑操作我不会弄怎么办？',
        answer: '不用担心！我们有专门的客服手把手教你操作。你可以点击页面上的"拨打技术支持"按钮，客服会一步一步告诉你怎么操作，直到换绑成功。',
      },
      {
        category: '换绑操作相关',
        question: '换绑失败了怎么办？',
        answer: '换绑失败的原因有很多，比如原手机号无法接收验证码、账号有安全限制等。请立即联系客服，我们会帮你查明原因并协调解决，确保你的交易安全。',
      },
      {
        category: '换绑操作相关',
        question: '换绑成功后还需要做什么？',
        answer: '换绑成功后，请及时登录账号确认账号信息完整，修改账号密码，并开启账号保护功能。如果发现任何问题，请立即联系客服处理。',
      },
    ]
    const allFaqs = [...faqItems, ...extraFaqs]
    const map = new Map<string, typeof faqItems>()
    allFaqs.forEach((item) => {
      const list = map.get(item.category) || []
      list.push(item)
      map.set(item.category, list)
    })
    return Array.from(map.entries())
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handlePlayVoice = (text: string) => {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    utterance.rate = 0.85
    utterance.pitch = 1
    window.speechSynthesis.speak(utterance)
  }

  const handleSubmit = () => {
    if (!form.description.trim() || !form.phone.trim()) {
      showToast('请填写完整信息')
      return
    }
    showToast('申诉已提交，客服会在24小时内联系您')
    setForm({ description: '', phone: '' })
  }

  const handlePhoneCall = () => {
    if (supportContextDetail.orderId) {
      const reason = supportContextDetail.reason || '电话咨询'
      const timeoutNode = supportContextDetail.timeoutNode || (supportContextDetail.reason?.includes('超时') ? supportContextDetail.reason : undefined)
      const now = new Date()
      const expectedFeedbackAt = new Date(
        now.getTime() + (timeoutNode ? 2 : 24) * 60 * 60 * 1000
      )
      addCsContactRecord(supportContextDetail.orderId, {
        reason,
        timeoutNode,
        status: '待受理',
        time: now.toLocaleString('zh-CN'),
        expectedFeedbackAt: expectedFeedbackAt.toLocaleString('zh-CN'),
      })
    }
    showToast('正在拨打客服电话 400-123-4567...')
    setTimeout(() => {
      window.open('tel:4001234567')
    }, 800)
  }

  const handleOnlineChat = () => {
    if (supportContextDetail.orderId) {
      const reason = supportContextDetail.reason || '在线咨询'
      const timeoutNode = supportContextDetail.timeoutNode || (supportContextDetail.reason?.includes('超时') ? supportContextDetail.reason : undefined)
      const now = new Date()
      const expectedFeedbackAt = new Date(
        now.getTime() + (timeoutNode ? 2 : 24) * 60 * 60 * 1000
      )
      addCsContactRecord(supportContextDetail.orderId, {
        reason,
        timeoutNode,
        status: '待受理',
        time: now.toLocaleString('zh-CN'),
        expectedFeedbackAt: expectedFeedbackAt.toLocaleString('zh-CN'),
      })
    }
    showToast('正在连接客服...')
  }

  const handleAdvanceStatus = (recordId: string, currentStatus: CsContactRecord['status']) => {
    if (!supportContextDetail.orderId) return
    const nextStatusMap: Record<string, CsContactRecord['status']> = {
      '待受理': '处理中',
      '处理中': '已反馈',
      '已反馈': '已解决',
    }
    const next = nextStatusMap[currentStatus]
    if (!next) return
    let notes = ''
    if (next === '处理中') notes = '客服已受理，正在联系相关方核实情况'
    else if (next === '已反馈') notes = '已与卖家沟通，预计今晚会完成换绑'
    else if (next === '已解决') notes = '问题已处理完毕，感谢您的耐心等待'
    updateCsContactRecordStatus(supportContextDetail.orderId, recordId, next, notes)
    setRerenderKey((k) => k + 1)
    showToast(`已更新状态为「${next}」`)
  }

  const dismissContext = () => {
    setShowContext(false)
    setSupportContext('')
  }

  const toggleFaq = (question: string) => {
    setExpandedFaq((prev) => (prev === question ? null : question))
  }

  return (
    <div className="min-h-screen bg-warm-bg pb-8">
      <div className="px-4 pt-4 space-y-6">
        <h1 className="elder-section-title">客服帮助</h1>

        {(supportContext || hasDetailData) && showContext && (
          <div className="bg-brand-50 border border-brand/30 rounded-elder p-4 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-brand flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2">
              <p className="text-elder-sm font-semibold text-brand">您来自：</p>
              {supportContext && (
                <p className="text-elder-base text-warm-text">{supportContext}</p>
              )}
              {hasDetailData && (
                <div className="space-y-1 pt-2 border-t border-brand/20">
                  {supportContextDetail.orderId && (
                    <p className="text-elder-base text-warm-text">订单号：{supportContextDetail.orderId}</p>
                  )}
                  {supportContextDetail.game && (
                    <p className="text-elder-base text-warm-text">游戏：{supportContextDetail.game}</p>
                  )}
                  {supportContextDetail.server && (
                    <p className="text-elder-base text-warm-text">区服：{supportContextDetail.server}</p>
                  )}
                  {supportContextDetail.currentStep && (
                    <p className="text-elder-base text-warm-text">当前步骤：{supportContextDetail.currentStep}</p>
                  )}
                  {supportContextDetail.timeoutNode && (
                    <p className="text-elder-base text-danger font-semibold">⚠️ 超时节点：{supportContextDetail.timeoutNode}</p>
                  )}
                  {supportContextDetail.reason && (
                    <p className="text-elder-base text-warm-text">问题：{supportContextDetail.reason}</p>
                  )}
                  {supportContextDetail.expectedFeedbackAt && (
                    <p className="text-elder-base text-warn font-semibold">⏰ 预计反馈：{supportContextDetail.expectedFeedbackAt}</p>
                  )}
                  {supportContextDetail.contactPhone && (
                    <p className="text-elder-base text-warm-text">联系电话：{supportContextDetail.contactPhone}</p>
                  )}
                </div>
              )}
              <p className="text-elder-sm text-warm-muted mt-2">客服会根据您的具体情况帮您处理</p>
            </div>
            <button onClick={dismissContext} className="p-1 text-warm-muted flex-shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {currentOrder && currentOrder.csContactRecords && currentOrder.csContactRecords.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="elder-section-title mb-0">咨询记录</h2>
              <div className="flex items-center gap-2">
                {supportContextDetail.orderId && (
                  <button
                    onClick={() => navigate('/orders')}
                    className="flex items-center gap-1 text-elder-sm text-brand font-semibold bg-brand-50 px-3 py-1.5 rounded-full border border-brand/20"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    返回订单
                  </button>
                )}
                <button
                  onClick={() => setRerenderKey((k) => k + 1)}
                  className="flex items-center gap-1 text-elder-sm text-warm-muted p-1.5 rounded-full active:bg-warm-bg"
                  title="刷新"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {[...currentOrder.csContactRecords].reverse().map((record) => (
                <div key={record.id} className="elder-card space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-brand flex-shrink-0" />
                      <span className="text-elder-sm text-warm-muted">{record.time}</span>
                    </div>
                    <span
                      className={`text-elder-sm font-semibold px-3 py-1 rounded-full ${getStatusBadgeColor(record.status)}`}
                    >
                      {record.status}
                    </span>
                  </div>
                  <p className="text-elder-base font-semibold text-warm-text">{record.reason}</p>
                  {record.timeoutNode && (
                    <p className="text-elder-sm text-danger font-semibold">⚠️ 超时节点：{record.timeoutNode}</p>
                  )}
                  {record.expectedFeedbackAt && (
                    <p className="text-elder-sm text-warn font-semibold">⏰ 预计反馈：{record.expectedFeedbackAt}</p>
                  )}
                  {(record.acceptedAt || record.feedbackAt || record.resolvedAt) && (
                    <div className="flex flex-wrap gap-2 text-elder-xs pt-2 border-t border-warm-border/60">
                      {record.acceptedAt && (
                        <span className="bg-brand/10 text-brand px-2 py-1 rounded-full">
                          已受理 · {record.acceptedAt}
                        </span>
                      )}
                      {record.feedbackAt && (
                        <span className="bg-brand-dark/10 text-brand-dark px-2 py-1 rounded-full">
                          已反馈 · {record.feedbackAt}
                        </span>
                      )}
                      {record.resolvedAt && (
                        <span className="bg-safe/10 text-safe px-2 py-1 rounded-full">
                          已解决 · {record.resolvedAt}
                        </span>
                      )}
                    </div>
                  )}
                  {record.notes && (
                    <p className="text-elder-sm text-warm-text bg-brand-50 rounded-lg p-3">
                      💬 {record.notes}
                    </p>
                  )}
                  {record.status !== '已解决' && (
                    <button
                      onClick={() => handleAdvanceStatus(record.id, record.status)}
                      className="elder-btn-secondary w-full gap-2 text-elder-sm"
                    >
                      <CheckCircle className="w-5 h-5" />
                      模拟推进至下一状态（
                      {record.status === '待受理' && '处理中'}
                      {record.status === '处理中' && '已反馈'}
                      {record.status === '已反馈' && '已解决'}
                      ）
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-3">
          <p className="text-elder-base text-warm-muted">有问题？直接找人帮忙！</p>
          <button
            onClick={handlePhoneCall}
            className="w-full bg-brand text-white rounded-elder shadow-btn min-h-[80px] flex flex-col items-center justify-center gap-1 animate-pulse-slow"
          >
            <div className="flex items-center gap-3">
              <Phone className="w-8 h-8" />
              <span className="text-elder-lg font-bold">打电话给客服</span>
            </div>
            <span className="text-elder-sm text-white/80">工作日 9:00-21:00</span>
          </button>
          <button
            onClick={handleOnlineChat}
            className="w-full bg-safe text-white rounded-elder shadow-btn min-h-[80px] flex flex-col items-center justify-center gap-1"
          >
            <div className="flex items-center gap-3">
              <MessageCircle className="w-8 h-8" />
              <span className="text-elder-lg font-bold">在线聊天</span>
            </div>
            <span className="text-elder-sm text-white/80">随时在线，即时回复</span>
          </button>
        </section>

        <section className="elder-card bg-warm-bg flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-7 h-7 text-brand flex-shrink-0" />
            <span className="text-elder-lg font-semibold text-warm-text">换绑操作遇到困难？</span>
          </div>
          <p className="text-elder-base text-warm-muted">
            我们提供电话手把手指导，帮您完成换绑操作
          </p>
          <button
            onClick={handlePhoneCall}
            className="elder-btn-secondary flex items-center justify-center gap-2"
          >
            <Phone className="w-5 h-5" />
            拨打技术支持
          </button>
        </section>

        <section className="space-y-4">
          <h2 className="elder-section-title">常见问题</h2>
          {groupedFaqs.map(([category, items]) => (
            <div key={category} className="space-y-2">
              <p className="text-elder-lg font-semibold text-warm-text">{category}</p>
              <div className="space-y-2">
                {items.map((item) => {
                  const isOpen = expandedFaq === item.question
                  return (
                    <div key={item.question} className="elder-card overflow-hidden">
                      <button
                        onClick={() => toggleFaq(item.question)}
                        className="w-full flex items-center justify-between gap-3 text-left"
                      >
                        <span className="text-elder-base font-medium text-warm-text">{item.question}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-warm-muted flex-shrink-0 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="mt-2 flex items-start gap-2">
                          <p className="text-elder-base text-warm-muted flex-1">{item.answer}</p>
                          <button
                            onClick={() => handlePlayVoice(item.answer)}
                            className="flex-shrink-0 w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center"
                          >
                            <Volume2 className="w-5 h-5 text-brand" />
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="elder-section-title">交易纠纷申诉</h2>
          <div className="elder-card space-y-4">
            <div>
              <label className="elder-label">问题描述</label>
              <textarea
                className="elder-input resize-none"
                rows={3}
                placeholder="请简单说一说遇到了什么问题"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div>
              <label className="elder-label">上传截图</label>
              <button
                className="elder-btn-secondary flex items-center justify-center gap-2 w-full"
                onClick={() => showToast('截图功能已打开，请选择图片')}
              >
                <Upload className="w-5 h-5" />
                点击上传截图
              </button>
            </div>
            <div>
              <label className="elder-label">联系电话</label>
              <input
                className="elder-input"
                type="tel"
                placeholder="方便我们联系您"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <button onClick={handleSubmit} className="elder-btn-primary w-full flex items-center justify-center gap-2">
              <Send className="w-5 h-5" />
              提交申诉
            </button>
          </div>
        </section>
      </div>

      {toast && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-warm-text text-white px-6 py-3 rounded-elder shadow-lg text-elder-base font-semibold z-50 text-center max-w-[300px]">
          {toast}
        </div>
      )}
    </div>
  )
}

export default Support
