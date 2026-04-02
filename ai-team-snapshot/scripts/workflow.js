#!/usr/bin/env node

/**
 * AI团队工作流启动器
 * 根据用户输入的任务类型，自动调用相应的AI角色
 */

const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 任务类型映射
const taskTypes = {
  '1': { name: '需求分析', command: 'analyze-demand' },
  '2': { name: '架构设计', command: 'design-arch' },
  '3': { name: '代码开发', command: 'dev' },
  '4': { name: '代码审查', command: 'code-review' },
  '5': { name: '测试', command: 'test' },
  '6': { name: '部署', command: 'deploy' },
  '7': { name: '安全审计', command: 'security' },
  '8': { name: '写文章', command: 'write-article' },
  '9': { name: '快速修复', command: 'quick-fix' }
};

console.log('\n🤖 AI代码团队 - 工作流启动器\n');
console.log('请选择任务类型：');
Object.entries(taskTypes).forEach(([key, value]) => {
  console.log(`  ${key}. ${value.name}`);
});
console.log('');

rl.question('请输入选项 (1-9): ', (answer) => {
  const task = taskTypes[answer];

  if (!task) {
    console.log('❌ 无效的选项');
    rl.close();
    return;
  }

  console.log(`\n✅ 启动 ${task.name} 流程...`);
  console.log(`💡 提示：在Claude Code中使用 /${task.command} 命令\n`);

  rl.close();
});
