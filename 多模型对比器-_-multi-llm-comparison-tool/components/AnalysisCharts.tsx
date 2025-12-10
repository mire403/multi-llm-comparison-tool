import React, { useMemo } from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { ComparisonAnalysis, ChartDataPoint } from '../types';

interface AnalysisChartsProps {
  analysis: ComparisonAnalysis;
  nameA: string;
  nameB: string;
}

const AnalysisCharts: React.FC<AnalysisChartsProps> = ({ analysis, nameA, nameB }) => {
  const chartData: ChartDataPoint[] = useMemo(() => {
    return [
      { metric: '创造力', ModelA: analysis.metricsA.creativity, ModelB: analysis.metricsB.creativity, fullMark: 100 },
      { metric: '简洁性', ModelA: analysis.metricsA.conciseness, ModelB: analysis.metricsB.conciseness, fullMark: 100 },
      { metric: '客观性', ModelA: analysis.metricsA.objectivity, ModelB: analysis.metricsB.objectivity, fullMark: 100 },
      { metric: '技术深度', ModelA: analysis.metricsA.technical_depth, ModelB: analysis.metricsB.technical_depth, fullMark: 100 },
      { metric: '积极性', ModelA: analysis.metricsA.positivity, ModelB: analysis.metricsB.positivity, fullMark: 100 },
    ];
  }, [analysis]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Radar Chart */}
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 text-slate-200">指标对比 (雷达图)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#475569" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name={nameA}
                  dataKey="ModelA"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="#3b82f6"
                  fillOpacity={0.4}
                />
                <Radar
                  name={nameB}
                  dataKey="ModelB"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="#8b5cf6"
                  fillOpacity={0.4}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                    itemStyle={{ color: '#e2e8f0' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 text-slate-200">并列评分</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis type="category" dataKey="metric" width={80} tick={{ fill: '#94a3b8' }} />
                <Tooltip 
                    cursor={{fill: '#334155', opacity: 0.2}}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar name={nameA} dataKey="ModelA" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                <Bar name={nameB} dataKey="ModelB" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Text Analysis */}
      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
        <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI 分析报告</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">执行摘要</h4>
            <p className="text-slate-300 leading-relaxed">{analysis.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">主要差异</h4>
              <ul className="space-y-2">
                {analysis.key_differences.map((diff, idx) => (
                  <li key={idx} className="flex items-start text-slate-300 text-sm">
                    <span className="mr-2 text-primary-500">•</span>
                    {diff}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
               <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">场景优胜者</h4>
               <p className="text-slate-300 text-sm italic border-l-4 border-secondary-600 pl-4 py-1 bg-slate-800 rounded-r">
                 {analysis.winner_reasoning}
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisCharts;