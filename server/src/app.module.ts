import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MenuModule } from './menu/menu.module';
import { ArticleModule } from './article/article.module';
import { PageModule } from './page/page.module';
import { SiteConfigModule } from './site-config/site-config.module';
import { DeployModule } from './deploy/deploy.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    // 环境变量配置
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
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
    }),
    
    AuthModule,
    UserModule,
    MenuModule,
    ArticleModule,
    PageModule,
    SiteConfigModule,
    DeployModule,
    CommonModule,
  ],
})
export class AppModule {}
