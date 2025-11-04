import { ref, h } from 'vue';
import { ElCard, ElButton, ElInput, ElSelect, ElOption, ElAlert, ElEmpty } from 'element-plus';
import { CopyDocument, Refresh, Delete } from '@element-plus/icons-vue';

export default {
  name: 'TextProcessor',
  async setup() {
    // 动态导入 executor
    const { execute } = await import('/src/services/executor.ts');
    
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
        } else {
          error.value = result.error.message || '处理文本失败';
        }
      } catch (err) {
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
        // 可以添加成功提示
      } catch (err) {
        error.value = '复制失败';
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
        }
      } catch (err) {
        error.value = '粘贴失败';
      }
    };

    return () => h('div', {
      class: 'text-processor-container',
      style: {
        height: '100%',
        width: '100%',
        padding: '20px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        overflow: 'auto'
      }
    }, [
      // 标题卡片
      h(ElCard, { shadow: 'never' }, () => [
        h('div', {
          style: {
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '8px'
          }
        }, '📝 文本处理器'),
        h('div', {
          style: {
            fontSize: '14px',
            color: 'var(--text-color-light)'
          }
        }, '对文本进行各种转换和处理操作')
      ]),

      // 操作选择
      h(ElCard, { shadow: 'never' }, () => [
        h('div', {
          style: {
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '12px'
          }
        }, '选择操作'),
        h(ElSelect, {
          modelValue: selectedOperation.value,
          'onUpdate:modelValue': (val) => { selectedOperation.value = val; },
          style: { width: '100%' }
        }, () => operations.map(op =>
          h(ElOption, {
            key: op.value,
            label: op.label,
            value: op.value
          })
        ))
      ]),

      // 输入区域
      h(ElCard, { shadow: 'never' }, () => [
        h('div', {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }
        }, [
          h('div', {
            style: {
              fontSize: '14px',
              fontWeight: '500'
            }
          }, '输入文本'),
          h('div', {
            style: {
              fontSize: '12px',
              color: 'var(--text-color-light)'
            }
          }, `${inputText.value.length} 字符`)
        ]),
        h(ElInput, {
          modelValue: inputText.value,
          'onUpdate:modelValue': (val) => { inputText.value = val; },
          type: 'textarea',
          rows: 6,
          placeholder: '请输入要处理的文本...',
          resize: 'vertical'
        }),
        h('div', {
          style: {
            display: 'flex',
            gap: '8px',
            marginTop: '12px'
          }
        }, [
          h(ElButton, {
            onClick: pasteText,
            size: 'small'
          }, () => '粘贴'),
          h(ElButton, {
            onClick: clearAll,
            size: 'small',
            icon: h(Delete)
          }, () => '清空')
        ])
      ]),

      // 操作按钮
      h('div', {
        style: {
          display: 'flex',
          justifyContent: 'center',
          gap: '12px'
        }
      }, [
        h(ElButton, {
          type: 'primary',
          onClick: processText,
          loading: processing.value,
          disabled: !inputText.value.trim(),
          size: 'large'
        }, () => processing.value ? '处理中...' : '处理文本'),
        h(ElButton, {
          onClick: () => {
            const temp = inputText.value;
            inputText.value = outputText.value;
            outputText.value = temp;
          },
          disabled: !outputText.value,
          icon: h(Refresh),
          size: 'large'
        }, () => '交换')
      ]),

      // 错误提示
      error.value ? h(ElAlert, {
        type: 'error',
        title: error.value,
        closable: true,
        onClose: () => { error.value = ''; }
      }) : null,

      // 输出区域
      outputText.value ? h(ElCard, { shadow: 'never' }, () => [
        h('div', {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }
        }, [
          h('div', {
            style: {
              fontSize: '14px',
              fontWeight: '500'
            }
          }, '处理结果'),
          h('div', {
            style: {
              fontSize: '12px',
              color: 'var(--text-color-light)'
            }
          }, `${outputText.value.length} 字符`)
        ]),
        h(ElInput, {
          modelValue: outputText.value,
          type: 'textarea',
          rows: 6,
          readonly: true,
          resize: 'vertical'
        }),
        h('div', {
          style: {
            display: 'flex',
            gap: '8px',
            marginTop: '12px'
          }
        }, [
          h(ElButton, {
            onClick: copyResult,
            icon: h(CopyDocument),
            size: 'small'
          }, () => '复制结果')
        ])
      ]) : !processing.value ? h(ElEmpty, {
        description: '处理结果将显示在这里',
        style: { padding: '40px 0' }
      }) : null,

      // 配置提示
      h(ElCard, { shadow: 'never' }, () => [
        h('div', {
          style: {
            fontSize: '13px',
            color: 'var(--text-color-light)',
            lineHeight: '1.6'
          }
        }, [
          h('div', { style: { fontWeight: '500', marginBottom: '8px' } }, '💡 提示'),
          h('div', {}, '• 可以在插件设置中配置默认前缀/后缀'),
          h('div', {}, '• 某些操作会应用用户配置的前缀和后缀'),
          h('div', {}, '• 在扩展管理 > 已安装 > 插件设置 中配置')
        ])
      ])
    ]);
  }
};