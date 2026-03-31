import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuService } from './menu.service';
import { Menu } from './menu.entity';

// 模拟数据
const mockMenus = [
  {
    id: 1,
    name: '首页',
    path: '/',
    parent_id: null,
    sort: 0,
    is_visible: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    name: '关于',
    path: '/about',
    parent_id: null,
    sort: 1,
    is_visible: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    name: '子菜单',
    parent_id: 1,
    sort: 0,
    is_visible: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

// 模拟 repository
const mockMenuRepository = {
  find: jest.fn().mockImplementation((options?: any) => {
    const parentId = options?.where?.parent_id;
    if (parentId !== undefined) {
      return Promise.resolve(mockMenus.filter(m => (m as any).parent_id === parentId));
    }
    return Promise.resolve(mockMenus);
  }),
  findOne: jest.fn().mockResolvedValue(mockMenus[0]),
  create: jest.fn().mockImplementation((dto) => dto),
  save: jest.fn().mockImplementation((menu) => Promise.resolve({ id: Date.now(), ...menu })),
  update: jest.fn().mockResolvedValue(true),
  delete: jest.fn().mockResolvedValue(true),
};

describe('MenuService', () => {
  let service: MenuService;
  let repository: Repository<Menu>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        {
          provide: getRepositoryToken(Menu),
          useValue: mockMenuRepository,
        },
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);
    repository = module.get<Repository<Menu>>(getRepositoryToken(Menu));

    // 清空调用次数，但保留 mock 实现
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of menus', async () => {
      const menus = await service.findAll();
      expect(menus).toEqual(mockMenus);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findTree', () => {
    it('should return menu tree structure', async () => {
      const tree = await service.findTree();
      expect(Array.isArray(tree)).toBe(true);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findPublished', () => {
    it('should return visible menus', async () => {
      const menus = await service.findPublished();
      // findPublished 会构建树形结构，所以顶层只包含 parent_id = null 的菜单
      expect(menus).toEqual([mockMenus[0], mockMenus[1]]);
    });
  });

  describe('findOne', () => {
    it('should return a single menu', async () => {
      const menu = await service.findOne(1);
      expect(menu).toEqual(mockMenus[0]);
      expect(repository.findOne).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new menu', async () => {
      const newMenu = {
        name: '新菜单',
        path: '/new',
        sort: 2,
        is_visible: true,
      };

      const createdMenu = await service.create(newMenu);
      expect(createdMenu.name).toEqual(newMenu.name);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a menu', async () => {
      const result = await service.update(1, { name: '更新后的菜单' });
      expect(result).toEqual(mockMenus[0]);
      expect(repository.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a menu', async () => {
      await service.remove(1);
      expect(repository.delete).toHaveBeenCalled();
    });
  });

  describe('updateSort', () => {
    it('should update menu sort order', async () => {
      await service.updateSort([1, 2, 3]);
      expect(repository.update).toHaveBeenCalledTimes(3);
    });
  });
});
