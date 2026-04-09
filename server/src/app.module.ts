import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MenuModule } from './menu/menu.module';
import { ArticleModule } from './article/article.module';
import { PageModule } from './page/page.module';
import { SiteConfigModule } from './site-config/site-config.module';
import { DeployModule } from './deploy/deploy.module';
import { CommonModule } from './common/common.module';
import { UploadModule } from './upload/upload.module';
import { CategoryModule } from './category/category.module';
import { TagModule } from './tag/tag.module';
import { SettingModule } from './setting/setting.module';
import { AiModule } from './ai/ai.module';
import { AttachmentModule } from './attachment/attachment.module';
import { ThemeModule } from './theme/theme.module';
import { PageConfigModule } from './page-config/page-config.module';
import { ProductModule } from './product/product.module';
import { MediaModule } from './media/media.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [
    // 环境变量配置
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 静态文件服务
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    // 数据库配置
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'website_builder',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV === 'development', // 开发环境自动同步表结构
      logging: process.env.NODE_ENV === 'development',
      charset: 'utf8mb4',
      extra: {
        connectionLimit: 10,
        charset: 'utf8mb4_unicode_ci',
      },
    }),

    AuthModule,
    UserModule,
    MenuModule,
    ArticleModule,
    PageModule,
    SiteConfigModule,
    DeployModule,
    CommonModule,
    UploadModule,
    CategoryModule,
    TagModule,
    SettingModule,
    AiModule,
    AttachmentModule,
    ThemeModule,
    PageConfigModule,
    ProductModule,
    MediaModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
