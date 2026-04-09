import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaService } from './media.service';
import { Media, MediaType } from './media.entity';
import * as fs from 'fs-extra';

jest.mock('fs-extra');

const mockMedia = [
  {
    id: 1,
    filename: 'image1.jpg',
    original_name: 'photo.jpg',
    url: '/uploads/media/image1.jpg',
    type: MediaType.IMAGE,
    mime_type: 'image/jpeg',
    size: 102400,
    width: 1920,
    height: 1080,
    description: '测试图片',
    created_at: new Date('2024-01-01'),
  },
  {
    id: 2,
    filename: 'video1.mp4',
    original_name: 'video.mp4',
    url: '/uploads/media/video1.mp4',
    type: MediaType.VIDEO,
    mime_type: 'video/mp4',
    size: 5242880,
    width: null,
    height: null,
    description: '测试视频',
    created_at: new Date('2024-01-02'),
  },
];

describe('MediaService', () => {
  let service: MediaService;
  let repository: Repository<Media>;

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([mockMedia, mockMedia.length]),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    getRawOne: jest.fn().mockResolvedValue({
      total: 2,
      images: 1,
      videos: 1,
      files: 0,
      totalSize: '5345280',
    }),
  };

  const mockRepository = {
    create: jest.fn().mockImplementation((dto) => ({ ...dto, id: Date.now() })),
    save: jest.fn().mockImplementation((media) => Promise.resolve(media)),
    findOne: jest.fn().mockImplementation(({ where }) => {
      return Promise.resolve(mockMedia.find(m => m.id === where.id));
    }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    count: jest.fn().mockImplementation((options) => {
      if (!options) return Promise.resolve(mockMedia.length);
      if (options.where?.type === MediaType.IMAGE) return Promise.resolve(1);
      if (options.where?.type === MediaType.VIDEO) return Promise.resolve(1);
      if (options.where?.type === MediaType.FILE) return Promise.resolve(0);
      return Promise.resolve(0);
    }),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        {
          provide: getRepositoryToken(Media),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MediaService>(MediaService);
    repository = module.get<Repository<Media>>(getRepositoryToken(Media));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new media record', async () => {
      const createDto = {
        filename: 'test.jpg',
        original_name: 'test.jpg',
        url: '/uploads/media/test.jpg',
        type: MediaType.IMAGE,
        mime_type: 'image/jpeg',
        size: 50000,
        width: 800,
        height: 600,
      };

      const result = await service.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
    });
  });

  describe('findAll', () => {
    it('should return paginated media list', async () => {
      const result = await service.findAll({ page: 1, pageSize: 10 });

      expect(result).toEqual({
        list: mockMedia,
        total: mockMedia.length,
      });
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('media');
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('media.created_at', 'DESC');
    });

    it('should filter by type', async () => {
      await service.findAll({ type: MediaType.IMAGE });

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'media.type = :type',
        { type: MediaType.IMAGE }
      );
    });

    it('should search by keyword', async () => {
      await service.findAll({ keyword: 'test' });

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('media');
      expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
    });

    it('should apply pagination', async () => {
      await service.findAll({ page: 3, pageSize: 20 });

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(40);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(20);
    });
  });

  describe('findOne', () => {
    it('should return a single media record', async () => {
      const result = await service.findOne(1);

      expect(result).toEqual(mockMedia[0]);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('remove', () => {
    it('should delete media record and file', async () => {
      jest.spyOn(fs, 'pathExists').mockResolvedValue(true as never);
      jest.spyOn(fs, 'unlink').mockResolvedValue(undefined as never);

      await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should handle missing file gracefully', async () => {
      jest.spyOn(fs, 'pathExists').mockResolvedValue(false as never);

      await service.remove(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('getStats', () => {
    it('should return media statistics', async () => {
      const result = await service.getStats();

      expect(result).toEqual({
        total: 2,
        images: 1,
        videos: 1,
        files: 0,
        totalSize: 5345280,
      });
      expect(mockRepository.count).toHaveBeenCalled();
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('media');
    });
  });
});
