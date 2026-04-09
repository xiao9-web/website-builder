import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { PageService } from '../page/page.service';
import * as templates from '../page/templates.json';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const pageService = app.get(PageService);

  console.log('开始导入页面模板...');

  for (const template of templates as any[]) {
    try {
      // 检查是否已存在
      const existing = await pageService.findBySlug(template.slug);
      if (existing) {
        console.log(`模板 "${template.title}" 已存在，跳过`);
        continue;
      }

      // 创建模板（使用默认用户ID 1）
      await pageService.create({
        ...template,
        layout_config: JSON.stringify(template.layout_config),
      }, 1);
      console.log(`✅ 成功导入模板: ${template.title}`);
    } catch (error) {
      console.error(`❌ 导入模板 "${template.title}" 失败:`, error.message);
    }
  }

  console.log('模板导入完成！');
  await app.close();
}

bootstrap();
