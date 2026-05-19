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
  // Bug fix: 原来始终返回 mockArticles[0]，导致 create() 中 slug 唯一性 while 循环死循环。
  // 改为第一次返回 null（slug 可用），后续调用再按 id 匹配。
  findOne: jest.fn().mockImplementation(({ where }) => {
    if (where?.slug) return Promise.resolve(null); // slug 唯一性检查：可用
    return Promise.resolve(mockArticles.find(a => a.id === where?.id) ?? null);
  }),
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
    jest.clearAllMocks(); // 每个测试前清空调用记录，防止跨测试污染
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
    it('should update an article via save()', async () => {
      // Bug fix: ArticleService.update() 调用 repository.save()，而非 repository.update()。
      // 原测试只断言返回值，未验证 save() 被调用，属于虚假通过。
      const result = await service.update(1, { title: '更新后的标题' });
      expect(mockArticleRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ title: '更新后的标题' }),
      );
      expect(result).toBeDefined();
    });

    it('should set published_at when status changes from DRAFT to PUBLISHED', async () => {
      // 确保 mock 返回 DRAFT 状态的文章，触发 published_at 设置分支
      mockArticleRepository.findOne.mockResolvedValueOnce({
        ...mockArticles[1], // status: DRAFT
      });
      await service.update(2, { status: ArticleStatus.PUBLISHED });
      const savedArg = mockArticleRepository.save.mock.calls[0]?.[0];
      expect(savedArg?.published_at).toBeInstanceOf(Date);
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
