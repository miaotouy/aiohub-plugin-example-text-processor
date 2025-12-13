/**
 * 示例文本处理器插件
 *
 * 这是一个简单的演示插件，展示了如何实现 JS 插件和使用配置系统
 */
:6:
import { pluginConfigService } from '@/services/plugin-config.service';

interface TextParams {
  text: string;
}

const config = pluginConfigService.getPluginConfig('example-text-processor');

/**
 * 应用前缀和后缀
 */
async function applyPrefixSuffix(text: string): Promise<string> {
  const enablePrefix = await config.get<boolean>('enablePrefix');
  if (!enablePrefix) return text;

  const prefix = (await config.get<string>('prefix')) || '';
  const suffix = (await config.get<string>('suffix')) || '';

  return `${prefix}${text}${suffix}`;
}

/**
 * 将文本转换为大写
 */
async function toUpperCase({ text }: TextParams): Promise<string> {
  const result = text.toUpperCase();
  return await applyPrefixSuffix(result);
}

/**
 * 将文本转换为小写
 */
async function toLowerCase({ text }: TextParams): Promise<string> {
  const result = text.toLowerCase();
  return await applyPrefixSuffix(result);
}

/**
 * 反转文本
 */
async function reverse({ text }: TextParams): Promise<string> {
  const result = text.split('').reverse().join('');
  return await applyPrefixSuffix(result);
}

/**
 * 统计单词数量
 */
async function countWords({ text }: TextParams): Promise<number> {
  // 简单的单词统计逻辑
  const words = text.trim().split(/\s+/);
  return words.filter((word) => word.length > 0).length;
}

/**
 * 根据配置应用默认大小写转换
 */
async function applyDefaultCase({ text }: TextParams): Promise<string> {
  const defaultCase = await config.get<string>('defaultCase');

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

  return await applyPrefixSuffix(result);
}

// 导出插件接口
export default {
  toUpperCase,
  toLowerCase,
  reverse,
  countWords,
  applyDefaultCase,
};