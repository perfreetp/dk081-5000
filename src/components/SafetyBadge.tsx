import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

interface SafetyBadgeProps {
  level: 'safe' | 'warn' | 'danger';
  score: number;
  label: string;
}

const levelConfig = {
  safe: {
    icon: ShieldCheck,
    bg: 'bg-safe/10',
    border: 'border-safe/30',
    text: 'text-safe',
    badge: 'bg-safe',
  },
  warn: {
    icon: AlertTriangle,
    bg: 'bg-warn/10',
    border: 'border-warn/30',
    text: 'text-warn',
    badge: 'bg-warn',
  },
  danger: {
    icon: ShieldAlert,
    bg: 'bg-danger/10',
    border: 'border-danger/30',
    text: 'text-danger',
    badge: 'bg-danger',
  },
};

const SafetyBadge: React.FC<SafetyBadgeProps> = ({ level, score, label }) => {
  const config = levelConfig[level];
  const Icon = config.icon;

  return (
    <div className={`inline-flex flex-col items-center px-5 py-4 rounded-2xl border ${config.bg} ${config.border}`}>
      <div className={`w-10 h-10 rounded-full ${config.badge} flex items-center justify-center mb-2`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className={`text-elder-xl font-bold ${config.text}`}>{score}</span>
      <span className="text-elder-xs text-warm-muted mt-1">{label}</span>
    </div>
  );
};

export default SafetyBadge;
