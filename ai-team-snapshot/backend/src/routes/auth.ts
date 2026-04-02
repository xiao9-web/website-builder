
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
});

export default async function authRoutes(fastify: FastifyInstance) {
  // 登录接口
  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { username, password } = loginSchema.parse(request.body);

      const user = await fastify.prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        return reply.status(401).send({
          error: 'Invalid credentials',
          message: '用户名或密码错误',
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return reply.status(401).send({
          error: 'Invalid credentials',
          message: '用户名或密码错误',
        });
      }

      const token = fastify.jwt.sign(
        {
          userId: user.id,
          username: user.username,
        },
        { expiresIn: '2h' }
      );

      const refreshToken = fastify.jwt.sign(
        {
          userId: user.id,
          type: 'refresh',
        },
        { expiresIn: '7d' }
      );

      return {
        accessToken: token,
        refreshToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
        },
      };
    } catch (error) {
      return reply.status(400).send({
        error: 'Validation error',
        message: '输入参数无效',
      });
    }
  });

  // 刷新Token接口
  fastify.post('/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { refreshToken } = request.body as { refreshToken: string };

      const decoded = fastify.jwt.verify(refreshToken) as any;
      if (decoded.type !== 'refresh') {
        return reply.status(401).send({ error: 'Invalid refresh token' });
      }

      const user = await fastify.prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        return reply.status(401).send({ error: 'User not found' });
      }

      const accessToken = fastify.jwt.sign(
        {
          userId: user.id,
          username: user.username,
        },
        { expiresIn: '2h' }
      );

      return { accessToken };
    } catch (error) {
      return reply.status(401).send({ error: 'Invalid refresh token' });
    }
  });

  // 管理员身份验证中间件
  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      reply.status(401).send({ error: 'Unauthorized' });
    }
  });
}
