import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, Square } from 'lucide-react';

interface VoicePlayerProps {
  text: string;
  autoPlay?: boolean;
}

const VoicePlayer: React.FC<VoicePlayerProps> = ({ text, autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const speak = useCallback(() => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  }, [text]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (autoPlay) {
      speak();
    }
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [autoPlay, speak]);

  return (
    <div className="elder-card flex items-center gap-4 p-4">
      <p className="text-elder-base text-warm-text flex-1 leading-relaxed">{text}</p>

      <div className="flex items-center gap-3">
        <button
          onClick={isPlaying ? stop : speak}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
            isPlaying
              ? 'bg-brand/10 text-brand'
              : 'elder-btn-primary w-14 h-14'
          }`}
        >
          {isPlaying ? (
            <Square className={`w-6 h-6 ${isPlaying ? 'animate-pulse' : ''}`} />
          ) : (
            <Volume2 className="w-6 h-6" />
          )}
        </button>

        {isPlaying && (
          <div className="flex items-center gap-1">
            <span className="w-1 h-3 bg-brand rounded-full animate-pulse" />
            <span className="w-1 h-4 bg-brand rounded-full animate-pulse [animation-delay:0.15s]" />
            <span className="w-1 h-5 bg-brand rounded-full animate-pulse [animation-delay:0.3s]" />
            <span className="w-1 h-4 bg-brand rounded-full animate-pulse [animation-delay:0.45s]" />
            <span className="w-1 h-3 bg-brand rounded-full animate-pulse [animation-delay:0.6s]" />
          </div>
        )}
      </div>
    </div>
  );
};

export default VoicePlayer;
