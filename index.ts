/**
 * 示例文本处理器插件
 *
 * 这是一个简单的演示插件，展示了如何实现 JS 插件和使用配置系统
 */

interface TextProcessorParams {
  text: string;
  context?: {
    settings: {
      get<T>(key: string): Promise<T | undefined>;
      getAll(): Promise<Record<string, any> | undefined>;
      set(key: string, value: any): Promise<void>;
    };
  };
}

/**
 * 应用前缀和后缀
 */
async function applyPrefixSuffix(text: string, context?: TextProcessorParams['context']): Promise<string> {
  if (!context) return text;
  
  const enablePrefix = await context.settings.get<boolean>('enablePrefix');
  if (!enablePrefix) return text;
  
  const prefix = await context.settings.get<string>('prefix') || '';
  const suffix = await context.settings.get<string>('suffix') || '';
  
  return `${prefix}${text}${suffix}`;
}

/**
 * 将文本转换为大写
 */
async function toUpperCase({ text, context }: TextProcessorParams): Promise<string> {
  const result = text.toUpperCase();
  return await applyPrefixSuffix(result, context);
}

/**
 * 将文本转换为小写
 */
async function toLowerCase({ text, context }: TextProcessorParams): Promise<string> {
  const result = text.toLowerCase();
  return await applyPrefixSuffix(result, context);
}

/**
 * 反转文本
 */
async function reverse({ text, context }: TextProcessorParams): Promise<string> {
  const result = text.split('').reverse().join('');
  return await applyPrefixSuffix(result, context);
}

/**
 * 统计单词数量
 */
async function countWords({ text, context }: TextProcessorParams): Promise<number> {
  // 简单的单词统计逻辑
  const words = text.trim().split(/\s+/);
  return words.filter(word => word.length > 0).length;
}

/**
 * 根据配置应用默认大小写转换
 */
async function applyDefaultCase({ text, context }: TextProcessorParams): Promise<string> {
  if (!context) return text;
  
  const defaultCase = await context.settings.get<string>('defaultCase');
  
  let result = text;
  switch (defaultCase) {
    case 'upper':
      result = text.toUpperCase();
      break;
    case 'lower':
      result = text.toLowerCase();
      break;
    case 'none':
    default:
      result = text;
      break;
  }
  
  return await applyPrefixSuffix(result, context);
}

// 导出插件接口
export default {
  toUpperCase,
  toLowerCase,
  reverse,
  countWords,
  applyDefaultCase,
};