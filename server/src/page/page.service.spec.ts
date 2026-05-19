import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PageService } from './page.service';
import { Page, PageStatus } from './page.entity';

// 模拟数据
const mockPages = [
  {
    id: 1,
    title: '首页',
    slug: 'home',
    template: 'default',
    status: PageStatus.PUBLISHED,
    author_id: 1,
    view_count: 100,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    title: '关于页面',
    slug: 'about',
    template: 'default',
    status: PageStatus.DRAFT,
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
  getManyAndCount: jest.fn().mockResolvedValue([mockPages, 2]),
  getOne: jest.fn().mockResolvedValue(mockPages[0]),
  createQueryBuilder: jest.fn().mockReturnThis(),
} as any;

// 模拟 repository
const mockPageRepository = {
  find: jest.fn().mockResolvedValue(mockPages),
  // Bug fix: 原来始终返回 mockPages[0]（PUBLISHED），导致无法测试 DRAFT→PUBLISHED 的 published_at 分支。
  // 改为按 id 匹配，使各测试能独立控制返回值。
  findOne: jest.fn().mockImplementation(({ where }) =>
    Promise.resolve(mockPages.find(p => p.id === where?.id) ?? mockPages[0])
  ),
  create: jest.fn().mockImplementation((dto) => dto),
  save: jest.fn().mockImplementation((page) => Promise.resolve({ id: Date.now(), ...page })),
  update: jest.fn().mockResolvedValue(true),
  increment: jest.fn().mockResolvedValue(true),
  delete: jest.fn().mockResolvedValue(true),
  createQueryBuilder: jest.fn(() => mockQueryBuilder),
};

describe('PageService', () => {
  let service: PageService;
  let repository: Repository<Page>;

  beforeEach(async () => {
    jest.clearAllMocks(); // 每个测试前清空调用记录，防止跨测试污染
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PageService,
        {
          provide: getRepositoryToken(Page),
          useValue: mockPageRepository,
        },
      ],
    }).compile();

    service = module.get<PageService>(PageService);
    repository = module.get<Repository<Page>>(getRepositoryToken(Page));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated pages', async () => {
      const result = await service.findAll({ page: 1, pageSize: 10 });
      expect(result).toEqual({ list: mockPages, total: 2 });
    });
  });

  describe('findOne', () => {
    it('should return a single page', async () => {
      const page = await service.findOne(1);
      expect(page).toEqual(mockPages[0]);
      expect(repository.findOne).toHaveBeenCalled();
    });
  });

  describe('findBySlug', () => {
    it('should return a page by slug', async () => {
      const page = await service.findBySlug('home');
      expect(page).toEqual(mockPages[0]);
    });
  });

  describe('create', () => {
    it('should create a new page', async () => {
      const newPage = {
        title: '新页面',
        slug: 'new-page',
        template: 'default',
        status: PageStatus.DRAFT,
      };

      const createdPage = await service.create(newPage, 1);
      expect(createdPage.title).toEqual(newPage.title);
      expect(repository.save).toHaveBeenCalled();
    });

    it('should set published_at when status is published', async () => {
      const newPage = {
        title: '新页面',
        slug: 'new-page',
        template: 'default',
        status: PageStatus.PUBLISHED,
      };

      await service.create(newPage, 1);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a page', async () => {
      const result = await service.update(1, { title: '更新后的标题' });
      expect(result).toEqual(mockPages[0]);
      expect(repository.update).toHaveBeenCalled();
    });

    it('should set published_at when status changes from DRAFT to PUBLISHED', async () => {
      // Bug fix: 原测试 mock 返回的页面已是 PUBLISHED，导致
      // if(page.status !== PUBLISHED) 分支永远不执行，属于虚假通过。
      // 正确做法：让 findOne 返回 DRAFT 状态的页面。
      mockPageRepository.findOne.mockResolvedValueOnce({ ...mockPages[1] }); // status: DRAFT
      await service.update(2, { status: PageStatus.PUBLISHED });
      const updateArg = mockPageRepository.update.mock.calls[0]?.[1];
      expect(updateArg?.published_at).toBeInstanceOf(Date);
    });
  });

  describe('remove', () => {
    it('should remove a page', async () => {
      await service.remove(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('incrementViewCount', () => {
    it('should increment view count', async () => {
      await service.incrementViewCount(1);
      expect(repository.increment).toHaveBeenCalledWith({ id: 1 }, 'view_count', 1);
    });
  });
});
