import React from 'react';
import { ModelConfig, ModelPersona } from '../types';
import { Settings, Thermometer, User, Zap, BookOpen, PenTool, AlertTriangle } from 'lucide-react';

interface ModelConfiguratorProps {
  label: string;
  config: ModelConfig;
  onChange: (newConfig: ModelConfig) => void;
  color: 'blue' | 'purple';
}

const PERSONA_DESCRIPTIONS: Record<ModelPersona, string> = {
  [ModelPersona.DEFAULT]: "平衡、友好，适合一般性任务。",
  [ModelPersona.CREATIVE]: "富有想象力，使用丰富的辞藻，适合故事创作。",
  [ModelPersona.TECHNICAL]: "精确、简洁、专业，适合代码和工程问题。",
  [ModelPersona.ELI5]: "使用类比和简单词汇，让复杂概念通俗易懂。",
  [ModelPersona.CRITIC]: "持怀疑态度，寻找逻辑漏洞，适合审核内容。",
};

const PERSONA_ICONS: Record<ModelPersona, React.ReactNode> = {
  [ModelPersona.DEFAULT]: <User size={14} />,
  [ModelPersona.CREATIVE]: <PenTool size={14} />,
  [ModelPersona.TECHNICAL]: <Zap size={14} />,
  [ModelPersona.ELI5]: <BookOpen size={14} />,
  [ModelPersona.CRITIC]: <AlertTriangle size={14} />,
};

const ModelConfigurator: React.FC<ModelConfiguratorProps> = ({ label, config, onChange, color }) => {
  
  const accentColor = color === 'blue' ? 'text-primary-500' : 'text-secondary-500';
  const borderColor = color === 'blue' ? 'focus:border-primary-500' : 'focus:border-secondary-500';
  const rangeColor = color === 'blue' ? 'accent-primary-500' : 'accent-secondary-500';
  const headerBg = color === 'blue' ? 'bg-primary-900/20' : 'bg-secondary-900/20';

  return (
    <div className="glass rounded-xl overflow-hidden flex flex-col h-full">
      <div className={`p-3 border-b border-white/5 flex items-center justify-between ${headerBg}`}>
        <div className="flex items-center gap-2">
          <Settings size={16} className={accentColor} />
          <h3 className="font-semibold text-slate-200">{label}</h3>
        </div>
        <div className={`w-2 h-2 rounded-full ${color === 'blue' ? 'bg-primary-500' : 'bg-secondary-500'}`}></div>
      </div>

      <div className="p-4 space-y-5 flex-1">
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">角色 / 设定</label>
          <div className="relative">
            <select
              value={config.persona}
              onChange={(e) => onChange({ ...config, persona: e.target.value as ModelPersona })}
              className={`w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 px-3 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-opacity-50 ${borderColor} transition-colors appearance-none`}
            >
              {Object.values(ModelPersona).map((persona) => (
                <option key={persona} value={persona}>
                  {persona}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-3 pointer-events-none text-slate-500">
               <Settings size={14} />
            </div>
          </div>
          
          <div className="mt-2 text-xs text-slate-500 flex items-start gap-1.5 bg-slate-900/30 p-2 rounded">
             <div className="mt-0.5 opacity-70">{PERSONA_ICONS[config.persona]}</div>
             <p>{PERSONA_DESCRIPTIONS[config.persona]}</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
             <label className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wide">
               <Thermometer size={14} />
               随机性 (Temperature)
             </label>
             <span className={`text-xs font-mono px-2 py-0.5 rounded ${color === 'blue' ? 'bg-primary-500/20 text-primary-300' : 'bg-secondary-500/20 text-secondary-300'}`}>
               {config.temperature.toFixed(1)}
             </span>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={config.temperature}
            onChange={(e) => onChange({ ...config, temperature: parseFloat(e.target.value) })}
            className={`w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer ${rangeColor}`}
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 font-medium">
            <span>精确 (0.0)</span>
            <span>平衡 (1.0)</span>
            <span>创意 (2.0)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelConfigurator;