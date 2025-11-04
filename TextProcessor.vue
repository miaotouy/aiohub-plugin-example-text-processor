<template>
  <div class="text-processor-container">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <el-select v-model="selectedOperation" placeholder="选择操作" size="small" style="width: 200px">
          <el-option
            v-for="op in operations"
            :key="op.value"
            :label="op.label"
            :value="op.value"
          />
        </el-select>
      </div>

      <div class="toolbar-right">
        <el-button @click="clearAll" size="small" plain>
          <el-icon><Delete /></el-icon>
          清空
        </el-button>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="content-container">
      <!-- 左侧：输入区域 -->
      <div class="panel input-panel">
        <div class="panel-header">
          <span class="panel-title">输入文本</span>
          <div class="panel-header-actions">
            <span class="panel-info">{{ inputText.length }} 字符</span>
            <el-button @click="pasteText" size="small" text>
              <el-icon><DocumentCopy /></el-icon>
              粘贴
            </el-button>
          </div>
        </div>
        <div class="panel-content">
          <el-input
            v-model="inputText"
            type="textarea"
            placeholder="请输入要处理的文本..."
            resize="none"
          />
        </div>
      </div>

      <!-- 中间：操作按钮 -->
      <div class="action-panel">
        <el-button
          type="primary"
          @click="processText"
          :loading="processing"
          :disabled="!inputText.trim()"
          size="default"
          circle
        >
          <el-icon v-if="!processing"><Right /></el-icon>
        </el-button>
        <el-button
          @click="swapTexts"
          :disabled="!outputText"
          size="default"
          circle
        >
          <el-icon><Refresh /></el-icon>
        </el-button>
      </div>

      <!-- 右侧：输出区域 -->
      <div class="panel result-panel">
        <div class="panel-header">
          <span class="panel-title">处理结果</span>
          <div class="panel-header-actions">
            <span class="panel-info">{{ outputText.length }} 字符</span>
            <el-button v-if="outputText" @click="copyResult" size="small" text>
              <el-icon><CopyDocument /></el-icon>
              复制结果
            </el-button>
          </div>
        </div>
        <div class="panel-content">
          <!-- 错误提示 -->
          <el-alert
            v-if="error"
            type="error"
            :title="error"
            :closable="true"
            @close="error = ''"
            show-icon
          />

          <!-- 结果显示 -->
          <el-input
            v-else-if="outputText"
            v-model="outputText"
            type="textarea"
            readonly
            resize="none"
          />

          <!-- 空状态 -->
          <div v-else class="empty-state">
            <el-icon class="empty-icon"><DataLine /></el-icon>
            <p class="empty-text">处理结果将显示在这里</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部提示卡片 -->
    <div class="info-footer">
      <el-card shadow="never">
        <div class="info-content">
          <div class="info-title">💡 提示</div>
          <ul class="info-list">
            <li>可以在插件设置中配置默认前缀/后缀</li>
            <li>某些操作会应用用户配置的前缀和后缀</li>
            <li>在扩展管理 > 已安装 > 插件设置 中配置</li>
          </ul>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  Delete,
  DocumentCopy,
  CopyDocument,
  Right,
  Refresh,
  DataLine
} from '@element-plus/icons-vue';
import { customMessage } from '@/utils/customMessage';

// 动态导入 executor
const { execute } = await import('@/services/executor.ts');

const inputText = ref('');
const outputText = ref('');
const selectedOperation = ref('toUpperCase');
const error = ref('');
const processing = ref(false);

// 可用的操作列表
const operations = [
  { label: '转换为大写', value: 'toUpperCase' },
  { label: '转换为小写', value: 'toLowerCase' },
  { label: '反转文本', value: 'reverse' },
  { label: '统计单词', value: 'countWords' },
  { label: '应用默认大小写', value: 'applyDefaultCase' }
];

// 处理文本
const processText = async () => {
  if (!inputText.value.trim()) {
    error.value = '请输入要处理的文本';
    return;
  }

  error.value = '';
  processing.value = true;

  try {
    const result = await execute({
      service: 'example-text-processor',
      method: selectedOperation.value,
      params: { text: inputText.value }
    });

    if (result.success) {
      // 处理返回结果
      if (selectedOperation.value === 'countWords') {
        outputText.value = `单词数量: ${result.data}`;
      } else {
        outputText.value = result.data;
      }
      customMessage.success('处理成功');
    } else {
      error.value = result.error.message || '处理文本失败';
    }
  } catch (err: any) {
    error.value = err.message || '处理文本失败';
  } finally {
    processing.value = false;
  }
};

// 复制结果
const copyResult = async () => {
  if (!outputText.value) return;

  try {
    const { writeText } = await import('@tauri-apps/plugin-clipboard-manager');
    await writeText(outputText.value);
    customMessage.success('已复制到剪贴板');
  } catch (err) {
    customMessage.error('复制失败');
  }
};

// 清空
const clearAll = () => {
  inputText.value = '';
  outputText.value = '';
  error.value = '';
};

// 粘贴文本
const pasteText = async () => {
  try {
    const { readText } = await import('@tauri-apps/plugin-clipboard-manager');
    const text = await readText();
    if (text) {
      inputText.value = text;
      customMessage.success('已粘贴文本');
    }
  } catch (err) {
    customMessage.error('粘贴失败');
  }
};

// 交换输入和输出
const swapTexts = () => {
  const temp = inputText.value;
  inputText.value = outputText.value;
  outputText.value = temp;
};
</script>

<style scoped>
.text-processor-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: var(--bg-color);
  box-sizing: border-box;
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

/* 工具栏 */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 主内容区域 */
.content-container {
  display: flex;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

.panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 300px;
  overflow: hidden;
}

.input-panel {
  border-right: 1px solid var(--border-color);
}

.result-panel {
  border-left: 1px solid var(--border-color);
}

.action-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 20px;
  background-color: var(--card-bg);
  border-left: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
  flex-shrink: 0;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.panel-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
}

.panel-info {
  font-size: 12px;
  color: var(--text-color-light);
}

.panel-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow: hidden;
}

.panel-content :deep(.el-textarea) {
  flex: 1;
  min-height: 0;
}

.panel-content :deep(.el-textarea__inner) {
  height: 100%;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: var(--text-color-light);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 16px;
  margin: 0;
}

/* 底部提示 */
.info-footer {
  padding: 16px 20px;
  background-color: var(--bg-color);
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;
}

.info-content {
  font-size: 13px;
  color: var(--text-color-light);
  line-height: 1.6;
}

.info-title {
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--text-color);
}

.info-list {
  margin: 0;
  padding-left: 20px;
}

.info-list li {
  margin-bottom: 4px;
}

/* 响应式布局 */
@media (max-width: 1024px) {
  .content-container {
    flex-direction: column;
  }

  .action-panel {
    flex-direction: row;
    padding: 12px;
  }

  .input-panel,
  .result-panel {
    border: none;
    border-bottom: 1px solid var(--border-color);
  }

  .panel {
    min-width: auto;
  }
}
</style>