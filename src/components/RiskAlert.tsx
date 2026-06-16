import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface RiskAlertProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const RiskAlert: React.FC<RiskAlertProps> = ({ open, onClose, title, message }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-danger/10 flex items-center justify-center mb-6">
            <AlertTriangle className="w-12 h-12 text-danger" />
          </div>

          <h2 className="text-elder-xl font-bold text-warm-text mb-4">{title}</h2>

          <p className="text-elder-base text-warm-muted leading-relaxed mb-8">{message}</p>

          <button onClick={onClose} className="elder-btn-primary w-full text-elder-lg py-4">
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiskAlert;
