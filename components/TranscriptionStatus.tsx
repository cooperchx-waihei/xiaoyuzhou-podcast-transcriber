import React from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { TranscriptionState } from '../types';

interface StatusProps {
  state: TranscriptionState;
}

export const TranscriptionStatus: React.FC<StatusProps> = ({ state }) => {
  if (state.status === 'idle') return null;

  if (state.status === 'error') {
    return (
      <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl flex items-start gap-3 mb-8 mx-2 sm:mx-0">
        <AlertCircle className="shrink-0 mt-0.5" size={20} />
        <div className="break-all">
          <h4 className="font-semibold">发生错误</h4>
          <p className="text-sm opacity-90">{state.error || '发生了意料之外的错误。'}</p>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 'fetching_info', label: '获取信息' },
    { id: 'downloading_audio', label: '下载音频' },
    { id: 'transcribing', label: 'AI 转写' },
  ];

  const getCurrentStepIndex = () => {
    if (state.status === 'completed') return 3;
    return steps.findIndex(step => step.id === state.status);
  };

  const currentStepIndex = getCurrentStepIndex();
  
  // Logic to prevent line from overflowing (max 100%)
  const progressPercentage = Math.min((currentStepIndex / (steps.length - 1)) * 100, 100);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 mx-2 sm:mx-0">
      <div className="flex items-center justify-between relative px-2 sm:px-4">
        {/* Background Line */}
        <div className="absolute left-2 sm:left-4 right-2 sm:right-4 top-1/2 -translate-y-1/2 h-1 bg-slate-100 -z-0"></div>
        
        {/* Progress Line */}
        <div 
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 transition-all duration-500 -z-0" 
          style={{ width: `calc(${progressPercentage}% - 1rem)` }} // Subtract padding buffer
        ></div>
        
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-indigo-600 border-indigo-600 text-white' 
                    : isCurrent 
                      ? 'bg-white border-indigo-600 text-indigo-600' 
                      : 'bg-slate-100 border-white text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                ) : isCurrent ? (
                  <Loader2 className="animate-spin sm:w-[18px] sm:h-[18px]" size={16} />
                ) : (
                  <span className="text-xs font-bold">{idx + 1}</span>
                )}
              </div>
              <span className={`absolute top-10 sm:top-12 text-[10px] sm:text-xs font-medium whitespace-nowrap ${isCurrent ? 'text-indigo-600' : 'text-slate-500'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      
      {state.status === 'downloading_audio' && state.progress !== undefined && (
        <div className="mt-8">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>正在下载音频内容...</span>
            <span>{state.progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${state.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {state.status === 'transcribing' && (
         <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 animate-pulse px-4">
               正在将音频发送至 Gemini 2.5 Flash... <br className="sm:hidden" />根据音频长度可能需要几分钟。
            </p>
         </div>
      )}
    </div>
  );
};