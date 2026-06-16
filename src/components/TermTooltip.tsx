import React from 'react';
import { X } from 'lucide-react';

interface TermTooltipProps {
  open: boolean;
  onClose: () => void;
  term: string;
  translation: string;
  example: string;
}

const TermTooltip: React.FC<TermTooltipProps> = ({ open, onClose, term, translation, example }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative w-full max-w-lg bg-white rounded-t-3xl p-8 pb-10 transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-elder-xl font-bold text-warm-text">{term}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-warm-bg hover:bg-warm-border transition-colors"
          >
            <X className="w-6 h-6 text-warm-muted" />
          </button>
        </div>

        <div className="mb-5">
          <span className="elder-label text-warm-muted">人话翻译：</span>
          <p className="text-elder-xl text-brand font-semibold mt-1">{translation}</p>
        </div>

        <div className="mb-8">
          <span className="elder-label text-warm-muted">举个例子：</span>
          <p className="text-elder-base text-warm-muted mt-1">{example}</p>
        </div>

        <button onClick={onClose} className="elder-btn-primary w-full text-elder-lg">
          知道了
        </button>
      </div>
    </div>
  );
};

export default TermTooltip;
