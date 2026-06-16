import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Tag, ShoppingBag, Volume2, ChevronRight } from 'lucide-react';
import { terms, scams } from '@/data/mockData';
import { useUIStore } from '@/stores/useUIStore';
import VoicePlayer from '@/components/VoicePlayer';
import TermTooltip from '@/components/TermTooltip';

const sellSteps = [
  { title: '填信息', desc: '告诉我们要卖哪个号' },
  { title: '估价格', desc: '平台帮你看值多少钱' },
  { title: '等买家', desc: '有人买了平台通知你' },
  { title: '换绑定', desc: '把号转给买家' },
  { title: '收钱啦', desc: '平台把钱打给你' },
];

const buySteps = [
  { title: '选账号', desc: '挑一个喜欢的号' },
  { title: '验号', desc: '平台帮你检查号' },
  { title: '付款', desc: '钱先给平台保管' },
  { title: '换绑', desc: '把号绑到你手机' },
  { title: '确认收号', desc: '确认没问题收号' },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { showTermTooltip, termTooltip, openTermTooltip, closeTermTooltip, showVoicePlayer, voicePlayer, openVoicePlayer } = useUIStore();

  const handlePlayVoice = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.85;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
    openVoicePlayer(text);
  };

  const currentTerm = terms.find((t) => t.term === termTooltip.term);

  return (
    <div className="min-h-screen bg-warm-bg pb-6">
      <div className="px-4 pt-4 space-y-6">
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h1 className="text-elder-xl font-bold text-white">您好，家长！</h1>
            <p className="text-elder-base text-white/80 mt-1">帮孩子处理账号，安全又放心</p>
          </div>
          <Shield className="w-12 h-12 text-white/90 flex-shrink-0" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/sell')}
            className="elder-btn-primary flex items-center justify-center gap-3 rounded-2xl min-h-[64px] text-elder-lg font-bold"
          >
            <Tag className="w-7 h-7" />
            我要卖号
          </button>
          <button
            onClick={() => navigate('/buy')}
            className="elder-btn-safe flex items-center justify-center gap-3 rounded-2xl min-h-[64px] text-elder-lg font-bold"
          >
            <ShoppingBag className="w-7 h-7" />
            我要买号
          </button>
        </div>

        <section>
          <h2 className="text-elder-xl font-bold text-warm-text mb-4">交易流程一看就懂</h2>
          <p className="text-elder-base text-warm-muted mb-3">卖号流程</p>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {sellSteps.map((step, i) => (
              <div key={i} className="flex-shrink-0 w-32 bg-white rounded-xl p-4 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center text-sm font-bold mb-2">
                  {i + 1}
                </div>
                <p className="text-elder-base font-bold text-warm-text">{step.title}</p>
                <p className="text-sm text-warm-muted mt-1">{step.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-elder-base text-warm-muted mb-3 mt-4">买号流程</p>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {buySteps.map((step, i) => (
              <div key={i} className="flex-shrink-0 w-32 bg-white rounded-xl p-4 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center text-sm font-bold mb-2">
                  {i + 1}
                </div>
                <p className="text-elder-base font-bold text-warm-text">{step.title}</p>
                <p className="text-sm text-warm-muted mt-1">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-elder-xl font-bold text-warm-text mb-4">不懂的词点一下</h2>
          <div className="flex gap-2 flex-wrap">
            {terms.map((t) => (
              <button
                key={t.term}
                onClick={() => openTermTooltip(t.term, t.translation)}
                className="rounded-full bg-brand-50 text-brand-700 px-4 py-2 text-elder-base font-medium"
              >
                {t.term}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-elder-xl font-bold text-warm-text mb-4">⚠️ 这些骗局要当心</h2>
          <div className="space-y-3">
            {scams.map((scam, i) => (
              <div key={i} className="bg-warn/10 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-elder-base font-bold text-warm-text">{scam.title}</p>
                    <p className="text-sm text-warm-muted mt-1">{scam.description}</p>
                  </div>
                  <button
                    onClick={() => handlePlayVoice(scam.voiceText)}
                    className="flex-shrink-0 w-12 h-12 rounded-full bg-warn/20 flex items-center justify-center"
                  >
                    <Volume2 className="w-6 h-6 text-warn" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-elder-xl font-bold text-warm-text mb-4">平台担保，钱安全</h2>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              {['买家付钱', '平台保管', '确认后到账'].map((label, i, arr) => (
                <React.Fragment key={label}>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-brand-500 text-white flex items-center justify-center text-sm font-bold">
                      {label}
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <ChevronRight className="w-6 h-6 text-warm-muted flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="text-elder-base text-warm-muted leading-relaxed text-center">
              您的钱全程由平台保管，确认交易完成后才放款，不会出现钱号两空的情况
            </p>
          </div>
        </section>
      </div>

      {showVoicePlayer && voicePlayer.text && <VoicePlayer text={voicePlayer.text} />}
      <TermTooltip
        open={showTermTooltip}
        onClose={closeTermTooltip}
        term={termTooltip.term}
        translation={termTooltip.translation}
        example={currentTerm?.example || ''}
      />
    </div>
  );
};

export default Home;
