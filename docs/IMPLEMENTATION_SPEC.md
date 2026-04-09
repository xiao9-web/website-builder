# 主题CMS系统 - 超详细实现规范

## 1. 数据库实体定义

### 1.1 Theme 实体

```typescript
// server/src/theme/theme.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PageConfig } from '../page-config/page-config.entity';

@Entity('themes')
export class Theme {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  name: string;

  @Column({ length: 100 })
  display_name: string;

  @Column({ default: false })
  is_active: boolean;

  @Column('json', { nullable: true })
  config: {
    colors?: {
      primary?: string;
      secondary?: string;
      background?: string;
    };
    fonts?: {
      heading?: string;
      body?: string;
    };
    layout?: {
      maxWidth?: string;
      spacing?: string;
    };
  };

  @OneToMany(() => PageConfig, pageConfig => pageConfig.theme)
  pageConfigs: PageConfig[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

### 1.2 PageConfig 实体

```typescript
// server/src/page-config/page-config.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Theme } from '../theme/theme.entity';

@Entity('page_configs')
export class PageConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  theme_id: number;

  @Column({ length: 50 })
  page_type: string; // 'home' | 'about' | 'products' | 'contact' | 'blog-list' | 'blog-detail'

  @Column('json')
  config: {
    sections: Array<{
      type: string;
      title?: string;
      content?: string;
      imageUrl?: string;
      items?: any[];
      layout?: string;
    }>;
  };

  @ManyToOne(() => Theme, theme => theme.pageConfigs)
  @JoinColumn({ name: 'theme_id' })
  theme: Theme;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

## 2. DTO 定义

### 2.1 Theme DTOs

```typescript
// server/src/theme/dto/create-theme.dto.ts
import { IsString, IsBoolean, IsOptional, IsObject, MaxLength } from 'class-validator';

export class CreateThemeDto {
  @IsString()
  @MaxLength(50)
  name: string; // 主题标识，如 'blog', 'enterprise'

  @IsString()
  @MaxLength(100)
  display_name: string; // 显示名称，如 '个人博客', '企业官网'

  @IsBoolean()
  @IsOptional()
  is_active?: boolean; // 是否激活，默认 false

  @IsObject()
  @IsOptional()
  config?: {
    colors?: {
      primary?: string;
      secondary?: string;
      background?: string;
    };
    fonts?: {
      heading?: string;
      body?: string;
    };
    layout?: {
      maxWidth?: string;
      spacing?: string;
    };
  };
}
```

```typescript
// server/src/theme/dto/update-theme.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateThemeDto } from './create-theme.dto';

export class UpdateThemeDto extends PartialType(CreateThemeDto) {}
```

### 2.2 PageConfig DTOs

```typescript
// server/src/page-config/dto/create-page-config.dto.ts
import { IsNumber, IsString, IsObject, MaxLength } from 'class-validator';

export class CreatePageConfigDto {
  @IsNumber()
  theme_id: number;

  @IsString()
  @MaxLength(50)
  page_type: string; // 'home' | 'about' | 'products' | 'contact' | 'blog-list' | 'blog-detail'

  @IsObject()
  config: {
    sections: Array<{
      type: string; // 'hero' | 'features' | 'products' | 'testimonials' | 'contact-form'
      title?: string;
      content?: string;
      imageUrl?: string;
      items?: any[];
      layout?: string;
    }>;
  };
}
```

## 3. API 端点规范

### 3.1 Theme API

#### GET /api/themes
获取所有主题列表

**请求参数：** 无

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "blog",
      "display_name": "个人博客",
      "is_active": true,
      "config": {
        "colors": {
          "primary": "#3b82f6",
          "secondary": "#8b5cf6"
        }
      },
      "created_at": "2026-04-01T00:00:00.000Z",
      "updated_at": "2026-04-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /api/themes/active
获取当前激活的主题

