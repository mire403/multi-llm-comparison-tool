# 🚀 多模型对比器 multi llm comparison tool

并行大模型对比工具 | Compare Two LLMs Side-by-Side

<div align="center">
  <img src="https://github.com/mire403/multi-llm-comparison-tool/blob/main/%E5%A4%9A%E6%A8%A1%E5%9E%8B%E5%AF%B9%E6%AF%94%E5%99%A8-_-multi-llm-comparison-tool/picture/%E4%B8%BB%E9%A1%B5.png">
</div>

欢迎来到**multi llm comparison tool**——一个让你能把两个大语言模型放在擂台上一较高下的超炫对比平台！

无论你是Prompt工程师、模型研究者、开发者，还是单纯想看模型互相“掰手腕”的人，这里都能满足你 😎

## ✨ 功能亮点 Highlights

<div align="center">
  <img src="https://github.com/mire403/multi-llm-comparison-tool/blob/main/%E5%A4%9A%E6%A8%A1%E5%9E%8B%E5%AF%B9%E6%AF%94%E5%99%A8-_-multi-llm-comparison-tool/picture/%E8%BF%90%E8%A1%8C%E7%BB%93%E6%9E%9C1.png">
</div>

### 🧩 1. 左侧历史记录栏

系统会自动把每一次模型对比任务记录下来，支持快速回看 📚

✔ 清晰

✔ 可回放

✔ 方便来回比对

### 🔧 2. 双模型配置区（Persona & Temperature）

每个模型都可以分别设置：

🎭 角色 / Persona（如：默认助手 / 创意写作者 / 专业分析师）

🔥 温度滑条（清晰 → 创意）

📝 统一输入指令

⚡ 一键开始对比

你可以让左边模型非常严谨，让右边模型非常抽象，然后看它们如何解释同一件事，超好玩 🤣

### 📄 3. 并排生成结果（核心组件：ResponseCard）

生成后的内容会以两张高亮卡片方式呈现：

✨ 渐变头部风格

📎 一键复制按钮（Copy/Check 动画）

🧮 字符统计

⏱ 阅读时长估算（基于 500 chars/min）

📜 支持换行的 whitespace-pre-wrap 文本展示

<div align="center">
  <img src="https://github.com/mire403/multi-llm-comparison-tool/blob/main/%E5%A4%9A%E6%A8%A1%E5%9E%8B%E5%AF%B9%E6%AF%94%E5%99%A8-_-multi-llm-comparison-tool/picture/%E8%BF%90%E8%A1%8C%E7%BB%93%E6%9E%9C2.png">
</div>

左边是模型 A（默认）

右边是模型 B（创意写作）

两者风格对比一眼就能看出，一边偏冷峻写实，另一边偏浓烈诗意。

### 📊 4. 图形化对比：雷达图 + 条形图

<div align="center">
  <img src="https://github.com/mire403/multi-llm-comparison-tool/blob/main/%E5%A4%9A%E6%A8%A1%E5%9E%8B%E5%AF%B9%E6%AF%94%E5%99%A8-_-multi-llm-comparison-tool/picture/%E8%BF%90%E8%A1%8C%E7%BB%93%E6%9E%9C3.png">
</div>

🕸 **雷达图**：展示创造力、简洁性、客观性、技术深度、积极性

📈 **条形图横向对比**：不同维度谁更强一目了然

看图就知道哪个模型“更懂你” 😎

### 🧠 5. 自动 AI 分析报告

系统会自动生成整段对比的总结，包括：

执行摘要

两个模型的叙事风格差异

表达倾向

语言特点

场景更适合谁

建议使用场景

模型 A 更善于沉浸式写景，模型 B 更偏哲思与象征 ✍️

“一键对比，立刻得到专家点评。”

### 💾 6. 自动 Session History

每一次对比都会记录在左栏，可以随时点回去重看！

再也不用担心丢结果 🧡

## 🏗 技术结构

### 🔹 前端主要组件

ComparisonView.tsx

ResponseCard.tsx

ModelConfigPanel.tsx（从 UI 结构可推断）

HistorySidebar.tsx

AnalysisCharts.tsx（雷达图、条形图）

### 🔹 响应卡片功能由 ResponseCard 实现

包括复制按钮、字符统计、渐变背景、最大内容滚动区域等。

## 📦 安装与运行

```bash
npm install
npm run dev
```

访问：

```arduino
http://localhost:5173
```

## ⭐ 为什么你需要这个工具？

🔍 想研究不同模型的写作差异

🧪 做 LLM 实验（课堂 / 研究项目）

🧱 对比模型版本升级前后的效果

🧑‍🎨 Prompt 工程调参

🧠 测试文风、风格、分析能力

这个小工具比你想象的更强大！

如果你觉得这个项目对你有帮助，请给仓库点一个 ⭐ Star！
你的鼓励是我继续优化此项目的最大动力 😊
