import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async createPost(title: string, content: string, userId: string): Promise<Post> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const post = this.postRepo.create({ title, content, author: user });
    return this.postRepo.save(post);
  }

  async getPosts(): Promise<Post[]> {
    return this.postRepo.find({ relations: ['author'] });
  }

  async getPostById(id: string): Promise<Post> {
    return this.postRepo.findOne({ where: { id }, relations: ['author'] });
  }
}