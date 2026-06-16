import { create } from 'zustand'

interface TermTooltipState {
  term: string
  translation: string
}

interface RiskAlertState {
  message: string
}

interface VoicePlayerState {
  text: string
}

type ActiveTab = 'home' | 'sell' | 'buy' | 'orders' | 'support'

interface UIState {
  showTermTooltip: boolean
  termTooltip: TermTooltipState
  showRiskAlert: boolean
  riskAlert: RiskAlertState
  showVoicePlayer: boolean
  voicePlayer: VoicePlayerState
  activeTab: ActiveTab

  setActiveTab: (tab: ActiveTab) => void
  openTermTooltip: (term: string, translation: string) => void
  closeTermTooltip: () => void
  openRiskAlert: (message: string) => void
  closeRiskAlert: () => void
  openVoicePlayer: (text: string) => void
  closeVoicePlayer: () => void
}

export const useUIStore = create<UIState>((set) => ({
  showTermTooltip: false,
  termTooltip: { term: '', translation: '' },
  showRiskAlert: false,
  riskAlert: { message: '' },
  showVoicePlayer: false,
  voicePlayer: { text: '' },
  activeTab: 'home',

  setActiveTab: (tab) => set({ activeTab: tab }),
  openTermTooltip: (term, translation) =>
    set({ showTermTooltip: true, termTooltip: { term, translation } }),
  closeTermTooltip: () =>
    set({ showTermTooltip: false, termTooltip: { term: '', translation: '' } }),
  openRiskAlert: (message) =>
    set({ showRiskAlert: true, riskAlert: { message } }),
  closeRiskAlert: () =>
    set({ showRiskAlert: false, riskAlert: { message: '' } }),
  openVoicePlayer: (text) =>
    set({ showVoicePlayer: true, voicePlayer: { text } }),
  closeVoicePlayer: () =>
    set({ showVoicePlayer: false, voicePlayer: { text: '' } }),
}))
