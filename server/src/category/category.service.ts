import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Category } from './category.entity';
import { Article } from '../article/article.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  // 生成slug
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9一-龥]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // 创建分类
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name, slug, parent_id } = createCategoryDto;

    // 如果没有提供slug，自动生成
    const finalSlug = slug || this.generateSlug(name);

    // 检查slug是否已存在
    const existingCategory = await this.categoryRepository.findOne({
      where: { slug: finalSlug },
    });
    if (existingCategory) {
      throw new BadRequestException('分类标识已存在');
    }

    // 如果有父分类，检查父分类是否存在
    if (parent_id) {
      const parentCategory = await this.categoryRepository.findOne({
        where: { id: parent_id },
      });
      if (!parentCategory) {
        throw new NotFoundException('父分类不存在');
      }
    }

    const category = this.categoryRepository.create({
      ...createCategoryDto,
      slug: finalSlug,
    });

    return await this.categoryRepository.save(category);
  }

  // 获取所有分类（树形结构）
  async findAll(): Promise<Category[]> {
    const categories = await this.categoryRepository.find({
      order: { sort_order: 'ASC', created_at: 'DESC' },
    });

    // 构建树形结构
    return this.buildTree(categories);
  }

  // 构建树形结构
  private buildTree(categories: Category[], parentId: number = null): Category[] {
    return categories
      .filter(cat => cat.parent_id === parentId)
      .map(cat => ({
        ...cat,
        children: this.buildTree(categories, cat.id),
      }));
  }

  // 获取单个分类
  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });

    if (!category) {
      throw new NotFoundException('分类不存在');
    }

    return category;
  }

  // 更新分类
  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    // 如果更新了slug，检查是否重复
    if (updateCategoryDto.slug && updateCategoryDto.slug !== category.slug) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { slug: updateCategoryDto.slug },
      });
      if (existingCategory) {
        throw new BadRequestException('分类标识已存在');
      }
    }

    // 如果更新了父分类，检查是否会造成循环引用
    if (updateCategoryDto.parent_id) {
      if (updateCategoryDto.parent_id === id) {
        throw new BadRequestException('不能将自己设置为父分类');
      }
      // 检查是否会造成循环引用
      const isCircular = await this.checkCircularReference(id, updateCategoryDto.parent_id);
      if (isCircular) {
        throw new BadRequestException('不能将子分类设置为父分类');
      }
    }

    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  // 检查循环引用
  private async checkCircularReference(categoryId: number, parentId: number): Promise<boolean> {
    let currentId = parentId;
    while (currentId) {
      if (currentId === categoryId) {
        return true;
      }
      const parent = await this.categoryRepository.findOne({
        where: { id: currentId },
      });
      currentId = parent?.parent_id;
    }
    return false;
  }

  // 删除分类
  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);

    // 检查是否有子分类
    if (category.children && category.children.length > 0) {
      throw new BadRequestException('该分类下有子分类，无法删除');
    }

    // 检查是否有文章使用该分类
    const articleCount = await this.articleRepository.count({
      where: { category_id: id, deleted_at: IsNull() },
    });
    if (articleCount > 0) {
      throw new BadRequestException(`该分类下有 ${articleCount} 篇文章，请先移除文章关联后再删除`);
    }

    await this.categoryRepository.remove(category);
  }

  // 更新排序
  async updateSort(sortData: { id: number; sort_order: number }[]): Promise<void> {
    for (const item of sortData) {
      await this.categoryRepository.update(item.id, { sort_order: item.sort_order });
    }
  }
}
