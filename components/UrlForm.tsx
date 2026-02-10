import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface UrlFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export const UrlForm: React.FC<UrlFormProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto mb-10 sm:mb-12 px-2">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
        <div className="relative flex flex-col sm:flex-row bg-white rounded-xl shadow-lg border border-slate-100 p-2 gap-2 sm:gap-0">
            <div className="flex-grow flex items-center pl-4 border sm:border-none rounded-lg sm:rounded-none border-slate-200 sm:p-0 bg-slate-50 sm:bg-transparent">
                <Search className="text-slate-400 mr-3 shrink-0" size={20} />
                <input
                    type="url"
                    className="w-full text-slate-700 placeholder-slate-400 focus:outline-none bg-transparent py-3 text-sm sm:text-base"
                    placeholder="https://www.xiaoyuzhoufm.com/episode/..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={isLoading}
                    required
                />
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin mr-2" size={18} />
                        处理中
                    </>
                ) : (
                    '开始转写'
                )}
            </button>
        </div>
      </div>
      <p className="text-xs text-center text-slate-400 mt-3 px-2">
        支持标准小宇宙单集链接。音频下载和处理均在浏览器端进行。
      </p>
    </form>
  );
};