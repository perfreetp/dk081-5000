import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Shield, Phone } from 'lucide-react'
import { useTradeStore } from '@/stores/useTradeStore'
import { useUIStore } from '@/stores/useUIStore'
import { gameList } from '@/data/mockData'
import StepProgress from '@/components/StepProgress'
import RiskAlert from '@/components/RiskAlert'

const stepLabels = ['选游戏', '填信息', '估价格', '发布成功']

const priceMap: Record<string, [number, number]> = {
  '王者荣耀': [200, 500],
}
const defaultPrice: [number, number] = [100, 300]

const fieldExamples: Record<string, string> = {
  server: '比如：微信区-星耀1服',
  level: '比如：最强王者 / 60级',
  description: '有限定皮肤8个、满级铭文、贵族7，详细描述能卖更高价',
  contactPhone: '138****8888',
}

const Sell: React.FC = () => {
  const navigate = useNavigate()
  const { sellStep, sellForm, updateSellStep, setSellForm, addOrder } = useTradeStore()
  const { showRiskAlert, riskAlert, closeRiskAlert } = useUIStore()
  const [riskTitle, setRiskTitle] = useState('')
  const [examples, setExamples] = useState<Record<string, boolean>>({})

  const toggleExample = (field: string) => {
    setExamples((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const priceRange = priceMap[sellForm.game] || defaultPrice
  const gaugeRadius = 70
  const gaugeCircumference = 2 * Math.PI * gaugeRadius
  const gaugeOffset = gaugeCircumference * 0.4

  const handleConfirmPublish = () => {
    setRiskTitle('确认发布卖号信息？')
    useUIStore.getState().openRiskAlert(
      '发布后买家可以看到您的账号信息，请确认填写正确。平台全程担保您的交易安全。'
    )
  }

  const handleRiskClose = () => {
    closeRiskAlert()
    addOrder({
      id: `ORD${Date.now()}`,
      type: 'sell',
      game: sellForm.game,
      status: '已发布',
      currentStep: 1,
      totalSteps: 5,
      amount: priceRange[0],
      createdAt: new Date().toLocaleString('zh-CN'),
      steps: [
        { name: '提交账号信息', status: 'completed', time: new Date().toLocaleString('zh-CN') },
        { name: '平台验号', status: 'active' },
        { name: '买家付款至担保', status: 'pending' },
        { name: '卖家换绑账号', status: 'pending' },
        { name: '平台放款', status: 'pending' },
      ],
    })
    updateSellStep(3)
  }

  const renderStep0 = () => (
    <div>
      <h2 className="elder-section-title mb-4">选择您要卖的游戏</h2>
      <div className="grid grid-cols-2 gap-3">
        {gameList.map((game) => (
          <button
            key={game}
            onClick={() => setSellForm({ game })}
            className={`elder-btn-secondary min-h-btn-h text-elder-lg ${
              sellForm.game === game ? '!bg-brand !text-white !border-brand' : ''
            }`}
          >
            {game}
          </button>
        ))}
      </div>
      <button
        className="elder-btn-primary w-full mt-6"
        disabled={!sellForm.game}
        onClick={() => updateSellStep(1)}
      >
        下一步
      </button>
    </div>
  )

  const renderStep1 = () => (
    <div>
      <h2 className="elder-section-title mb-4">填写账号信息</h2>

      <div className="mb-4">
        <div className="flex items-center justify-between">
          <label className="elder-label">区服名称</label>
          <button className="text-brand text-elder-sm font-semibold" onClick={() => toggleExample('server')}>
            看示例
          </button>
        </div>
        <input
          className="elder-input"
          placeholder="比如：微信区-星耀1"
          value={sellForm.server}
          onChange={(e) => setSellForm({ server: e.target.value })}
        />
        {examples.server && (
          <p className="text-elder-sm text-warm-muted mt-1 bg-warm-bg p-2 rounded-elder-sm">
            {fieldExamples.server}
          </p>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between">
          <label className="elder-label">角色等级</label>
          <button className="text-brand text-elder-sm font-semibold" onClick={() => toggleExample('level')}>
            看示例
          </button>
        </div>
        <input
          className="elder-input"
          placeholder="比如：满级/60级"
          value={sellForm.level}
          onChange={(e) => setSellForm({ level: e.target.value })}
        />
        {examples.level && (
          <p className="text-elder-sm text-warm-muted mt-1 bg-warm-bg p-2 rounded-elder-sm">
            {fieldExamples.level}
          </p>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between">
          <label className="elder-label">账号描述</label>
          <button
            className="text-brand text-elder-sm font-semibold"
            onClick={() => toggleExample('description')}
          >
            看示例
          </button>
        </div>
        <textarea
          className="elder-input resize-none"
          rows={3}
          placeholder="有什么皮肤、装备？孩子最清楚，可以问问他"
          value={sellForm.description}
          onChange={(e) => setSellForm({ description: e.target.value })}
        />
        {examples.description && (
          <p className="text-elder-sm text-warm-muted mt-1 bg-warm-bg p-2 rounded-elder-sm">
            {fieldExamples.description}
          </p>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between">
          <label className="elder-label">联系电话</label>
          <button
            className="text-brand text-elder-sm font-semibold"
            onClick={() => toggleExample('contactPhone')}
          >
            看示例
          </button>
        </div>
        <input
          className="elder-input"
          type="tel"
          placeholder="方便客服联系您"
          value={sellForm.contactPhone}
          onChange={(e) => setSellForm({ contactPhone: e.target.value })}
        />
        {examples.contactPhone && (
          <p className="text-elder-sm text-warm-muted mt-1 bg-warm-bg p-2 rounded-elder-sm">
            {fieldExamples.contactPhone}
          </p>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <button className="elder-btn-secondary flex-1" onClick={() => updateSellStep(0)}>
          上一步
        </button>
        <button className="elder-btn-primary flex-1" onClick={() => updateSellStep(2)}>
          下一步
        </button>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div>
      <h2 className="elder-section-title mb-4">价格估算</h2>
      <div className="elder-card flex flex-col items-center py-8">
        <svg width="180" height="180" viewBox="0 0 180 180">
          <circle cx="90" cy="90" r={gaugeRadius} fill="none" stroke="#E7E5E4" strokeWidth="12" />
          <circle
            cx="90"
            cy="90"
            r={gaugeRadius}
            fill="none"
            stroke="#F97316"
            strokeWidth="12"
            strokeDasharray={gaugeCircumference}
            strokeDashoffset={gaugeOffset}
            strokeLinecap="round"
            transform="rotate(-90 90 90)"
          />
          <text x="90" y="82" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#1C1917">
            ¥{priceRange[0]} - ¥{priceRange[1]}
          </text>
          <text x="90" y="108" textAnchor="middle" fontSize="16" fill="#78716C">
            估算价格
          </text>
        </svg>
        <p className="text-elder-sm text-warm-muted mt-4">仅供参考，最终以实际成交价为准</p>
      </div>

      <div className="elder-card mt-4 flex items-center gap-3">
        <Shield className="w-8 h-8 text-safe flex-shrink-0" />
        <p className="text-elder-base text-warm-text font-semibold">平台担保收款，安全有保障</p>
      </div>

      <div className="flex gap-3 mt-6">
        <button className="elder-btn-secondary flex-1" onClick={() => updateSellStep(1)}>
          上一步
        </button>
        <button className="elder-btn-primary flex-1" onClick={handleConfirmPublish}>
          确认发布
        </button>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="flex flex-col items-center text-center py-8">
      <CheckCircle className="w-20 h-20 text-safe mb-4" />
      <h2 className="elder-section-title mb-2">发布成功！</h2>
      <p className="text-elder-base text-warm-muted mb-2">您的卖号信息已发布，有买家时我们会电话通知您</p>
      <p className="text-elder-sm text-safe font-semibold mb-8">不用担心，平台全程担保，钱先到平台再给您</p>
      <div className="flex gap-3 w-full">
        <button className="elder-btn-secondary flex-1" onClick={() => navigate('/orders')}>
          查看订单
        </button>
        <button className="elder-btn-primary flex-1" onClick={() => navigate('/')}>
          返回首页
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-warm-bg p-4 pb-24">
      <StepProgress steps={stepLabels} currentStep={sellStep} />

      <div className="mt-6">
        {sellStep === 0 && renderStep0()}
        {sellStep === 1 && renderStep1()}
        {sellStep === 2 && renderStep2()}
        {sellStep === 3 && renderStep3()}
      </div>

      <div className="fixed bottom-6 right-4 z-40">
        <button className="flex items-center gap-2 bg-safe text-white px-4 py-3 rounded-full shadow-lg animate-pulse-slow text-elder-sm font-semibold">
          <Phone className="w-5 h-5" />
          需要帮助？打电话
        </button>
      </div>

      <RiskAlert
        open={showRiskAlert}
        onClose={handleRiskClose}
        title={riskTitle}
        message={riskAlert?.message || ''}
      />
    </div>
  )
}

export default Sell
