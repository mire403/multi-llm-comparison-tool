import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ModelConfig, ModelPersona, ComparisonAnalysis } from "../types";

// Helper to get system instruction based on persona
const getSystemInstruction = (persona: ModelPersona): string => {
  switch (persona) {
    case ModelPersona.CREATIVE:
      return "你是一个创意作家。使用隐喻、丰富的词汇和富有表现力的语气。优先考虑参与感和讲故事，而不是严格的简洁。请务必使用中文回答。";
    case ModelPersona.TECHNICAL:
      return "你是一名资深首席工程师。非常简洁、技术性强且精确。尽可能使用要点。避免废话。请务必使用中文回答。";
    case ModelPersona.ELI5:
      return "简单地解释复杂的概念，就像向一个聪明的 5 岁孩子解释一样。使用类比和简单的语言。请务必使用中文回答。";
    case ModelPersona.CRITIC:
      return "你是一个批判性的分析师。仔细审查提示，指出潜在的细微差别或缺陷，并提供平衡但怀疑的观点。请务必使用中文回答。";
    default:
      return "你是一个乐于助人且有礼貌的 AI 助手。请务必使用中文回答。";
  }
};

export const generateModelResponse = async (
  prompt: string,
  config: ModelConfig
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(config.persona),
        temperature: config.temperature,
      },
    });
    
    return response.text || "未生成回复。";
  } catch (error) {
    console.error(`Error generating response for ${config.name}:`, error);
    return `错误: 无法生成回复。 ${(error as Error).message}`;
  }
};

export const analyzeComparison = async (
  prompt: string,
  responseA: string,
  responseB: string,
  nameA: string,
  nameB: string
): Promise<ComparisonAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const analysisSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      metricsA: {
        type: Type.OBJECT,
        properties: {
          creativity: { type: Type.NUMBER, description: "Score 0-100" },
          conciseness: { type: Type.NUMBER, description: "Score 0-100" },
          objectivity: { type: Type.NUMBER, description: "Score 0-100" },
          technical_depth: { type: Type.NUMBER, description: "Score 0-100" },
          positivity: { type: Type.NUMBER, description: "Score 0-100" },
        },
        required: ["creativity", "conciseness", "objectivity", "technical_depth", "positivity"],
      },
      metricsB: {
        type: Type.OBJECT,
        properties: {
          creativity: { type: Type.NUMBER, description: "Score 0-100" },
          conciseness: { type: Type.NUMBER, description: "Score 0-100" },
          objectivity: { type: Type.NUMBER, description: "Score 0-100" },
          technical_depth: { type: Type.NUMBER, description: "Score 0-100" },
          positivity: { type: Type.NUMBER, description: "Score 0-100" },
        },
        required: ["creativity", "conciseness", "objectivity", "technical_depth", "positivity"],
      },
      summary: { type: Type.STRING, description: "A brief summary of the main differences." },
      key_differences: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of 3-5 key differences between the responses."
      },
      winner_reasoning: { type: Type.STRING, description: "A neutral observation of which model might be better for which context." },
    },
    required: ["metricsA", "metricsB", "summary", "key_differences", "winner_reasoning"],
  };

  const analysisPrompt = `
    分析以下两个 AI 对用户提示词的回复： "${prompt}"。
    
    模型 A (${nameA}):
    ${responseA}
    
    模型 B (${nameB}):
    ${responseB}
    
    从定量和定性角度比较它们。请返回 JSON 数据。确保 summary, key_differences, winner_reasoning 字段使用中文回答。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: analysisPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2, // Low temperature for consistent analysis
      },
    });

    const jsonText = response.text || "{}";
    return JSON.parse(jsonText) as ComparisonAnalysis;
  } catch (error) {
    console.error("Error analyzing comparison:", error);
    // Return a fallback empty analysis if AI fails
    return {
      metricsA: { creativity: 0, conciseness: 0, objectivity: 0, technical_depth: 0, positivity: 0 },
      metricsB: { creativity: 0, conciseness: 0, objectivity: 0, technical_depth: 0, positivity: 0 },
      summary: "生成分析报告失败。",
      key_differences: ["分析响应时出错。"],
      winner_reasoning: "暂无",
    };
  }
};