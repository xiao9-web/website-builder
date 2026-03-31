import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ArticleService } from './article.service';
import { Article, ArticleStatus } from './article.entity';
import { ArticleVersionService } from './article-version.service';
import { ArticleMenu } from './article-menu.entity';

// 模拟数据
const mockArticles = [
  {
    id: 1,
    title: '测试文章1',
    slug: 'test-article-1',
    content: '文章内容1',
    summary: '摘要1',
    status: ArticleStatus.PUBLISHED,
    author_id: 1,
    view_count: 100,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    title: '测试文章2',
    slug: 'test-article-2',
    content: '文章内容2',
    summary: '摘要2',
    status: ArticleStatus.DRAFT,
    author_id: 1,
    view_count: 50,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

// 模拟 QueryBuilder
const mockQueryBuilder = {
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockResolvedValue([mockArticles, 2]),
  getOne: jest.fn().mockResolvedValue(mockArticles[0]),
  createQueryBuilder: jest.fn().mockReturnThis(),
} as any;

// 模拟 repository
const mockArticleRepository = {
  find: jest.fn().mockResolvedValue(mockArticles),
  findOne: jest.fn().mockResolvedValue(mockArticles[0]),
  create: jest.fn().mockImplementation((dto) => dto),
  save: jest.fn().mockImplementation((article) => Promise.resolve({ id: Date.now(), ...article })),
  update: jest.fn().mockResolvedValue(true),
  increment: jest.fn().mockResolvedValue(true),
  createQueryBuilder: jest.fn(() => mockQueryBuilder),
};

// 模拟 ArticleVersionService
const mockArticleVersionService = {
  createVersion: jest.fn().mockResolvedValue(true),
};

describe('ArticleService', () => {
  let service: ArticleService;
  let repository: Repository<Article>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: getRepositoryToken(Article),
          useValue: mockArticleRepository,
        },
        {
          provide: getRepositoryToken(ArticleMenu),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
            delete: jest.fn().mockResolvedValue(true),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: ArticleVersionService,
          useValue: mockArticleVersionService,
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    repository = module.get<Repository<Article>>(getRepositoryToken(Article));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated articles', async () => {
      const result = await service.findAll({ page: 1, pageSize: 10 });
      expect(result).toEqual({ list: mockArticles, total: 2 });
    });
  });

  describe('findOne', () => {
    it('should return a single article', async () => {
      const article = await service.findOne(1);
      expect(article).toEqual(mockArticles[0]);
      expect(repository.findOne).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new article', async () => {
      const newArticle = {
        title: '新文章',
        slug: 'new-article',
        content: '新内容',
        summary: '新摘要',
        status: ArticleStatus.DRAFT,
      };

      const createdArticle = await service.create(newArticle, 1);
      expect(createdArticle.title).toEqual(newArticle.title);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update an article', async () => {
      const result = await service.update(1, { title: '更新后的标题' });
      expect(result).toEqual(mockArticles[0]);
    });
  });

  describe('remove', () => {
    it('should soft delete an article', async () => {
      await service.remove(1);
      expect(repository.update).toHaveBeenCalledWith(1, { deleted_at: expect.any(Date) });
    });
  });

  describe('incrementViewCount', () => {
    it('should increment view count', async () => {
      await service.incrementViewCount(1);
      expect(repository.increment).toHaveBeenCalledWith({ id: 1 }, 'view_count', 1);
    });
  });
});