**请求参数：** 无

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "blog",
    "display_name": "个人博客",
    "is_active": true,
    "config": { ... }
  }
}
```

#### POST /api/themes
创建新主题

**请求体：**
```json
{
  "name": "blog",
  "display_name": "个人博客",
  "is_active": false,
  "config": {
    "colors": {
      "primary": "#3b82f6"
    }
  }
}
```

**响应示例：**
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": 1,
    "name": "blog",
    "display_name": "个人博客",
    "is_active": false,
    "config": { ... },
    "created_at": "2026-04-08T00:00:00.000Z",
    "updated_at": "2026-04-08T00:00:00.000Z"
  }
}
```

#### PATCH /api/themes/:id/activate
激活指定主题（会自动停用其他主题）

**请求参数：** id (路径参数)

**响应示例：**
```json
{
  "code": 200,
  "message": "主题已激活",
  "data": {
    "id": 1,
    "is_active": true
  }
}
```

### 3.2 PageConfig API

#### GET /api/page-configs
获取页面配置列表

**查询参数：**
- theme_id?: number (可选，筛选指定主题)
- page_type?: string (可选，筛选指定页面类型)

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "theme_id": 1,
      "page_type": "home",
      "config": {
        "sections": [
          {
            "type": "hero",
            "title": "欢迎来到我的博客",
            "content": "分享技术与生活",
            "imageUrl": "/uploads/hero.jpg"
          }
        ]
      }
    }
  ]
}
```

#### GET /api/page-configs/:themeId/:pageType
获取指定主题和页面类型的配置

**请求参数：**
- themeId: number (路径参数)
- pageType: string (路径参数)

**响应示例：** 同上

#### POST /api/page-configs
创建页面配置

**请求体：**
```json
{
  "theme_id": 1,
  "page_type": "home",
  "config": {
    "sections": [
      {
        "type": "hero",
        "title": "欢迎",
        "content": "内容"
      }
    ]
  }
}
```

#### PUT /api/page-configs/:id
更新页面配置

**请求体：** 同创建

## 4. Service 方法签名

### 4.1 ThemeService

```typescript
// server/src/theme/theme.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Theme } from './theme.entity';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';

@Injectable()
export class ThemeService {
  constructor(
    @InjectRepository(Theme)
    private themeRepository: Repository<Theme>,
  ) {}

  /**
   * 创建新主题
   * 1. 检查 name 是否已存在
   * 2. 创建并保存主题
   * 3. 返回创建的主题
   */
  async create(createThemeDto: CreateThemeDto): Promise<Theme> {
    const existing = await this.themeRepository.findOne({
      where: { name: createThemeDto.name }
    });
    
    if (existing) {
      throw new ConflictException('主题名称已存在');
    }

    const theme = this.themeRepository.create(createThemeDto);
    return await this.themeRepository.save(theme);
  }

  /**
   * 获取所有主题
   */
  async findAll(): Promise<Theme[]> {
    return await this.themeRepository.find({
      order: { created_at: 'DESC' }
    });
  }

  /**
   * 获取当前激活的主题
   */
  async findActive(): Promise<Theme> {
    const theme = await this.themeRepository.findOne({
      where: { is_active: true }
    });
    
    if (!theme) {
      throw new NotFoundException('没有激活的主题');
    }
    
    return theme;
  }

  /**
   * 根据ID获取主题
   */
  async findOne(id: number): Promise<Theme> {
    const theme = await this.themeRepository.findOne({ where: { id } });
    
    if (!theme) {
      throw new NotFoundException('主题不存在');
    }
    
    return theme;
  }

  /**
   * 更新主题
   */
  async update(id: number, updateThemeDto: UpdateThemeDto): Promise<Theme> {
    const theme = await this.findOne(id);
    Object.assign(theme, updateThemeDto);
    return await this.themeRepository.save(theme);
  }

  /**
   * 激活主题
   * 1. 将所有主题设置为未激活
   * 2. 激活指定主题
   * 3. 返回激活的主题
   */
  async activate(id: number): Promise<Theme> {
    await this.themeRepository.update({}, { is_active: false });
    const theme = await this.findOne(id);
    theme.is_active = true;
    return await this.themeRepository.save(theme);
  }

