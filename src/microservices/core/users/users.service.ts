import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm/repository/Repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findOne({ username, email }: { username?: string; email?: string }) {
    return this.usersRepository.findOne({ where: [{ username }, { email }] });
  }

  async updateTgUserId(dbUserId: number, tgUserId) {
    return this.usersRepository.update(dbUserId, {
      telegram_user_id: tgUserId,
    });
  }

  async createNewUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }
}
