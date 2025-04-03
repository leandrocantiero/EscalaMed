import { UsuarioDto } from 'src/modules/usuarios/dtos/usuario.dto';
import { Usuario } from 'src/modules/usuarios/entities/usuario.entity';
import { UsuarioController } from 'src/modules/usuarios/usuario.controller';
import { UsuarioService } from 'src/modules/usuarios/usuario.service';
import { createTestingModule } from 'test/module/testing-module.factory';

const mockUserDto = {
  id: 1,
  nome: 'Test User',
  email: 'test@example.com',
  senha: 'hashedpassword',
} as UsuarioDto;

const mockUser = {
  id: 1,
  nome: 'Test User',
  cpf: '000.000.000-00',
  telefone: '+551899123456789',
  foto: '',
  email: 'test@example.com',
  senha: 'hashedpassword',
  createdAt: new Date(),
  updatedAt: new Date(),
  isAtivo: true,
  empresaId: 0,
} as Usuario;

describe('UsersController', () => {
  let usuarioController: UsuarioController;
  let usuarioService: UsuarioService;

  beforeEach(async () => {
    const module = await createTestingModule({
      controllers: [UsuarioController],
      providers: [UsuarioService],
      repositoryMocks: [
        {
          entity: Usuario,
          mock: {
            findOne: jest.fn().mockResolvedValue(mockUser),
            save: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    });

    usuarioController = module.get<UsuarioController>(UsuarioController);
    usuarioService = module.get<UsuarioService>(UsuarioService);
  });

  describe('criar', () => {
    it('should create a new user', async () => {
      jest.spyOn(usuarioService, 'criar').mockResolvedValue(mockUser);

      const result = await usuarioController.criar(mockUserDto);

      expect(result).toEqual(mockUser);
    });
  });

  describe('editar', () => {
    it('should update a user', async () => {
      const updatedUser = { ...mockUser, ...mockUserDto };

      jest.spyOn(usuarioService, 'editar').mockResolvedValue(updatedUser);

      const result = await usuarioController.editar(mockUser.id, mockUserDto);

      expect(result).toEqual(updatedUser);
    });
  });

  describe('uploadPhoto', () => {
    it('should upload a user photo', async () => {
      const mockFile = {
        originalname: 'photo.jpg',
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      const updatedUser = { ...mockUser, photo: 'photo.jpg' };

      jest.spyOn(usuarioService, 'salvarFoto').mockResolvedValue(updatedUser);

      const result = await usuarioController.uploadFoto(mockUser.id, mockFile);

      expect(result).toEqual(updatedUser);
    });
  });

  describe('obterPorId', () => {
    it('should return a user by id', async () => {
      jest.spyOn(usuarioService, 'obterPorId').mockResolvedValue(mockUser);

      const result = await usuarioController.obterPorId(mockUser.id);

      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(usuarioService, 'obterPorId').mockResolvedValue(null);

      await expect(usuarioController.obterPorId(999)).rejects.toThrow();
    });
  });

  describe('remover', () => {
    it('should delete a user', async () => {
      jest.spyOn(usuarioService, 'remover').mockResolvedValue(undefined);

      await usuarioController.remover(mockUser.id);
    });
  });
});
