/**
 * 示例文本处理器插件
 * 
 * 这是一个简单的演示插件，展示了如何实现 JS 插件
 */

interface TextProcessorParams {
  text: string;
}

/**
 * 将文本转换为大写
 */
async function toUpperCase({ text }: TextProcessorParams): Promise<string> {
  return text.toUpperCase();
}

/**
 * 将文本转换为小写
 */
async function toLowerCase({ text }: TextProcessorParams): Promise<string> {
  return text.toLowerCase();
}

/**
 * 反转文本
 */
async function reverse({ text }: TextProcessorParams): Promise<string> {
  return text.split('').reverse().join('');
}

/**
 * 统计单词数量
 */
async function countWords({ text }: TextProcessorParams): Promise<number> {
  // 简单的单词统计逻辑
  const words = text.trim().split(/\s+/);
  return words.filter(word => word.length > 0).length;
}

// 导出插件接口
export default {
  toUpperCase,
  toLowerCase,
  reverse,
  countWords,
};