import React, { useState, useMemo, useEffect } from 'react'
import { Phone, MessageCircle, AlertCircle, ChevronDown, Volume2, Upload, Send, X } from 'lucide-react'
import { useTradeStore } from '@/stores/useTradeStore'
import { faqItems } from '@/data/mockData'

const Support: React.FC = () => {
  const supportContext = useTradeStore((s) => s.supportContext)
  const setSupportContext = useTradeStore((s) => s.setSupportContext)
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [form, setForm] = useState({ description: '', phone: '' })
  const [showContext, setShowContext] = useState(true)

  useEffect(() => {
    if (supportContext) {
      setShowContext(true)
    }
  }, [supportContext])

  const groupedFaqs = useMemo(() => {
    const map = new Map<string, typeof faqItems>()
    faqItems.forEach((item) => {
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
    showToast('正在拨打客服电话 400-123-4567...')
    setTimeout(() => {
      window.open('tel:4001234567')
    }, 800)
  }

  const handleOnlineChat = () => {
    showToast('正在连接客服...')
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

        {supportContext && showContext && (
          <div className="bg-brand-50 border border-brand/30 rounded-elder p-4 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-brand flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-elder-sm font-semibold text-brand">您来自：</p>
              <p className="text-elder-base text-warm-text mt-1">{supportContext}</p>
              <p className="text-elder-sm text-warm-muted mt-1">客服会根据您的具体情况帮您处理</p>
            </div>
            <button onClick={dismissContext} className="p-1 text-warm-muted flex-shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>
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
