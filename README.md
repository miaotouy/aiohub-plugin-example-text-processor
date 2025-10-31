# 示例文本处理器插件

这是一个简单的演示插件，用于展示 AIO Hub 的插件系统功能。

## 功能

这个插件提供了以下文本处理方法：

- `toUpperCase`: 将文本转换为大写
- `toLowerCase`: 将文本转换为小写
- `reverse`: 反转文本
- `countWords`: 统计单词数量

## 使用方法

在开发模式下，这个插件会自动加载。你可以通过服务执行器来调用插件方法：

```typescript
import { execute } from '@/services/executor';

// 转换为大写
const result = await execute({
  service: 'example-text-processor',
  method: 'toUpperCase',
  params: { text: 'hello world' }
});

if (result.success) {
  console.log(result.data); // 输出: HELLO WORLD
}

// 统计单词
const wordCount = await execute({
  service: 'example-text-processor',
  method: 'countWords',
  params: { text: 'hello world from plugin' }
});

if (wordCount.success) {
  console.log(wordCount.data); // 输出: 4
}
```

## 文件结构

```
example-text-processor/
├── manifest.json    # 插件清单
├── index.ts         # 插件入口文件
└── README.md        # 说明文档
```

## 开发说明

1. `manifest.json` 定义了插件的元数据和暴露的方法
2. `index.ts` 实现了插件的具体功能
3. 插件必须导出一个包含所有方法的对象

## 注意事项

- 这是一个开发模式下的示例插件
- 生产环境下需要将 TypeScript 编译为 JavaScript
- 插件方法应该是异步的（返回 Promise）