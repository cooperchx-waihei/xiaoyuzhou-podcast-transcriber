import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check } from 'lucide-react';

interface TranscriptDisplayProps {
  content: string;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ content }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 mx-2 sm:mx-0">
      <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-4 flex justify-between items-center">
        <h2 className="font-bold text-slate-800 flex items-center gap-2 text-sm sm:text-base">
          <span>📝</span> 生成的逐字稿
        </h2>
        <button 
          onClick={handleCopy}
          className="text-xs sm:text-sm flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
        >
          {copied ? <Check size={14} className="sm:w-4 sm:h-4" /> : <Copy size={14} className="sm:w-4 sm:h-4" />}
          {copied ? '已复制' : '复制文本'}
        </button>
      </div>
      <div className="p-4 sm:p-8 max-h-[600px] overflow-y-auto prose prose-slate prose-sm sm:prose-base prose-headings:font-bold prose-a:text-indigo-600 max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};