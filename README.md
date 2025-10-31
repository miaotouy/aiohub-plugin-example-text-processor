# Example Text Processor - JavaScript 插件示例

这是一个基于 TypeScript 的 JavaScript 插件示例，用于演示插件系统的功能和配置管理。

## 功能特性

- ✅ 文本大小写转换（大写/小写）
- ✅ 文本反转
- ✅ 单词统计
- ✅ 可配置的前缀/后缀
- ✅ 支持插件配置系统

## 开发环境

### 前置要求

- Node.js 18+ 或 Bun
- TypeScript 5.3+

### 开发模式

在开发模式下，直接使用 TypeScript 源码（`index.ts`），主应用会从 `plugins/example-text-processor/` 目录加载：

```bash
# 编译 TypeScript（生成 index.js）
bun run build

# 或使用 watch 模式（自动重新编译）
bun run dev
```

编译后会在插件目录生成 `index.js` 文件。

## 生产构建

### 打包发布

生成可分发的插件包：

```bash
# 安装依赖（首次）
bun install

# 打包插件
bun run package
```

这会执行以下操作：

1. **编译 TypeScript** 为 `index.js`
2. **创建 `dist/` 目录**，包含：
   ```
   dist/
   ├── index.js        (编译后的 JS 文件)
   ├── manifest.json   (插件清单)
   └── README.md       (文档)
   ```
3. **生成 `.zip` 压缩包**：`example-text-processor-v1.0.0.zip`

**最终产物**：
- `dist/` - 未压缩的插件目录
- `example-text-processor-v1.0.0.zip` - 可直接分发的压缩包

## 插件使用

在主应用中调用此插件：

```typescript
import { executor } from '@/services';

// 转换为大写
const result = await executor.execute({
  service: 'example-text-processor',
  method: 'toUpperCase',
  params: {
    text: 'hello world'
  }
});

console.log(result); // "HELLO WORLD"

// 统计单词数
const count = await executor.execute({
  service: 'example-text-processor',
  method: 'countWords',
  params: {
    text: 'hello world'
  }
});

console.log(count); // 2
```

## 配置系统

此插件展示了如何使用配置系统：

```typescript
// 在插件中读取配置
const prefix = await context.settings.get<string>('prefix');
const enablePrefix = await context.settings.get<boolean>('enablePrefix');

// 获取所有配置
const allSettings = await context.settings.getAll();

// 设置配置值
await context.settings.set('prefix', '【重要】');
```

用户可以在"扩展管理 > 已安装 > 插件设置"中配置：
- **文本前缀**：处理后的文本自动添加前缀
- **文本后缀**：处理后的文本自动添加后缀
- **启用前缀/后缀**：是否应用前缀和后缀
- **默认大小写**：默认的大小写转换方式

## 目录结构

```
example-text-processor/
├── index.ts                           # TypeScript 源码
├── index.js                           # 编译产物（gitignore）
├── dist/                              # 打包产物（gitignore）
│   ├── index.js
│   ├── manifest.json
│   └── README.md
├── example-text-processor-v1.0.0.zip  # 发布包（gitignore）
├── build.js                           # 构建脚本
├── tsconfig.json                      # TypeScript 配置
├── package.json                       # 项目配置
├── manifest.json                      # 插件清单
└── README.md
```

## API 文档

### toUpperCase

将文本转换为大写。

**参数**：
- `text` (string, required): 要转换的文本

**返回**: `Promise<string>`

### toLowerCase

将文本转换为小写。

**参数**：
- `text` (string, required): 要转换的文本

**返回**: `Promise<string>`

### reverse

反转文本。

**参数**：
- `text` (string, required): 要反转的文本

**返回**: `Promise<string>`

### countWords

统计单词数量。

**参数**：
- `text` (string, required): 要统计的文本

**返回**: `Promise<number>`

### applyDefaultCase

根据配置应用默认大小写转换。

**参数**：
- `text` (string, required): 要转换的文本

**返回**: `Promise<string>`

## 许可证

MIT