  /**
   * 删除主题
   * 注意：不允许删除激活的主题
   */
  async remove(id: number): Promise<void> {
    const theme = await this.findOne(id);
    
    if (theme.is_active) {
      throw new ConflictException('不能删除激活的主题');
    }
    
    await this.themeRepository.remove(theme);
  }
}
```

### 4.2 PageConfigService

```typescript
// server/src/page-config/page-config.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageConfig } from './page-config.entity';
import { CreatePageConfigDto } from './dto/create-page-config.dto';
import { UpdatePageConfigDto } from './dto/update-page-config.dto';

@Injectable()
export class PageConfigService {
  constructor(
    @InjectRepository(PageConfig)
    private pageConfigRepository: Repository<PageConfig>,
  ) {}

  /**
   * 创建页面配置
   */
  async create(createDto: CreatePageConfigDto): Promise<PageConfig> {
    const config = this.pageConfigRepository.create(createDto);
    return await this.pageConfigRepository.save(config);
  }

  /**
   * 获取页面配置列表
   * 支持按 theme_id 和 page_type 筛选
   */
  async findAll(themeId?: number, pageType?: string): Promise<PageConfig[]> {
    const where: any = {};
    if (themeId) where.theme_id = themeId;
    if (pageType) where.page_type = pageType;
    
    return await this.pageConfigRepository.find({
      where,
      relations: ['theme'],
      order: { created_at: 'DESC' }
    });
  }

  /**
   * 获取指定主题和页面类型的配置
   */
  async findByThemeAndType(themeId: number, pageType: string): Promise<PageConfig> {
    const config = await this.pageConfigRepository.findOne({
      where: { theme_id: themeId, page_type: pageType },
      relations: ['theme']
    });
    
    if (!config) {
      throw new NotFoundException('页面配置不存在');
    }
    
    return config;
  }

  /**
   * 更新页面配置
   */
  async update(id: number, updateDto: UpdatePageConfigDto): Promise<PageConfig> {
    const config = await this.pageConfigRepository.findOne({ where: { id } });
    
    if (!config) {
      throw new NotFoundException('页面配置不存在');
    }
    
    Object.assign(config, updateDto);
    return await this.pageConfigRepository.save(config);
  }

  /**
   * 删除页面配置
   */
  async remove(id: number): Promise<void> {
    const config = await this.pageConfigRepository.findOne({ where: { id } });
    
    if (!config) {
      throw new NotFoundException('页面配置不存在');
    }
    
    await this.pageConfigRepository.remove(config);
  }
}
```

## 5. 前端组件规范

### 5.1 主题管理页面

```vue
<!-- admin/src/views/theme/ThemeList.vue -->
<template>
  <div class="theme-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>主题管理</span>
          <el-button type="primary" @click="handleCreate">新建主题</el-button>
        </div>
      </template>

      <el-table :data="themes" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="display_name" label="主题名称" />
        <el-table-column prop="name" label="标识" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.is_active ? 'success' : 'info'">
              {{ row.is_active ? '已激活' : '未激活' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button 
              v-if="!row.is_active" 
              type="success" 
              size="small"
              @click="handleActivate(row.id)"
            >
              激活
            </el-button>
            <el-button 
              type="primary" 
              size="small"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button 
              v-if="!row.is_active"
              type="danger" 
              size="small"
              @click="handleDelete(row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 创建/编辑对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="dialogTitle"
      width="600px"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="主题名称">
          <el-input v-model="form.display_name" placeholder="如：个人博客" />
        </el-form-item>
        <el-form-item label="标识">
          <el-input v-model="form.name" placeholder="如：blog" />
        </el-form-item>
        <el-form-item label="主色调">
          <el-color-picker v-model="form.config.colors.primary" />
        </el-form-item>
        <el-form-item label="辅助色">
          <el-color-picker v-model="form.config.colors.secondary" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { themeApi } from '@/api/theme';

interface Theme {
  id: number;
  name: string;
  display_name: string;
  is_active: boolean;
  config: {
    colors: {
      primary: string;
      secondary: string;
    };
  };
}

const themes = ref<Theme[]>([]);
const dialogVisible = ref(false);
const dialogTitle = ref('新建主题');
const form = ref({
  id: 0,
  name: '',
  display_name: '',
  config: {
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6'
    }
  }
});

onMounted(() => {
  loadThemes();
});

async function loadThemes() {
  const res = await themeApi.getList();
  themes.value = res.data;
}

function handleCreate() {
  dialogTitle.value = '新建主题';
  form.value = {
    id: 0,
    name: '',
    display_name: '',
    config: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6'
      }
    }
  };
  dialogVisible.value = true;
}

