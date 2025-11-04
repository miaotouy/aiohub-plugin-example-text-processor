# 示例文本处理器插件

一个演示 JavaScript 插件系统功能的示例插件，包含完整的 UI 和配置系统集成。

## 功能特性

- ✅ 文本大小写转换（大写/小写）
- ✅ 文本反转
- ✅ 单词统计
- ✅ 可配置的前缀/后缀
- ✅ 完整的 Vue UI 界面
- ✅ 支持开发和生产环境

## 开发模式

在开发模式下，插件无需构建即可使用：

```bash
# 将插件放在主应用的 plugins/ 目录下
# 启动主应用
npm run dev
```

插件会自动加载，修改代码后会立即生效（HMR）。

## 构建插件

### 前置要求

```bash
# 安装依赖
bun install
```

### 构建步骤

```bash
# 仅构建（不打包）
bun run build

# 构建并打包成 ZIP
bun run package
```

构建过程会：
1. 使用 Bun 编译 `index.ts` → `index.js`
2. 使用 Vite 编译 `TextProcessor.vue` → `TextProcessor.js`
3. 自动修改 `manifest.json` 中的组件路径（`.vue` → `.js`）
4. 将所有文件打包到 `dist/` 目录
5. （可选）创建 ZIP 压缩包用于分发

### 输出结构

```
dist/
├── manifest.json       # 自动修改后的清单（component: "TextProcessor.js"）
├── index.js           # 编译后的插件逻辑
├── TextProcessor.js   # 编译后的 UI 组件
└── README.md          # 说明文档
```

## 文件说明

- `manifest.json` - 插件清单（开发模式使用 `.vue`）
- `index.ts` - 插件核心逻辑
- `TextProcessor.vue` - UI 组件（开发模式）
- `vite.config.js` - Vue 组件构建配置
- `build.js` - 完整构建脚本
- `tsconfig.json` - TypeScript 配置

## 插件方法

### `toUpperCase(params)`
将文本转换为大写。

**参数**：
- `text` (string): 要转换的文本

**返回**: `Promise<string>`

### `toLowerCase(params)`
将文本转换为小写。

**参数**：
- `text` (string): 要转换的文本

**返回**: `Promise<string>`

### `reverse(params)`
反转文本。

**参数**：
- `text` (string): 要反转的文本

**返回**: `Promise<string>`

### `countWords(params)`
统计单词数量。

**参数**：
- `text` (string): 要统计的文本

**返回**: `Promise<number>`

### `applyDefaultCase(params)`
根据配置应用默认大小写转换。

**参数**：
- `text` (string): 要转换的文本

**返回**: `Promise<string>`

## 配置项

在插件设置中可配置：

- **文本前缀** - 处理文本时自动添加的前缀
- **文本后缀** - 处理文本时自动添加的后缀
- **启用前缀/后缀** - 是否应用前缀和后缀
- **默认大小写** - 默认的大小写转换方式（upper/lower/none）

## 技术栈

- TypeScript
- Vue 3 (Composition API)
- Element Plus
- Bun (TypeScript 编译)
- Vite (Vue 组件编译)

## 许可证

MIT