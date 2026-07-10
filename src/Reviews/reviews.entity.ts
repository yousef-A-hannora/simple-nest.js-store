import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ProductEntity } from '../products/product.entity';
import { User } from '../Users/user.entity';

import { CURRENT_TIMESTAMP } from '../utils/constants';

@Entity({ name: 'Reviews' })
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  rating: number;

  @Column({ type: 'varchar', length: 150 })
  comment: string;

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

  @ManyToOne(() => ProductEntity, (product) => product.review)
  product: ProductEntity;

  @ManyToOne(() => User, (user) => user.review)
  user: User;
}
