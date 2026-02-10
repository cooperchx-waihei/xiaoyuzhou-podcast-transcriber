// Using a CORS proxy to bypass cross-origin restrictions on the browser
// In a production environment, this should be handled by your own backend.
export const CORS_PROXY = 'https://api.allorigins.win/get?url=';

export const GEMINI_MODEL = 'gemini-flash-latest'; // Using 2.5 Flash for high efficiency and large context

export const SYSTEM_INSTRUCTION = `你是一位专业的速记员。
你的任务是将提供的播客音频转写为逐字稿（Verbatim Transcript），语言通常为中文。
1. 尽可能区分说话人（例如：Speaker A, Speaker B，或者根据内容推断名字）。
2. 每隔2-3分钟或在主要话题转换时添加时间戳。
3. 使用 Markdown 格式，保持排版清晰易读。
4. 不要摘要，必须提供完整的逐字记录。`;