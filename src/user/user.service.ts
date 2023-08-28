import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

import { User } from './entities/user.entity';
import { PaginationDto } from 'src/common/pagination-common.dto';
import { AuthService } from 'src/auth/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;
    const userFoundByEmail: User = await this.userRepository.findOne({
      where: { email },
    });

    if (userFoundByEmail) {
      throw new ConflictException({
        message: 'Usuario con este email ya existe en base de datos',
      });
    }

    const passwordEncrypt = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      name,
      email,
      password: passwordEncrypt,
    });

    return await this.userRepository.save(user);
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUserPassword(
      loginUserDto.email,
      loginUserDto.password,
    );

    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    return this.authService.login(user);
  }

  async validateUserPassword(
    email: string,
    password: string,
  ): Promise<Boolean> {
    const user = await this.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      return true;
    }
    return null;
  }

  async findAll(paginationdto: PaginationDto): Promise<User[]> {
    const { limit = 10, offset = 0 } = paginationdto;

    return this.userRepository.find({
      skip: offset,
      take: limit,
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with ID ${email} not found`);
    }
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.preload({
      id,
      ...updateUserDto,
    });
  }

  remove(id: string) {
    return this.userRepository.preload({
      id,
      status: false,
    });
  }
}
