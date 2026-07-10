import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Review } from '../Reviews/reviews.entity';
import { CURRENT_TIMESTAMP } from '../utils/constants';
import { ProductEntity } from '../products/product.entity';

export enum roles {
  ADMIN = 'admin',
  CUSTOMER = 'user',
  TRADER = 'trader',
}

@Entity({ name: 'Users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  age: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  name: string;

  @Column()
  email: string;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: roles, default: roles.CUSTOMER })
  userType: roles;

  @Column({ default: false })
  isAccountVerified: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
  })
  updatedAt: Date;

  @OneToMany(() => Review, (review) => review.user)
  review: Review[];

  @OneToMany(() => ProductEntity, (product) => product.user)
  product: ProductEntity[];
}
