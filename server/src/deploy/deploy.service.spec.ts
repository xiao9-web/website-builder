import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeployService } from './deploy.service';
import { DeployVersion, DeployStatus } from './deploy.entity';
import { PageService } from '../page/page.service';
import { SiteConfigService } from '../site-config/site-config.service';
import { MenuService } from '../menu/menu.service';
import { ArticleService } from '../article/article.service';

jest.mock('fs-extra');
jest.mock('ali-oss');

const mockDeployVersions = [
  {
    id: 1,
    version: 'v1.0.0',
    description: '初始版本',
    status: DeployStatus.SUCCESS,
    preview_url: 'https://oss.example.com/v1.0.0',
    is_active: true,
    snapshot_data: JSON.stringify({ pages: [], menus: [] }),
    deploy_log: '部署成功',
    created_by: 1,
    created_at: new Date('2024-01-01'),
  },
  {
    id: 2,
    version: 'v1.1.0',
    description: '更新版本',
    status: DeployStatus.PENDING,
    preview_url: null,
    is_active: false,
    snapshot_data: null,
    deploy_log: null,
    created_by: 1,
    created_at: new Date('2024-01-02'),
  },
];

describe('DeployService', () => {
  let service: DeployService;
  let repository: Repository<DeployVersion>;

  const mockQueryBuilder = {
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([mockDeployVersions, mockDeployVersions.length]),
  };

  const mockRepository = {
    create: jest.fn().mockImplementation((dto) => ({ ...dto, id: Date.now() })),
    save: jest.fn().mockImplementation((version) => Promise.resolve(version)),
    findOne: jest.fn().mockImplementation(({ where }) => {
      if (where.id) {
        return Promise.resolve(mockDeployVersions.find(v => v.id === where.id));
      }
      if (where.is_active) {
        return Promise.resolve(mockDeployVersions.find(v => v.is_active));
      }
      return Promise.resolve(null);
    }),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    findAndCount: jest.fn().mockResolvedValue([mockDeployVersions, mockDeployVersions.length]),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockSiteConfigService = {
    findPublic: jest.fn().mockResolvedValue({}),
  };

  const mockMenuService = {
    findTree: jest.fn().mockResolvedValue([]),
  };

  const mockArticleService = {
    findAll: jest.fn().mockResolvedValue({ list: [], total: 0 }),
  };

  const mockPageService = {
    findAll: jest.fn().mockResolvedValue({ list: [], total: 0 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeployService,
        {
          provide: getRepositoryToken(DeployVersion),
          useValue: mockRepository,
        },
        {
          provide: SiteConfigService,
          useValue: mockSiteConfigService,
        },
        {
          provide: MenuService,
          useValue: mockMenuService,
        },
        {
          provide: ArticleService,
          useValue: mockArticleService,
        },
        {
          provide: PageService,
          useValue: mockPageService,
        },
      ],
    }).compile();

    service = module.get<DeployService>(DeployService);
    repository = module.get<Repository<DeployVersion>>(getRepositoryToken(DeployVersion));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deploy', () => {
    it('should create deployment version and complete successfully', async () => {
      // Mock environment variables
      process.env.ALIYUN_OSS_ACCESS_KEY_ID = 'test-key';
      process.env.ALIYUN_OSS_ACCESS_KEY_SECRET = 'test-secret';
      process.env.ALIYUN_OSS_REGION = 'oss-cn-hangzhou';
      process.env.ALIYUN_OSS_BUCKET = 'test-bucket';

      // Mock fs operations
      jest.spyOn(require('fs-extra'), 'ensureDir').mockResolvedValue(undefined);
      jest.spyOn(require('fs-extra'), 'writeJson').mockResolvedValue(undefined);
      jest.spyOn(require('fs-extra'), 'pathExists').mockResolvedValue(false);
      jest.spyOn(require('fs-extra'), 'writeFile').mockResolvedValue(undefined);
      jest.spyOn(require('fs-extra'), 'readdir').mockResolvedValue([]);
      jest.spyOn(require('fs-extra'), 'remove').mockResolvedValue(undefined);

      const result = await service.deploy(1, '测试部署');

      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.status).toBe(DeployStatus.SUCCESS);
      expect(result.preview_url).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return paginated deploy versions', async () => {
      const result = await service.findAll({ page: 1, pageSize: 10 });

      expect(result).toEqual({
        list: mockDeployVersions,
        total: mockDeployVersions.length,
      });
      expect(mockRepository.findAndCount).toHaveBeenCalled();
    });

    it('should apply pagination', async () => {
      await service.findAll({ page: 2, pageSize: 5 });

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        order: { created_at: 'DESC' },
        skip: 5,
        take: 5,
        relations: ['creator'],
        select: ['id', 'version', 'description', 'status', 'preview_url', 'duration', 'created_at', 'created_by'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a single deploy version', async () => {
      const result = await service.findOne(1);

      expect(result).toEqual(mockDeployVersions[0]);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['creator']
      });
    });
  });

  describe('getActiveSnapshot', () => {
    it('should return the active version snapshot', async () => {
      const result = await service.getActiveSnapshot();

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { is_active: true },
        order: { created_at: 'DESC' }
      });
      expect(result).toBeDefined();
    });
  });

  describe('publishSnapshot', () => {
    it('should create and publish a snapshot', async () => {
      const result = await service.publishSnapshot(1, '快照发布');

      expect(mockSiteConfigService.findPublic).toHaveBeenCalled();
      expect(mockMenuService.findTree).toHaveBeenCalled();
      expect(mockArticleService.findAll).toHaveBeenCalled();
      expect(mockPageService.findAll).toHaveBeenCalled();
      expect(mockRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('rollback', () => {
    it('should throw error if target version not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.rollback(999, 1)).rejects.toThrow('目标版本不存在');
    });

    it('should throw error if target version is not successful', async () => {
      const failedVersion = { ...mockDeployVersions[1], status: DeployStatus.FAILED };
      mockRepository.findOne.mockResolvedValueOnce(failedVersion);

      await expect(service.rollback(2, 1)).rejects.toThrow('只能回滚到成功的版本');
    });

    it('should throw error if no snapshot data', async () => {
      const noSnapshotVersion = { ...mockDeployVersions[0], snapshot_data: null, is_active: false };
      mockRepository.findOne.mockResolvedValueOnce(noSnapshotVersion);

      await expect(service.rollback(1, 1)).rejects.toThrow('该版本没有快照数据，无法回滚');
    });
  });

});
