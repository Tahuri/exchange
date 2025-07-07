import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: any;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    accountNumber: '10001',
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [mockUser];
      repository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      repository.findOne.mockResolvedValue(mockUser);
      const result = await service.findOne(1);
      expect(result).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException when user not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        email: 'new@example.com',
        accountNumber: '10002',
      };
      const createdUser = { id: 2, ...createUserDto };
      repository.create.mockReturnValue(createUserDto);
      repository.save.mockResolvedValue(createdUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(createdUser);
      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(createUserDto);
    });

    it('should handle repository errors during creation', async () => {
      const createUserDto = {
        email: 'new@example.com',
        accountNumber: '10002',
      };
      const error = new Error('Database error');
      repository.create.mockReturnValue(createUserDto);
      repository.save.mockRejectedValue(error);

      await expect(service.create(createUserDto)).rejects.toThrow('Database error');
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const updateUserDto = {
        email: 'updated@example.com',
        accountNumber: '10001',
      };
      const existingUser = { ...mockUser };
      const updatedUser = { ...mockUser, ...updateUserDto };
      
      repository.findOne.mockResolvedValue(existingUser);
      repository.save.mockResolvedValue(updatedUser);

      const result = await service.update(1, updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('should throw NotFoundException when user not found for update', async () => {
      const updateUserDto = {
        email: 'updated@example.com',
        accountNumber: '10001',
      };
      repository.findOne.mockResolvedValue(null);
      await expect(service.update(999, updateUserDto)).rejects.toThrow(NotFoundException);
    });

    it('should handle repository errors during update', async () => {
      const updateUserDto = {
        email: 'updated@example.com',
        accountNumber: '10001',
      };
      const existingUser = { ...mockUser };
      const error = new Error('Database error');
      repository.findOne.mockResolvedValue(existingUser);
      repository.save.mockRejectedValue(error);

      await expect(service.update(1, updateUserDto)).rejects.toThrow('Database error');
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      repository.findOne.mockResolvedValue(mockUser);
      repository.remove.mockResolvedValue(mockUser);
      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(repository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException when user not found for removal', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });

    it('should handle repository errors during removal', async () => {
      repository.findOne.mockResolvedValue(mockUser);
      const error = new Error('Database error');
      repository.remove.mockRejectedValue(error);
      await expect(service.remove(1)).rejects.toThrow('Database error');
    });
  });
}); 