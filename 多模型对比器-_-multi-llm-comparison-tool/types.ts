export enum ModelPersona {
  DEFAULT = '默认 (帮助助手)',
  CREATIVE = '创意写作 (富有表现力)',
  TECHNICAL = '资深工程师 (简洁/技术性)',
  ELI5 = '简单易懂 (像对5岁孩子解释)',
  CRITIC = '批判分析 (怀疑论者)',
}

export interface ModelConfig {
  id: string;
  name: string;
  persona: ModelPersona;
  temperature: number;
}

export interface AnalysisMetrics {
  creativity: number;
  conciseness: number;
  objectivity: number;
  technical_depth: number;
  positivity: number;
}

export interface ComparisonAnalysis {
  metricsA: AnalysisMetrics;
  metricsB: AnalysisMetrics;
  summary: string;
  key_differences: string[];
  winner_reasoning: string;
}

export interface ComparisonResult {
  prompt: string;
  responseA: string;
  responseB: string;
  configA: ModelConfig;
  configB: ModelConfig;
  analysis: ComparisonAnalysis | null;
  timestamp: number;
}

export interface ChartDataPoint {
  metric: string;
  ModelA: number;
  ModelB: number;
  fullMark: number;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  prompt: string;
  preview: string;
  result: ComparisonResult;
}