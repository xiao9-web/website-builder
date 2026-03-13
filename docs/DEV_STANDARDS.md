# 开发规范

## 📐 代码规范

### TypeScript 规范

#### 1. 类型定义
```typescript
// ✅ 好的做法
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

function getUser(id: number): Promise<User> {
  // ...
}

// ❌ 避免使用 any
function processData(data: any) {  // 不推荐
  // ...
}

// ✅ 使用具体类型或泛型
function processData<T>(data: T): T {
  // ...
}
```

#### 2. 命名规范
```typescript
// 文件名：kebab-case
// user-service.ts
// article-controller.ts

// 类名：PascalCase
class UserService {}
class ArticleController {}

// 函数/变量：camelCase
const getUserById = () => {};
const articleList = [];

// 常量：UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';

// 接口：PascalCase，可选 I 前缀
interface User {}
interface IUserRepository {}  // 可选

// 类型别名：PascalCase
type UserId = number;
type UserRole = 'admin' | 'user';
```

#### 3. 函数规范
```typescript
// ✅ 函数不超过 50 行
// ✅ 单一职责原则
// ✅ 有明确的输入输出类型

/**
 * 根据ID获取用户信息
 * @param id 用户ID
 * @returns 用户信息
 * @throws {NotFoundException} 用户不存在时抛出
 */
async function getUserById(id: number): Promise<User> {
  const user = await userRepository.findOne(id);
  if (!user) {
    throw new NotFoundException('用户不存在');
  }
  return user;
}

// ❌ 避免函数过长
function processUserData(data: any) {
  // 100+ 行代码...
  // 应该拆分成多个小函数
}
```

#### 4. 类规范
```typescript
// ✅ 类不超过 300 行
// ✅ 职责清晰
// ✅ 依赖注入

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    // 验证
    await this.validateUser(dto);

    // 创建
    const user = this.userRepository.create(dto);
    await this.userRepository.save(user);

    // 发送欢迎邮件
    await this.emailService.sendWelcome(user.email);

    return user;
  }

  private async validateUser(dto: CreateUserDto): Promise<void> {
    // 验证逻辑
  }
}
```

---

### Vue 3 规范

#### 1. 组件结构
```vue
<script setup lang="ts">
// 1. 导入
import { ref, computed, onMounted } from 'vue';
import type { User } from '@/types';

// 2. Props 定义
interface Props {
  userId: number;
  showDetails?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  showDetails: true,
});

// 3. Emits 定义
interface Emits {
  (e: 'update', user: User): void;
  (e: 'delete', id: number): void;
}
const emit = defineEmits<Emits>();

// 4. 响应式数据
const user = ref<User | null>(null);
const loading = ref(false);

// 5. 计算属性
const displayName = computed(() => {
  return user.value ? `${user.value.name} (${user.value.email})` : '';
});

// 6. 方法
async function loadUser() {
  loading.value = true;
  try {
    user.value = await fetchUser(props.userId);
  } finally {
    loading.value = false;
  }
}

// 7. 生命周期
onMounted(() => {
  loadUser();
});
</script>

<template>
  <div class="user-card">
    <div v-if="loading">加载中...</div>
    <div v-else-if="user">
      <h3>{{ displayName }}</h3>
      <div v-if="showDetails">
        <!-- 详细信息 -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-card {
  /* 样式 */
}
</style>
```

#### 2. 组件命名
```typescript
// ✅ 多单词组件名
UserCard.vue
ArticleList.vue
CommentForm.vue

// ❌ 单个单词
User.vue  // 不推荐
Article.vue  // 不推荐

// ✅ 组件文件名使用 PascalCase
UserProfile.vue
ProductCard.vue

// ✅ 组件使用时
<UserProfile />
<ProductCard />
```

#### 3. Props 验证
```typescript
// ✅ 使用 TypeScript 类型
interface Props {
  title: string;
  count?: number;
  items: Array<Item>;
  status: 'pending' | 'success' | 'error';
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  status: 'pending',
});

// ✅ 必需的 props 不设置默认值
// ✅ 可选的 props 设置合理的默认值
```

