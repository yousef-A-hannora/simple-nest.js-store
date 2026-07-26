/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './DTOs/create-user-dto';
import { User } from './user.entity';
import { DeepPartial, Repository } from 'typeorm';
import { UpdateUserDTO } from './DTOs/update-user-dto';
import { hashPassword } from '../utils/passwordHash';
import { roles } from './user.entity';
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

  public async getOneBy(
    value: string | number,
    passwordIncluded: boolean,
  ): Promise<User> {
    const where = typeof value === 'number' ? { id: value } : { email: value };

    const user = await this.userRepository.findOne({
      where,
      select: passwordIncluded
        ? [
            'id',
            'email',
            'password',
            'isAccountVerified',
            'userType',
            'isDeleted',
            'birthDate',
            'phone',
            'provider',
            'oauthId',
            'profileCompleted',
            'product',
            'review',
          ]
        : [
            'id',
            'email',
            'isAccountVerified',
            'userType',
            'isDeleted',
            'birthDate',
            'phone',
            'provider',
            'oauthId',
            'profileCompleted',
            'product',
            'review',
          ],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  public async create(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await hashPassword(dto.password);
    dto.password = hashedPassword;
    const user = this.userRepository.create({
      userType: roles.CUSTOMER,
      isAccountVerified: true,
      profileCompleted: true,
      ...dto,
    });
    try {
      return await this.userRepository.save(user);
    } catch (err: any) {
      if (err.code && err.code === '23505') {
        // Postgres unique_violation
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }
      throw err;
    }
  }

  public async updatePassword(id: number, newPassword: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    return this.userRepository.save(user);
  }

  public async update(dto: UpdateUserDTO, id: number): Promise<User> {
    if (dto.password) {
      throw new HttpException(
        'Password and userType cannot be updated',
        HttpStatus.BAD_REQUEST,
      );
    }
    const updatedUser = await this.userRepository.preload({ id, ...dto });
    if (!updatedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return this.userRepository.save(updatedUser);
  }

  public async updateInternal(
    info: DeepPartial<User>,
    id: number,
  ): Promise<void> {
    const updatedUser = await this.userRepository.update(id, { ...info });
    if (!updatedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  public async createInternal(
    data: Omit<User, 'updatedAt' | 'createdAt' | 'id' | 'isDeleted'>,
  ): Promise<User> {
    const excist = await this.userRepository.findOneBy({ email: data.email });
    if (excist) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    const hashedPassword = await hashPassword(data.password);
    data.password = hashedPassword;
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  public async findByOAuthId(oauthId: string): Promise<User | null> {
    return this.userRepository.findOneBy({ oauthId });
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  public async createOAuthUser(data: {
    name: string;
    email: string;
    oauthId: string;
    provider: string;
  }): Promise<User> {
    const user = this.userRepository.create({
      name: data.name,
      email: data.email,
      oauthId: data.oauthId,
      provider: data.provider,
      isAccountVerified: true,
      profileCompleted: false,
      userType: roles.CUSTOMER,
    });
    try {
      return await this.userRepository.save(user);
    } catch (err: any) {
      if (err.code && err.code === '23505') {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }
      throw err;
    }
  }

  public async completeProfile(
    id: number,
    birthDate: Date,
    phone: string,
  ): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    user.birthDate = birthDate;
    user.phone = phone;
    user.profileCompleted = true;
    return this.userRepository.save(user);
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
