import React from 'react';
import { Radio } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <div className="mb-8 sm:mb-10 text-center px-2">
      <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-slate-200 mb-6">
        <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white mr-3">
            <Radio size={20} />
        </div>
        <div className="flex flex-col items-start">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Powered by Gemini</span>
            <span className="text-lg font-bold text-slate-900">播客转写助手</span>
        </div>
      </div>
      
      <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
        小宇宙 <span className="text-indigo-600">音频转文字</span>
      </h1>
      <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
        粘贴小宇宙单集链接，提取音频并使用 AI 生成逐字稿。
      </p>
    </div>
  );
};