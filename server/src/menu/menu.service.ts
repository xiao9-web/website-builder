import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Menu } from './menu.entity';
import { Article, ArticleStatus } from '../article/article.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    const menu = this.menuRepository.create(createMenuDto);
    return this.menuRepository.save(menu);
  }

  async findAll(): Promise<Menu[]> {
    return this.menuRepository.find({
      order: { sort: 'ASC', id: 'ASC' },
      relations: ['category', 'article'],
    });
  }

  // 构建树形菜单
  async findTree(): Promise<Menu[]> {
    const menus = await this.findAll();
    return this.buildTree(menus, null);
  }

  // 获取已发布的菜单（用于前端官网）
  async findPublished(): Promise<Menu[]> {
    const menus = await this.menuRepository.find({
      where: { is_visible: true },
      order: { sort: 'ASC', id: 'ASC' },
      relations: ['category', 'article'],
    });
    return this.buildTree(menus, null);
  }

  private buildTree(menus: Menu[], parentId: number | null): Menu[] {
    const tree: Menu[] = [];

    for (const menu of menus) {
      if (menu.parent_id === parentId) {
        const children = this.buildTree(menus, menu.id);
        if (children.length > 0) {
          menu.children = children;
        }
        tree.push(menu);
      }
    }

    return tree;
  }

  async findOne(id: number): Promise<Menu | undefined> {
    return this.menuRepository.findOne({
      where: { id },
      relations: ['category', 'article']
    });
  }

  async update(id: number, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    await this.menuRepository.update(id, updateMenuDto);
    return this.findOne(id);
  }

  // 批量更新排序
  async updateSort(ids: number[]): Promise<void> {
    for (let i = 0; i < ids.length; i++) {
      await this.menuRepository.update(ids[i], { sort: i });
    }
  }

  async remove(id: number): Promise<void> {
    // 先删除子菜单
    const children = await this.menuRepository.find({ where: { parent_id: id } });
    for (const child of children) {
      await this.remove(child.id);
    }
    await this.menuRepository.delete(id);
  }

  async getMenuArticles(menuId: number): Promise<{ menuName: string; articles: Article[] }> {
    const menu = await this.findOne(menuId);
    if (!menu) {
      return { menuName: '未知菜单', articles: [] };
    }

    const articles = await this.articleRepository
      .createQueryBuilder('article')
      .innerJoin('article_menu', 'am', 'am.article_id = article.id')
      .leftJoinAndSelect('article.author', 'author')
      .where('am.menu_id = :menuId', { menuId })
      .andWhere('article.status = :status', { status: ArticleStatus.PUBLISHED })
      .andWhere('article.deleted_at IS NULL')
      .orderBy('article.published_at', 'DESC')
      .getMany();

    return { menuName: menu.name, articles };
  }
}
