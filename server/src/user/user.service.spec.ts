import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';

// 模拟数据
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    nickname: '管理员',
    role: UserRole.ADMIN,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    username: 'testuser',
    email: 'test@example.com',
    nickname: '测试用户',
    role: UserRole.EDITOR,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

// 模拟 repository
const mockUserRepository = {
  find: jest.fn().mockResolvedValue(mockUsers),
  findOne: jest.fn().mockImplementation((id) => {
    return Promise.resolve(mockUsers.find(user => user.id === (typeof id === 'number' ? id : id.where.id)))
  }),
  create: jest.fn().mockImplementation((dto) => dto),
  save: jest.fn().mockImplementation((user) => Promise.resolve({ id: user.id || Date.now(), ...user })),
  update: jest.fn().mockImplementation((id, updateData) => {
    const index = mockUsers.findIndex(user => user.id === id)
    if (index !== -1) {
      Object.assign(mockUsers[index], updateData)
    }
    return Promise.resolve(true)
  }),
  delete: jest.fn().mockResolvedValue(true),
};

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = await service.findAll();
      expect(users).toEqual(mockUsers);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const user = await service.findOne(1);
      expect(user).toEqual(mockUsers[0]);
      expect(repository.findOne).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const newUser = {
        username: 'newuser',
        password: 'password123',
        email: 'newuser@example.com',
        nickname: '新用户',
        role: UserRole.EDITOR,
        is_active: true,
      };

      await service.create(newUser);
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      await service.update(1, { nickname: 'Updated Admin' });
      expect(repository.update).toHaveBeenCalledWith(1, { nickname: 'Updated Admin' });
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      await service.remove(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
