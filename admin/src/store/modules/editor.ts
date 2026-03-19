import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Component, PageLayoutConfig, ComponentEvent, ComponentEventData } from '@/types/components';
import { getComponentDefaultProps } from '@/components/Editor/componentLibrary';

interface EditorState {
  config: PageLayoutConfig | null;
  selectedComponentId: string | null;
  history: PageLayoutConfig[];
  historyIndex: number;
  isDirty: boolean;
  undoAvailable: boolean;
  redoAvailable: boolean;
}

export const useEditorStore = defineStore('editor', {
  state: (): EditorState => ({
    config: null,
    selectedComponentId: null,
    history: [],
    historyIndex: -1,
    isDirty: false,
    undoAvailable: false,
    redoAvailable: false,
  }),

  getters: {
    // 获取所有组件
    components: (state): Component[] => {
      return state.config?.components || [];
    },

    // 获取选中的组件
    selectedComponent: (state): Component | null => {
      if (!state.selectedComponentId || !state.config) {
        return null;
      }
      return state.config.components.find(c => c.id === state.selectedComponentId) || null;
    },

    // 是否可以撤销
    canUndo: (state): boolean => {
      return state.historyIndex > 0;
    },

    // 是否可以重做
    canRedo: (state): boolean => {
      return state.config && state.historyIndex < state.history.length - 1;
    },

    // 配置是否有修改
    hasChanges: (state): boolean => {
      return state.isDirty;
    },
  },

  actions: {
    // 初始化编辑器配置
    initializeConfig(config: Partial<PageLayoutConfig> = {}) {
      this.config = {
        version: '1.0.0',
        components: [],
        settings: {
          title: config.settings?.title || '新页面',
          description: config.settings?.description || '',
          backgroundColor: config.settings?.backgroundColor || '#ffffff',
          textColor: config.settings?.textColor || '#000000',
          fontFamily: config.settings?.fontFamily || 'Arial, sans-serif',
          maxWidth: config.settings?.maxWidth || '1200px',
        },
        ...config,
      };
      this.selectedComponentId = null;
      this.history = [JSON.parse(JSON.stringify(this.config))];
      this.historyIndex = 0;
      this.isDirty = false;
    },

    // 保存到历史记录
    saveToHistory() {
      if (!this.config) return;

      const snapshot = JSON.parse(JSON.stringify(this.config));

      // 移除当前索引之后的历史记录
      if (this.historyIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.historyIndex + 1);
      }

      this.history.push(snapshot);
      this.historyIndex = this.history.length - 1;
      this.isDirty = true;
    },

    // 撤销
    undo() {
      if (!this.canUndo) return;

      this.historyIndex--;
      this.config = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      this.selectedComponentId = null;
      this.isDirty = true;
    },

    // 重做
    redo() {
      if (!this.canRedo) return;

      this.historyIndex++;
      this.config = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      this.selectedComponentId = null;
      this.isDirty = true;
    },

    // 添加组件
    addComponent(type: string, position?: number) {
      if (!this.config) return;

      const component = getComponentDefaultProps(type as any);

      if (typeof position === 'number') {
        this.config.components.splice(position, 0, component);
      } else {
        this.config.components.push(component);
      }

      this.selectedComponentId = component.id;
      this.saveToHistory();
    },

    // 删除组件
    deleteComponent(componentId?: string) {
      if (!this.config) return;

      const id = componentId || this.selectedComponentId;
      if (!id) return;

      const index = this.config.components.findIndex(c => c.id === id);
      if (index > -1) {
        this.config.components.splice(index, 1);
        if (this.selectedComponentId === id) {
          this.selectedComponentId = null;
        }
        this.saveToHistory();
      }
    },

    // 移动组件
    moveComponent(fromIndex: number, toIndex: number) {
      if (!this.config) return;

      const components = this.config.components;
      if (fromIndex < 0 || fromIndex >= components.length) return;
      if (toIndex < 0 || toIndex >= components.length) return;

      const [component] = components.splice(fromIndex, 1);
      components.splice(toIndex, 0, component);
      this.saveToHistory();
    },

    // 更新组件属性
    updateComponentProps(componentId: string, props: Partial<Component>) {
      if (!this.config) return;

      const component = this.config.components.find(c => c.id === componentId);
      if (component) {
        Object.assign(component, props);
        this.saveToHistory();
      }
    },

    // 选择组件
    selectComponent(componentId: string | null) {
      this.selectedComponentId = componentId;
    },

    // 更新页面设置
    updatePageSettings(settings: Partial<PageLayoutConfig['settings']>) {
      if (!this.config) return;

      Object.assign(this.config.settings, settings);
      this.saveToHistory();
    },

    // 导入配置
    importConfig(config: PageLayoutConfig) {
      this.config = JSON.parse(JSON.stringify(config));
      this.selectedComponentId = null;
      this.history = [JSON.parse(JSON.stringify(this.config))];
      this.historyIndex = 0;
      this.isDirty = false;
    },

    // 导出配置
    exportConfig(): PageLayoutConfig | null {
      if (!this.config) return null;
      return JSON.parse(JSON.stringify(this.config));
    },

    // 标记为已保存
    markAsSaved() {
      this.isDirty = false;
    },

    // 重置编辑器
    reset() {
      this.config = null;
      this.selectedComponentId = null;
      this.history = [];
      this.historyIndex = -1;
      this.isDirty = false;
    },
  },

  persist: {
    key: 'editor-state',
    storage: localStorage,
    paths: [], // 不持久化，因为状态比较大
  },
});
