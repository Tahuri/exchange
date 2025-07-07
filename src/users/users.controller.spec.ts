import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    accountNumber: '10001',
  };

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [mockUser];
      mockUsersService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(result).toEqual(users);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockUsersService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow('Service error');
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockUsersService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(1)).rejects.toThrow('Service error');
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        email: 'new@example.com',
        accountNumber: '10002',
      };
      const createdUser = { id: 2, ...createUserDto };
      mockUsersService.create.mockResolvedValue(createdUser);

      const result = await controller.create(createUserDto);

      expect(result).toEqual(createdUser);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should handle service errors during creation', async () => {
      const createUserDto = {
        email: 'new@example.com',
        accountNumber: '10002',
      };
      const error = new Error('Service error');
      mockUsersService.create.mockRejectedValue(error);

      await expect(controller.create(createUserDto)).rejects.toThrow('Service error');
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const updateUserDto = {
        email: 'updated@example.com',
        accountNumber: '10001',
      };
      const updatedUser = { id: 1, ...updateUserDto };
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(1, updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(service.update).toHaveBeenCalledWith(1, updateUserDto);
    });

    it('should handle service errors during update', async () => {
      const updateUserDto = {
        email: 'updated@example.com',
        accountNumber: '10001',
      };
      const error = new Error('Service error');
      mockUsersService.update.mockRejectedValue(error);

      await expect(controller.update(1, updateUserDto)).rejects.toThrow('Service error');
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockUsersService.remove.mockResolvedValue(true);

      const result = await controller.remove(1);

      expect(result).toBe(true);
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should handle service errors during removal', async () => {
      const error = new Error('Service error');
      mockUsersService.remove.mockRejectedValue(error);

      await expect(controller.remove(1)).rejects.toThrow('Service error');
    });
  });
}); 