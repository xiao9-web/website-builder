import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SettingService } from './setting/setting.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  console.log('🔧 开始初始化数据库...\n');

  // 初始化系统设置
  const settingService = app.get(SettingService);
  console.log('📝 初始化系统设置...');
  await settingService.initDefaultSettings();
  console.log('✅ 系统设置初始化完成\n');

  console.log('🎉 数据库初始化完成！');
  await app.close();
}

bootstrap().catch((error) => {
  console.error('❌ 初始化失败:', error);
  process.exit(1);
});
