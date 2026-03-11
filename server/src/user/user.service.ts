import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    // 初始化管理员账号
    await this.initAdminUser();
  }

  private async initAdminUser() {
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminExists = await this.userRepository.findOne({
      where: { username: adminUsername },
    });

    if (!adminExists) {
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
      
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      const admin = this.userRepository.create({
        username: adminUsername,
        password: hashedPassword,
        email: adminEmail,
        nickname: '管理员',
        role: UserRole.ADMIN,
        is_active: true,
      });

      await this.userRepository.save(admin);
      console.log('✅ 管理员账号初始化成功');
      console.log(`   用户名: ${adminUsername}`);
      console.log(`   密码: ${adminPassword}`);
    }
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'username', 'nickname', 'email', 'role', 'is_active', 'avatar', 'created_at'],
    });
  }

  async findOne(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'nickname', 'email', 'role', 'is_active', 'avatar', 'created_at'],
    });
  }

  async update(id: number, updateData: Partial<User>): Promise<User> {
    // 如果更新密码，需要加密
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    await this.userRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
