import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities';
import { UserService } from '../user/user.service';

@Injectable()
export class InitService {
  private readonly userRepository: Repository<User>;

  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
  ) {
    this.userRepository = this.dataSource.getRepository(User);
  }

  async initDb(): Promise<void> {
    await this.createAdmin();
  }

  async createAdmin(): Promise<void> {
    const isAdminExists = await this.userRepository.findOneBy({
      type: 'ADMIN',
    });

    if (isAdminExists) return;

    const passwordDigest = await this.userService.hashUserPassword('admin');

    const admin = this.userRepository.create({
      name: 'admin',
      email: 'admin@gmail.com',
      passwordDigest,
      type: 'ADMIN',
    });

    await this.userRepository.save(admin);
  }
}
