/**
 * 示例文本处理器插件
 *
 * 这是一个简单的演示插件，展示了如何实现 JS 插件和使用配置系统
 */
import { type PluginContext, type ServiceMetadata } from "aiohub-sdk";

interface TextParams {
  text: string;
}

let pluginContext: PluginContext | null = null;

/**
 * 获取配置 API 的简写
 */
const settings = () => pluginContext!.settings;

async function activate(context: PluginContext) {
  pluginContext = context;
  console.log("Example Text Processor 插件已激活");
}

async function deactivate() {
  pluginContext = null;
  console.log("Example Text Processor 插件已停用");
}

/**
 * 应用前缀和后缀
 */
async function applyPrefixSuffix(text: string): Promise<string> {
  const enablePrefix = await settings().get<boolean>("enablePrefix");
  if (!enablePrefix) return text;

  const prefix = (await settings().get<string>("prefix")) || "";
  const suffix = (await settings().get<string>("suffix")) || "";

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
  const result = text.split("").reverse().join("");
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
  const defaultCase = await settings().get<string>("defaultCase");

  let result = text;
  switch (defaultCase) {
    case "upper":
      result = text.toUpperCase();
      break;
    case "lower":
      result = text.toLowerCase();
      break;
    case "none":
    default:
      result = text;
      break;
  }

  return await applyPrefixSuffix(result);
}

/**
 * 获取服务元数据
 */
function getMetadata(): ServiceMetadata {
  return {
    methods: [
      {
        name: "toUpperCase",
        displayName: "转换为大写",
        description: "将输入的文本转换为大写格式",
        agentCallable: true,
        parameters: [{ name: "text", type: "string", description: "要处理的文本", required: true }],
        returnType: "Promise<string>",
      },
      {
        name: "toLowerCase",
        displayName: "转换为小写",
        description: "将输入的文本转换为小写格式",
        agentCallable: true,
        parameters: [{ name: "text", type: "string", description: "要处理的文本", required: true }],
        returnType: "Promise<string>",
      },
      {
        name: "reverse",
        displayName: "反转文本",
        description: "将输入的文本进行字符反转",
        agentCallable: true,
        parameters: [{ name: "text", type: "string", description: "要处理的文本", required: true }],
        returnType: "Promise<string>",
      },
      {
        name: "countWords",
        displayName: "统计单词",
        description: "统计输入文本中的单词数量",
        agentCallable: true,
        parameters: [{ name: "text", type: "string", description: "要处理的文本", required: true }],
        returnType: "Promise<number>",
      },
      {
        name: "applyDefaultCase",
        displayName: "应用默认大小写",
        description: "根据插件设置应用默认的大小写转换逻辑",
        agentCallable: true,
        parameters: [{ name: "text", type: "string", description: "要处理的文本", required: true }],
        returnType: "Promise<string>",
      },
    ],
  };
}

// 导出插件接口
export default {
  activate,
  deactivate,
  getMetadata,
  toUpperCase,
  toLowerCase,
  reverse,
  countWords,
  applyDefaultCase,
};