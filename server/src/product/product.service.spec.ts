import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from './product.service';
import { Product, ProductStatus } from './product.entity';

const mockProducts = [
  {
    id: 1,
    name: '产品A',
    image: '/uploads/product-a.jpg',
    description: '产品A描述',
    detail: '产品A详情',
    price: '99.99',
    sort: 1,
    status: ProductStatus.PUBLISHED,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  },
  {
    id: 2,
    name: '产品B',
    image: '/uploads/product-b.jpg',
    description: '产品B描述',
    detail: '产品B详情',
    price: '199.99',
    sort: 2,
    status: ProductStatus.DRAFT,
    created_at: new Date('2024-01-02'),
    updated_at: new Date('2024-01-02'),
  },
];

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<Product>;

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([mockProducts, mockProducts.length]),
  };

  const mockRepository = {
    find: jest.fn().mockResolvedValue(mockProducts),
    findOne: jest.fn().mockImplementation(({ where }) => {
      return Promise.resolve(mockProducts.find(p => p.id === where.id));
    }),
    create: jest.fn().mockImplementation((dto) => ({ ...dto, id: Date.now() })),
    save: jest.fn().mockImplementation((product) => Promise.resolve(product)),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const result = await service.findAll({ page: 1, pageSize: 10 });

      expect(result).toEqual({
        list: mockProducts,
        total: mockProducts.length,
      });
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('product.sort', 'ASC');
      expect(mockQueryBuilder.addOrderBy).toHaveBeenCalledWith('product.created_at', 'DESC');
    });

    it('should filter by status', async () => {
      await service.findAll({ status: ProductStatus.PUBLISHED });

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'product.status = :status',
        { status: ProductStatus.PUBLISHED }
      );
    });

    it('should apply pagination', async () => {
      await service.findAll({ page: 2, pageSize: 5 });

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(5);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(5);
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const result = await service.findOne(1);

      expect(result).toEqual(mockProducts[0]);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null for non-existent product', async () => {
      const result = await service.findOne(999);

      expect(result).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createDto = {
        name: '新产品',
        image: '/uploads/new.jpg',
        description: '新产品描述',
        detail: '新产品详情',
        price: 299.99,
        sort: 3,
        status: ProductStatus.DRAFT,
      };

      const result = await service.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateDto = {
        name: '更新的产品',
        price: 149.99,
      };

      await service.update(1, updateDto);

      expect(mockRepository.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      await service.remove(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('updateSort', () => {
    it('should update product sort order', async () => {
      await service.updateSort(1, 5);

      expect(mockRepository.update).toHaveBeenCalledWith(1, { sort: 5 });
    });
  });
});
