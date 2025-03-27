import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async createUser(email: string, name: string, password?: string): Promise<User> {
    const user = this.userRepo.create({ email, name, password });
    return this.userRepo.save(user);
  }

  async getUsers(): Promise<User[]> {
    return this.userRepo.find({ relations: ['posts'] });
  }

  async getUserById(id: string): Promise<User> {
    return this.userRepo.findOne({ where: { id }, relations: ['posts'] });
  }
}