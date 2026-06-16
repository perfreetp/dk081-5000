import React from 'react';
import { Check } from 'lucide-react';

interface StepProgressProps {
  steps: string[];
  currentStep: number;
}

const StepProgress: React.FC<StepProgressProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-start min-w-max px-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isFuture = index > currentStep;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center" style={{ minWidth: '5rem' }}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-elder-sm transition-all ${
                    isCompleted
                      ? 'bg-safe'
                      : isCurrent
                        ? 'bg-brand animate-pulse'
                        : 'bg-gray-300'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                <span
                  className={`text-elder-xs mt-2 text-center leading-tight ${
                    isCompleted
                      ? 'text-safe font-semibold'
                      : isCurrent
                        ? 'text-brand font-semibold'
                        : 'text-warm-muted'
                  }`}
                >
                  {step}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div className="flex items-start mt-5 mx-1">
                  <div
                    className={`h-0.5 w-8 transition-colors ${
                      index < currentStep ? 'bg-safe' : 'bg-gray-300'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;
