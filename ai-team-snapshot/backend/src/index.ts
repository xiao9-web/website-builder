
import fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import articleRoutes from './routes/articles';
import categoryRoutes from './routes/categories';
import tagRoutes from './routes/tags';
import commentRoutes from './routes/comments';
import authRoutes from './routes/auth';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const server = fastify({
  logger: true,
});

// 注册插件
server.register(cors, {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
});

server.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
});

// 装饰器
server.decorate('prisma', prisma);
server.decorate('redis', redis);

// 注册路由
server.register(authRoutes, { prefix: '/api/auth' });
server.register(articleRoutes, { prefix: '/api/articles' });
server.register(categoryRoutes, { prefix: '/api/categories' });
server.register(tagRoutes, { prefix: '/api/tags' });
server.register(commentRoutes, { prefix: '/api/comments' });

// 健康检查
server.get('/health', async () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: 'connected',
    redis: 'connected',
  };
});

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3000', 10);
    await server.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 服务器运行在 http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
