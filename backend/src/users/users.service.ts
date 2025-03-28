import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserDto } from './DTO/user.dto';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from './DTO/createUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);
      const user = this.userRepo.create({ email: createUserDto.email, name: createUserDto.name, password: hashedPassword });
      const savedUser = await this.userRepo.save(user);
      return plainToInstance(UserDto, savedUser);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`User with email ${createUserDto.email} already exists`);
      }
      throw new InternalServerErrorException('Something went wrong'); 
    }
  }

  async getUsers(): Promise<User[]> {
    return this.userRepo.find({ relations: ['posts'] });
  }

  async getUserById(id: string): Promise<UserDto> {
    const user = this.userRepo.findOne({ where: { id }, relations: ['posts'] });
    return plainToInstance(UserDto, user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user || !user.password) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  }
  
}