---

### NestJS 规范

#### 1. 模块结构
```
src/modules/user/
├── dto/
│   ├── create-user.dto.ts
│   ├── update-user.dto.ts
│   └── user-query.dto.ts
├── entities/
│   └── user.entity.ts
├── user.controller.ts
├── user.service.ts
├── user.module.ts
└── user.repository.ts (可选)
```

#### 2. Controller 规范
```typescript
@Controller('users')
@ApiTags('用户管理')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '创建用户' })
  @ApiResponse({ status: 201, description: '创建成功', type: User })
  async create(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取用户详情' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新用户' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.userService.remove(id);
  }
}
```

#### 3. Service 规范
```typescript
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    // 1. 验证
    await this.validateEmail(dto.email);

    // 2. 创建实体
    const user = this.userRepository.create(dto);

    // 3. 保存
    return this.userRepository.save(user);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`用户 #${id} 不存在`);
    }
    return user;
  }

  private async validateEmail(email: string): Promise<void> {
    const exists = await this.userRepository.findOne({ where: { email } });
    if (exists) {
      throw new BadRequestException('邮箱已被使用');
    }
  }
}
```

#### 4. DTO 规范
```typescript
import { IsString, IsEmail, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: '用户名', example: 'zhangsan' })
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  name: string;

  @ApiProperty({ description: '邮箱', example: 'zhangsan@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '密码', example: '123456' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ description: '手机号' })
  @IsOptional()
  @IsString()
  phone?: string;
}
```

#### 5. Entity 规范
```typescript
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({ description: '用户ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '用户名' })
  @Column({ length: 50 })
  name: string;

  @ApiProperty({ description: '邮箱' })
  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ select: false })  // 查询时默认不返回密码
  password: string;

  @ApiProperty({ description: '手机号' })
  @Column({ nullable: true, length: 20 })
  phone: string;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

## 🔒 安全规范

### 1. 输入验证
```typescript
// ✅ 使用 class-validator 验证所有输入
export class CreateArticleDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @IsString()
  @MinLength(10)
  content: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

// ✅ 使用 Pipe 进行参数转换和验证
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  // id 已经被转换为 number 类型
}
```

### 2. SQL 注入防护
```typescript
// ✅ 使用 TypeORM 参数化查询
const user = await this.userRepository.findOne({
  where: { email: userEmail }
});

// ✅ 使用 QueryBuilder 时使用参数
const users = await this.userRepository
  .createQueryBuilder('user')
  .where('user.name LIKE :name', { name: `%${searchTerm}%` })
  .getMany();

// ❌ 避免字符串拼接
const users = await this.userRepository.query(
  `SELECT * FROM users WHERE name = '${searchTerm}'`  // 危险！
);
```

### 3. XSS 防护
```typescript
// ✅ 前端使用 Vue 的自动转义
<template>
  <div>{{ userInput }}</div>  <!-- 自动转义 -->
</template>

// ✅ 需要渲染 HTML 时使用 DOMPurify
import DOMPurify from 'dompurify';

const cleanHtml = DOMPurify.sanitize(dirtyHtml);

// ❌ 避免使用 v-html 渲染未过滤的内容
<div v-html="userInput"></div>  <!-- 危险！ -->
```

### 4. 认证授权
```typescript
// ✅ 使用 JWT 认证
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  // ...
}

// ✅ 使用角色守卫
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Delete(':id')
async remove(@Param('id') id: number) {
  // 只有 admin 角色可以访问
}

// ✅ 敏感信息加密存储
import * as bcrypt from 'bcrypt';

const hashedPassword = await bcrypt.hash(password, 10);
```

### 5. 速率限制
```typescript
// ✅ 使用 throttler 限制请求频率
@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() dto: LoginDto) {
    // 登录逻辑
  }
}
```

---

## 📝 注释规范

### 1. 文件注释
```typescript
/**
 * 用户服务
 *
 * 负责用户相关的业务逻辑处理
 *
 * @author zhangsan
 * @date 2024-03-13
 */
```

### 2. 函数注释
```typescript
/**
 * 根据ID获取用户信息
 *
 * @param id 用户ID
 * @returns 用户信息
 * @throws {NotFoundException} 当用户不存在时抛出
 *
 * @example
 * const user = await getUserById(1);
 * console.log(user.name);
 */
async function getUserById(id: number): Promise<User> {
  // ...
}
```

### 3. 复杂逻辑注释
```typescript
// 计算用户等级
// 规则：
// - 积分 < 100: 普通用户
// - 100 <= 积分 < 1000: 银牌用户
// - 积分 >= 1000: 金牌用户
function calculateUserLevel(points: number): string {
  if (points < 100) return 'normal';
  if (points < 1000) return 'silver';
  return 'gold';
}
```

---

## 🧪 测试规范

### 1. 单元测试
```typescript
describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('findOne', () => {
    it('应该返回用户信息', async () => {
      const user = { id: 1, name: 'Test User', email: 'test@example.com' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(user as User);

      const result = await service.findOne(1);
      expect(result).toEqual(user);
    });

    it('用户不存在时应该抛出异常', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});
```

### 2. 测试覆盖率要求
- 核心业务逻辑：> 80%
- Controller：> 70%
- Service：> 80%
- Util 函数：> 90%

---

## 📦 Git 规范

### 1. 分支命名
```bash
# 新功能
feature/user-authentication
feature/comment-system

# Bug 修复
fix/login-error
fix/memory-leak

# 重构
refactor/user-service
refactor/database-schema

# 文档
docs/api-documentation
docs/deployment-guide
```

### 2. 提交信息
```bash
# 格式：<type>(<scope>): <description>

# 类型
feat: 新功能
fix: Bug 修复
docs: 文档更新
style: 代码格式调整（不影响功能）
refactor: 重构
test: 测试相关
chore: 构建/工具相关

# 示例
feat(user): 添加用户注册功能
fix(auth): 修复登录token过期问题
docs(api): 更新API文档
refactor(database): 优化数据库查询性能
test(user): 添加用户服务单元测试
```

### 3. 提交频率
- ✅ 完成一个小功能就提交
- ✅ 修复一个 Bug 就提交
- ✅ 重构一个模块就提交
- ❌ 不要积累大量修改后一次性提交

---

## 📚 文档规范

### 1. README.md
- 项目简介
- 功能特性
- 技术栈
- 快速开始
- 使用文档链接

### 2. API 文档
- 使用 Swagger/OpenAPI
- 每个接口必须有描述
- 参数说明清晰
- 示例完整

### 3. 架构文档
- 系统架构图
- 模块划分
- 数据流向
- 技术选型说明

---

## ⚡ 性能规范

### 1. 数据库查询
```typescript
// ✅ 使用索引
@Index(['email'])
@Entity('users')
export class User {
  @Column({ unique: true })
  email: string;
}

// ✅ 避免 N+1 查询
const users = await this.userRepository.find({
  relations: ['posts', 'comments'],  // 使用 eager loading
});

// ✅ 分页查询
const [users, total] = await this.userRepository.findAndCount({
  skip: (page - 1) * pageSize,
  take: pageSize,
});
```

### 2. 前端性能
```typescript
// ✅ 使用计算属性缓存
const expensiveValue = computed(() => {
  return heavyCalculation(props.data);
});

// ✅ 使用 v-memo 优化列表渲染
<div v-for="item in list" :key="item.id" v-memo="[item.id, item.name]">
  {{ item.name }}
</div>

// ✅ 懒加载组件
const HeavyComponent = defineAsyncComponent(() =>
  import('./HeavyComponent.vue')
);
```

---

## 🔍 代码审查清单

- [ ] 代码符合命名规范
- [ ] 函数不超过 50 行
- [ ] 类不超过 300 行
- [ ] 没有使用 any 类型
- [ ] 所有公共 API 有文档注释
- [ ] 输入验证完整
- [ ] 错误处理完善
- [ ] 有单元测试
- [ ] 测试覆盖率达标
- [ ] 没有硬编码敏感信息
- [ ] Git 提交信息规范
