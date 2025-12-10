import React, { useState, useEffect } from 'react';
import { ModelConfig, ModelPersona, ComparisonResult, HistoryItem } from './types';
import { generateModelResponse, analyzeComparison } from './services/geminiService';
import ModelConfigurator from './components/ModelConfigurator';
import ComparisonView from './components/ComparisonView';
import AnalysisCharts from './components/AnalysisCharts';
import { Sparkles, Activity, History, MessageSquarePlus, ChevronRight, Clock, Trash2, Github } from 'lucide-react';

const DEFAULT_CONFIG_A: ModelConfig = {
  id: 'model_a',
  name: '模型 A',
  persona: ModelPersona.DEFAULT,
  temperature: 0.7,
};

const DEFAULT_CONFIG_B: ModelConfig = {
  id: 'model_b',
  name: '模型 B',
  persona: ModelPersona.CREATIVE,
  temperature: 1.0,
};

const QUICK_PROMPTS = [
  "向我解释量子纠缠，就像我五岁一样",
  "写一个关于赛博朋克城市的短篇故事开头",
  "分析远程工作的利弊",
  "如何用 Python 实现快速排序？",
  "给一封拒绝加薪申请的邮件写个草稿",
  "为一家新的咖啡店想5个独特的口号"
];

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [configA, setConfigA] = useState<ModelConfig>(DEFAULT_CONFIG_A);
  const [configB, setConfigB] = useState<ModelConfig>(DEFAULT_CONFIG_B);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Generate a simple ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleCompare = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const [respA, respB] = await Promise.all([
        generateModelResponse(prompt, configA),
        generateModelResponse(prompt, configB),
      ]);

      const analysis = await analyzeComparison(
        prompt, 
        respA, 
        respB, 
        `${configA.name} (${configA.persona})`,
        `${configB.name} (${configB.persona})`
      );

      const newResult: ComparisonResult = {
        prompt,
        responseA: respA,
        responseB: respB,
        configA: { ...configA }, // Snapshot config
        configB: { ...configB },
        analysis,
        timestamp: Date.now(),
      };

      setResult(newResult);
      
      // Add to history
      const historyItem: HistoryItem = {
        id: generateId(),
        timestamp: Date.now(),
        prompt,
        preview: respA.slice(0, 60) + "...",
        result: newResult
      };
      setHistory(prev => [historyItem, ...prev]);

    } catch (error) {
      console.error("Comparison failed", error);
      alert("对比模型时出错，请重试。");
    } finally {
      setIsLoading(false);
    }
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setPrompt(item.prompt);
    setResult(item.result);
    setConfigA(item.result.configA);
    setConfigB(item.result.configB);
    // On mobile, maybe close sidebar
    if (window.innerWidth < 1024) setShowHistory(false);
  };

  const clearHistory = () => {
    if (confirm('确定要清空历史记录吗？')) {
      setHistory([]);
    }
  };

  const handleQuickPrompt = (text: string) => {
    setPrompt(text);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200 selection:bg-primary-500/30 selection:text-primary-100">
      
      {/* Sidebar (History) */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-slate-900/90 backdrop-blur-md border-r border-slate-800 transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${showHistory ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
            <h2 className="font-semibold text-slate-100 flex items-center gap-2">
              <History size={18} className="text-primary-400" />
              历史记录
            </h2>
            {history.length > 0 && (
              <button onClick={clearHistory} className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors" title="清空历史">
                <Trash2 size={16} />
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
            {history.length === 0 ? (
              <div className="text-center py-10 px-4 text-slate-500 text-sm">
                <Clock size={32} className="mx-auto mb-3 opacity-20" />
                <p>暂无历史记录</p>
                <p className="text-xs mt-1 opacity-60">您的对比记录将显示在这里</p>
              </div>
            ) : (
              history.map(item => (
                <div 
                  key={item.id}
                  onClick={() => loadHistoryItem(item)}
                  className={`
                    p-3 rounded-lg cursor-pointer transition-all border border-transparent
                    ${result?.timestamp === item.timestamp ? 'bg-primary-900/20 border-primary-500/30' : 'hover:bg-slate-800/50 border-slate-800/0'}
                  `}
                >
                  <div className="text-sm font-medium text-slate-200 truncate mb-1">{item.prompt}</div>
                  <div className="text-xs text-slate-500 flex justify-between">
                    <span>{new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    <span>{item.result.configA.persona.split(' ')[0]} vs {item.result.configB.persona.split(' ')[0]}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center bg-slate-900/50">
            Session History
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
        
        {/* Mobile Overlay */}
        {showHistory && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setShowHistory(false)}
          />
        )}

        {/* Header */}
        <header className="h-16 border-b border-white/5 bg-slate-900/30 backdrop-blur-sm z-20 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white"
            >
              <History size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-primary-500 to-secondary-500 p-1.5 rounded-lg shadow-lg shadow-primary-500/20">
                 <Activity size={20} className="text-white" />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent truncate max-w-[200px] sm:max-w-none">
                多模型对比器 <span className="hidden sm:inline opacity-60 font-normal">/ Multi-LLM Comparison Tool</span>
              </h1>
            </div>
          </div>
          
          <a href="#" className="flex items-center gap-2 text-xs font-medium bg-slate-800/50 hover:bg-slate-700/50 px-3 py-1.5 rounded-full transition-colors border border-white/5">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             Gemini 2.5 Flash
          </a>
        </header>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Input Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Config A */}
              <div className="lg:col-span-3 order-2 lg:order-1 h-full">
                 <ModelConfigurator 
                    label="模型 A" 
                    config={configA} 
                    onChange={setConfigA} 
                    color="blue"
                 />
              </div>

              {/* Prompt Area */}
              <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col gap-4">
                 <div className="glass rounded-xl p-1 flex flex-col shadow-2xl min-h-[220px]">
                   <textarea
                     value={prompt}
                     onChange={(e) => setPrompt(e.target.value)}
                     placeholder="在此输入提示词以开始对比... (例如：'解释相对论')"
                     className="w-full flex-1 bg-transparent text-slate-100 placeholder-slate-500 p-4 resize-none focus:outline-none text-base sm:text-lg leading-relaxed"
                   />
                   <div className="flex justify-between items-center p-3 border-t border-white/5 bg-slate-900/30 rounded-b-lg">
                     <span className="text-xs text-slate-500 font-medium pl-1">
                        {prompt.length} 字符
                     </span>
                     <button
                       onClick={handleCompare}
                       disabled={isLoading || !prompt.trim()}
                       className={`
                         flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all text-sm
                         ${isLoading || !prompt.trim() 
                           ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700' 
                           : 'bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white shadow-lg hover:shadow-primary-500/25 active:scale-95 border border-transparent'}
                       `}
                     >
                       {isLoading ? (
                         <>
                           <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                           思考中...
                         </>
                       ) : (
                         <>
                           <Sparkles size={16} />
                           开始对比
                         </>
                       )}
                     </button>
                   </div>
                 </div>

                 {/* Quick Prompts */}
                 <div className="flex flex-wrap gap-2">
                    {QUICK_PROMPTS.map((qp, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickPrompt(qp)}
                        className="text-xs bg-slate-800/40 hover:bg-slate-700/60 border border-slate-700/50 text-slate-300 px-3 py-1.5 rounded-full transition-all hover:border-slate-500 truncate max-w-[200px]"
                      >
                        {qp}
                      </button>
                    ))}
                 </div>
              </div>

              {/* Config B */}
              <div className="lg:col-span-3 order-3 h-full">
                <ModelConfigurator 
                    label="模型 B" 
                    config={configB} 
                    onChange={setConfigB} 
                    color="purple"
                />
              </div>
            </div>

            {/* Results Section */}
            {result && !isLoading ? (
              <div className="animate-fade-in-up space-y-8 pb-12">
                <div className="flex items-center justify-center">
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent flex-1 max-w-[200px]"></div>
                    <span className="px-4 text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                      <Sparkles size={12} className="text-yellow-500" />
                      分析结果
                      <Sparkles size={12} className="text-yellow-500" />
                    </span>
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent flex-1 max-w-[200px]"></div>
                </div>

                <ComparisonView 
                  responseA={result.responseA}
                  responseB={result.responseB}
                  configA={result.configA}
                  configB={result.configB}
                />

                {result.analysis && (
                  <AnalysisCharts 
                    analysis={result.analysis}
                    nameA="模型 A"
                    nameB="模型 B"
                  />
                )}
              </div>
            ) : (
              !isLoading && (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 opacity-60">
                    <div className="p-6 rounded-xl border border-dashed border-slate-700 bg-slate-900/20 flex flex-col items-center text-center">
                       <div className="p-3 bg-slate-800 rounded-full mb-3">
                         <MessageSquarePlus size={24} className="text-blue-400" />
                       </div>
                       <h3 className="font-semibold text-slate-300">输入提示词</h3>
                       <p className="text-sm text-slate-500 mt-1">选择一个快捷提示或输入您自己的问题。</p>
                    </div>
                    <div className="p-6 rounded-xl border border-dashed border-slate-700 bg-slate-900/20 flex flex-col items-center text-center">
                       <div className="p-3 bg-slate-800 rounded-full mb-3">
                         <ChevronRight size={24} className="text-purple-400" />
                       </div>
                       <h3 className="font-semibold text-slate-300">配置模型</h3>
                       <p className="text-sm text-slate-500 mt-1">为模型 A 和 B 设置不同的角色和随机性。</p>
                    </div>
                    <div className="p-6 rounded-xl border border-dashed border-slate-700 bg-slate-900/20 flex flex-col items-center text-center">
                       <div className="p-3 bg-slate-800 rounded-full mb-3">
                         <Activity size={24} className="text-green-400" />
                       </div>
                       <h3 className="font-semibold text-slate-300">获取洞察</h3>
                       <p className="text-sm text-slate-500 mt-1">查看详细的文本差异分析和可视化图表。</p>
                    </div>
                 </div>
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;