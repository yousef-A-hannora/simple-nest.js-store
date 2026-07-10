import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './DTOs/create-user-dto';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDTO } from './DTOs/update-user-dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async getAll() {
    return await this.userRepository.find({
      relations: { product: true, review: true },
    });
  }

  public async getOneBy(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  public async create(dto: CreateUserDto): Promise<User> {
    const excist = await this.userRepository.findOneBy({ email: dto.email });
    if (excist) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    const user = this.userRepository.create(dto);
    return this.userRepository.save(user);
  }

  public async update(dto: UpdateUserDTO, id: number): Promise<User> {
    const updatedUser = await this.userRepository.preload({ id, ...dto });
    if (!updatedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return this.userRepository.save(updatedUser);
  }

  public async delete(id: number): Promise<User> {
    const updatedUser = await this.userRepository.preload({
      id,
      isDeleted: true,
    });
    if (!updatedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return this.userRepository.save(updatedUser);
  }
}