function handleEdit(theme: Theme) {
  dialogTitle.value = '编辑主题';
  form.value = { ...theme };
  dialogVisible.value = true;
}

async function handleSubmit() {
  try {
    if (form.value.id) {
      await themeApi.update(form.value.id, form.value);
      ElMessage.success('更新成功');
    } else {
      await themeApi.create(form.value);
      ElMessage.success('创建成功');
    }
    dialogVisible.value = false;
    loadThemes();
  } catch (error) {
    ElMessage.error('操作失败');
  }
}

async function handleActivate(id: number) {
  try {
    await themeApi.activate(id);
    ElMessage.success('激活成功');
    loadThemes();
  } catch (error) {
    ElMessage.error('激活失败');
  }
}

async function handleDelete(id: number) {
  try {
    await ElMessageBox.confirm('确定要删除这个主题吗？', '提示', {
      type: 'warning'
    });
    await themeApi.delete(id);
    ElMessage.success('删除成功');
    loadThemes();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
}
</script>
```

### 5.2 页面配置器

```vue
<!-- admin/src/views/page-config/PageConfigurator.vue -->
<template>
  <div class="page-configurator">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>页面配置</span>
          <div>
            <el-select v-model="selectedThemeId" @change="loadPageConfig">
              <el-option 
                v-for="theme in themes" 
                :key="theme.id"
                :label="theme.display_name"
                :value="theme.id"
              />
            </el-select>
            <el-select v-model="selectedPageType" @change="loadPageConfig">
              <el-option label="首页" value="home" />
              <el-option label="关于" value="about" />
              <el-option label="产品" value="products" />
              <el-option label="联系" value="contact" />
            </el-select>
          </div>
        </div>
      </template>

      <div class="sections">
        <div 
          v-for="(section, index) in sections" 
          :key="index"
          class="section-item"
        >
          <el-card>
            <template #header>
              <div class="section-header">
                <span>区块 {{ index + 1 }}</span>
                <el-button 
                  type="danger" 
                  size="small"
                  @click="removeSection(index)"
                >
                  删除
                </el-button>
              </div>
            </template>

            <el-form label-width="100px">
              <el-form-item label="区块类型">
                <el-select v-model="section.type">
                  <el-option label="Hero横幅" value="hero" />
                  <el-option label="特性展示" value="features" />
                  <el-option label="产品列表" value="products" />
                  <el-option label="联系表单" value="contact-form" />
                </el-select>
              </el-form-item>

              <el-form-item label="标题">
                <el-input v-model="section.title" />
              </el-form-item>

              <el-form-item label="内容">
                <el-input 
                  v-model="section.content" 
                  type="textarea"
                  :rows="3"
                />
              </el-form-item>

              <el-form-item label="图片">
                <el-input v-model="section.imageUrl" />
              </el-form-item>
            </el-form>
          </el-card>
        </div>

        <el-button 
          type="primary" 
          @click="addSection"
          style="width: 100%; margin-top: 20px;"
        >
          添加区块
        </el-button>
      </div>

      <div class="actions" style="margin-top: 20px;">
        <el-button type="primary" @click="handleSave">保存配置</el-button>
        <el-button @click="handlePreview">预览</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { themeApi } from '@/api/theme';
import { pageConfigApi } from '@/api/page-config';

const themes = ref([]);
const selectedThemeId = ref(0);
const selectedPageType = ref('home');
const sections = ref([]);
const currentConfigId = ref(0);

onMounted(async () => {
  const res = await themeApi.getList();
  themes.value = res.data;
  if (themes.value.length > 0) {
    selectedThemeId.value = themes.value[0].id;
    loadPageConfig();
  }
});

async function loadPageConfig() {
  try {
    const res = await pageConfigApi.getByThemeAndType(
      selectedThemeId.value,
      selectedPageType.value
    );
    currentConfigId.value = res.data.id;
    sections.value = res.data.config.sections;
  } catch (error) {
    // 如果不存在，创建空配置
    currentConfigId.value = 0;
    sections.value = [];
  }
}

function addSection() {
  sections.value.push({
    type: 'hero',
    title: '',
    content: '',
    imageUrl: ''
  });
}

function removeSection(index: number) {
  sections.value.splice(index, 1);
}

async function handleSave() {
  try {
    const data = {
      theme_id: selectedThemeId.value,
      page_type: selectedPageType.value,
      config: {
        sections: sections.value
      }
    };

    if (currentConfigId.value) {
      await pageConfigApi.update(currentConfigId.value, data);
    } else {
      await pageConfigApi.create(data);
    }

    ElMessage.success('保存成功');
    loadPageConfig();
  } catch (error) {
    ElMessage.error('保存失败');
  }
}

function handlePreview() {
  // 打开新窗口预览
  window.open(`http://localhost:5174?theme=${selectedThemeId.value}&page=${selectedPageType.value}`);
}
</script>

<style scoped>
.section-item {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
```

## 6. API 客户端

```typescript
// admin/src/api/theme.ts
import request from '@/utils/request';

export const themeApi = {
  getList() {
    return request.get('/themes');
  },

  getActive() {
    return request.get('/themes/active');
  },

  create(data: any) {
    return request.post('/themes', data);
  },

  update(id: number, data: any) {
    return request.put(`/themes/${id}`, data);
  },

  activate(id: number) {
    return request.patch(`/themes/${id}/activate`);
  },

  delete(id: number) {
    return request.delete(`/themes/${id}`);
  }
};
```

```typescript
// admin/src/api/page-config.ts
import request from '@/utils/request';

export const pageConfigApi = {
  getList(themeId?: number, pageType?: string) {
    return request.get('/page-configs', {
      params: { theme_id: themeId, page_type: pageType }
    });
  },

  getByThemeAndType(themeId: number, pageType: string) {
    return request.get(`/page-configs/${themeId}/${pageType}`);
  },

  create(data: any) {
    return request.post('/page-configs', data);
  },

  update(id: number, data: any) {
    return request.put(`/page-configs/${id}`, data);
  },

  delete(id: number) {
    return request.delete(`/page-configs/${id}`);
  }
};
```

## 7. 实施步骤

### Day 1-2: 后端基础
1. 创建 Theme 和 PageConfig 实体
2. 创建对应的 DTO
3. 实现 ThemeService 和 PageConfigService
4. 创建 Controller 并实现所有 API 端点
5. 测试所有 API

### Day 3-4: 前端基础
1. 创建 API 客户端
2. 实现主题管理页面
3. 实现页面配置器
4. 测试表单提交和数据加载

### Day 5: 前端主题渲染
1. 在前端官网实现主题加载逻辑
2. 实现博客主题组件
3. 实现企业主题组件
4. 测试主题切换

### Day 6-7: 产品和媒体模块
1. 实现 Product 实体和 API
2. 实现 Media 实体和 API
3. 实现产品管理页面
4. 实现媒体库页面

### Day 8-9: 集成测试
1. 完整流程测试
2. 修复 bug
3. 优化用户体验

### Day 10: 部署和文档
1. 准备生产环境配置
2. 编写用户手册
3. 部署上线

