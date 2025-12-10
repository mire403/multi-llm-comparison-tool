import React from 'react';
import { Copy, Check, Clock, AlignLeft } from 'lucide-react';
import { ModelConfig } from '../types';

interface ComparisonViewProps {
  responseA: string;
  responseB: string;
  configA: ModelConfig;
  configB: ModelConfig;
}

const ResponseCard: React.FC<{ 
  title: string; 
  subtitle: string; 
  content: string; 
  color: 'blue' | 'purple' 
}> = ({ title, subtitle, content, color }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const charCount = content.length;
  // Crude estimation: ~500 chars per minute reading speed for Chinese/mixed text
  const readTime = Math.max(1, Math.round(charCount / 500));

  const borderColor = color === 'blue' ? 'border-primary-500/30' : 'border-secondary-500/30';
  const badgeColor = color === 'blue' ? 'bg-primary-500/20 text-primary-300 border-primary-500/30' : 'bg-secondary-500/20 text-secondary-300 border-secondary-500/30';
  const headerBg = color === 'blue' ? 'bg-gradient-to-r from-primary-900/40 to-slate-900/40' : 'bg-gradient-to-r from-secondary-900/40 to-slate-900/40';

  return (
    <div className={`flex flex-col h-full rounded-xl overflow-hidden border ${borderColor} glass shadow-2xl`}>
      <div className={`${headerBg} p-4 border-b border-white/5 flex justify-between items-center`}>
        <div>
          <h3 className="font-bold text-slate-100 flex items-center gap-2">
             {title}
             <span className={`text-[10px] px-2 py-0.5 rounded-full border ${badgeColor} uppercase tracking-wider`}>
              {subtitle}
            </span>
          </h3>
        </div>
        <button 
          onClick={handleCopy}
          className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
          title="复制回复"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto max-h-[600px] custom-scrollbar bg-slate-950/30">
        <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap leading-relaxed text-slate-300">
          {content}
        </div>
      </div>

      <div className="bg-slate-900/60 p-2 px-4 border-t border-white/5 flex items-center gap-4 text-xs text-slate-500 font-medium">
         <div className="flex items-center gap-1.5">
            <AlignLeft size={12} />
            {charCount} 字符
         </div>
         <div className="flex items-center gap-1.5">
            <Clock size={12} />
            ~{readTime} 分钟阅读
         </div>
      </div>
    </div>
  );
};

const ComparisonView: React.FC<ComparisonViewProps> = ({ responseA, responseB, configA, configB }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <ResponseCard 
        title="模型 A" 
        subtitle={configA.persona.split(' ')[0]} 
        content={responseA} 
        color="blue"
      />
      <ResponseCard 
        title="模型 B" 
        subtitle={configB.persona.split(' ')[0]} 
        content={responseB} 
        color="purple"
      />
    </div>
  );
};

export default ComparisonView;