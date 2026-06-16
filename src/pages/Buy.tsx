import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, AlertTriangle, Phone, ShoppingCart, Check, X } from 'lucide-react'
import { useTradeStore } from '@/stores/useTradeStore'
import { useUIStore } from '@/stores/useUIStore'
import { mockAccounts, gameList, type MockAccount } from '@/data/mockData'
import SafetyBadge from '@/components/SafetyBadge'
import RiskAlert from '@/components/RiskAlert'

const getScoreLevel = (score: number): 'safe' | 'warn' | 'danger' => {
  if (score > 80) return 'safe'
  if (score >= 60) return 'warn'
  return 'danger'
}

const getScoreLabel = (score: number): string => {
  if (score > 80) return '验号结果很好，账号安全'
  if (score >= 60) return '有些小问题，建议咨询客服'
  return '风险较高，请谨慎购买'
}

const getScoreColor = (score: number): string => {
  if (score > 80) return '#22C55E'
  if (score >= 60) return '#EAB308'
  return '#EF4444'
}

const safetyLabels: Record<string, string> = {
  safe: '安全',
  warn: '注意',
  danger: '风险',
}

const Buy: React.FC = () => {
  const navigate = useNavigate()
  const { addOrder } = useTradeStore()
  const { showRiskAlert, riskAlert, closeRiskAlert } = useUIStore()
  const [selectedGame, setSelectedGame] = useState('')
  const [selectedAccount, setSelectedAccount] = useState<MockAccount | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const filteredAccounts = selectedGame
    ? mockAccounts.filter((a) => a.game === selectedGame)
    : mockAccounts

  const handleConfirmPurchase = () => {
    useUIStore.getState().openRiskAlert(
      '购买后平台将担保您的付款，确认收到账号并验证无误后，才会将款项放给卖家。请确认您已仔细查看验号结果。'
    )
  }

  const handleRiskClose = () => {
    closeRiskAlert()
    if (selectedAccount) {
      const now = new Date().toLocaleString('zh-CN')
      addOrder({
        id: `ORD${Date.now()}`,
        type: 'buy',
        game: selectedAccount.game,
        status: '进行中',
        currentStep: 1,
        totalSteps: 5,
        amount: selectedAccount.price,
        createdAt: now,
        steps: [
          { name: '选购账号', status: 'completed', time: now, hint: '您已选定账号' },
          { name: '确认购买', status: 'completed', time: now, hint: '购买已确认' },
          { name: '付款至担保账户', status: 'active', hint: '您的钱将打到平台保管，安全！不会到卖家手里' },
          { name: '卖家换绑账号', status: 'pending', hint: '等卖家把账号换绑到您的手机上，客服会跟进' },
          { name: '买家验收确认', status: 'pending', hint: '等卖家换绑完成后，您确认没问题才算完成' },
        ],
      })
    }
    setShowSuccess(true)
  }

  const renderListView = () => (
    <div>
      <h1 className="elder-section-title mb-4">帮孩子买个放心号</h1>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1">
        <button
          onClick={() => setSelectedGame('')}
          className={`flex-shrink-0 px-5 py-2 rounded-full text-elder-base font-semibold border transition-colors ${
            selectedGame === '' ? 'bg-brand text-white border-brand' : 'bg-white text-warm-text border-warm-border'
          }`}
        >
          全部
        </button>
        {gameList.map((game) => (
          <button
            key={game}
            onClick={() => setSelectedGame(game)}
            className={`flex-shrink-0 px-5 py-2 rounded-full text-elder-base font-semibold border transition-colors ${
              selectedGame === game ? 'bg-brand text-white border-brand' : 'bg-white text-warm-text border-warm-border'
            }`}
          >
            {game}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filteredAccounts.map((account) => {
          const level = getScoreLevel(account.verifyScore)
          return (
            <div key={account.id} className="elder-card min-h-[180px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-brand/10 text-brand text-elder-sm font-semibold px-3 py-1 rounded-full">
                    {account.game}
                  </span>
                  <SafetyBadge level={level} score={account.verifyScore} label={safetyLabels[level]} />
                </div>
                <p className="text-elder-base text-warm-text font-semibold">
                  {account.server} · {account.level}
                </p>
                <p className="text-elder-sm text-warm-muted mt-1">{account.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {account.imageTags.map((tag) => (
                    <span key={tag} className="bg-warm-bg text-warm-muted text-elder-xs px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-brand text-elder-xl font-bold">¥{account.price}</span>
                <button
                  onClick={() => setSelectedAccount(account)}
                  className="elder-btn-primary px-6 py-2 text-elder-base"
                >
                  查看详情
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderDetailView = () => {
    if (!selectedAccount) return null
    const score = selectedAccount.verifyScore
    const level = getScoreLevel(score)
    const scoreColor = getScoreColor(score)
    const gaugeRadius = 50
    const gaugeCircumference = 2 * Math.PI * gaugeRadius
    const gaugeOffset = gaugeCircumference * (1 - score / 100)

    return (
      <div>
        <button onClick={() => setSelectedAccount(null)} className="text-brand text-elder-lg font-semibold mb-4">
          ← 返回列表
        </button>

        <div className="elder-card">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-brand/10 text-brand text-elder-sm font-semibold px-3 py-1 rounded-full">
              {selectedAccount.game}
            </span>
            <SafetyBadge level={level} score={score} label={safetyLabels[level]} />
          </div>
          <p className="text-elder-base text-warm-text font-semibold">
            {selectedAccount.server} · {selectedAccount.level}
          </p>
          <p className="text-elder-sm text-warm-muted mt-1">{selectedAccount.description}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedAccount.imageTags.map((tag) => (
              <span key={tag} className="bg-warm-bg text-warm-muted text-elder-xs px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <p className="text-brand text-elder-xl font-bold mt-3">¥{selectedAccount.price}</p>
        </div>

        <div className="elder-card mt-4 flex flex-col items-center">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r={gaugeRadius} fill="none" stroke="#E7E5E4" strokeWidth="10" />
            <circle
              cx="60"
              cy="60"
              r={gaugeRadius}
              fill="none"
              stroke={scoreColor}
              strokeWidth="10"
              strokeDasharray={gaugeCircumference}
              strokeDashoffset={gaugeOffset}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
            <text x="60" y="55" textAnchor="middle" fontSize="28" fontWeight="bold" fill={scoreColor}>
              {score}
            </text>
            <text x="60" y="78" textAnchor="middle" fontSize="12" fill="#78716C">
              验号分数
            </text>
          </svg>
          <p className="text-elder-base font-semibold mt-3 text-center" style={{ color: scoreColor }}>
            {getScoreLabel(score)}
          </p>
        </div>

        <div className="elder-card mt-4">
          <h3 className="text-elder-lg font-bold text-warm-text mb-3">验号详情</h3>
          <div className="flex flex-col gap-2">
            {selectedAccount.verifyItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                {item.passed ? (
                  <Check className="w-6 h-6 text-safe flex-shrink-0" />
                ) : (
                  <X className="w-6 h-6 text-danger flex-shrink-0" />
                )}
                <span className="text-elder-base text-warm-text">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="elder-card mt-4 bg-warn/10 border-warn/30">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-6 h-6 text-warn flex-shrink-0" />
            <span className="text-elder-lg font-bold text-warn">购买前请注意</span>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-elder-base text-warm-text">· 付款请走平台，不要私下转账</p>
            <p className="text-elder-base text-warm-text">· 不要把验证码告诉任何人</p>
            <p className="text-elder-base text-warm-text">· 如有疑问随时联系客服</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            className="elder-btn-secondary flex-1 flex items-center justify-center gap-2"
            onClick={() => navigate('/support')}
          >
            <Phone className="w-5 h-5" />
            联系客服咨询
          </button>
          <button
            className="elder-btn-primary flex-1 flex items-center justify-center gap-2"
            onClick={handleConfirmPurchase}
          >
            <ShoppingCart className="w-5 h-5" />
            确认购买
          </button>
        </div>
      </div>
    )
  }

  const renderSuccess = () => (
    <div className="flex flex-col items-center text-center py-8">
      <CheckCircle className="w-20 h-20 text-safe mb-4" />
      <h2 className="elder-section-title mb-2">购买请求已提交！</h2>
      <p className="text-elder-base text-warm-muted mb-2">平台会担保您的付款，确认收到账号后才放款给卖家</p>
      <div className="flex gap-3 w-full mt-6">
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
      {showSuccess ? renderSuccess() : selectedAccount ? renderDetailView() : renderListView()}
      <RiskAlert
        open={showRiskAlert}
        onClose={handleRiskClose}
        title="确认购买此账号？"
        message={riskAlert?.message || ''}
      />
    </div>
  )
}

export default Buy
