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
import { auth } from '../auth/auth.entity';

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
  birthDate: Date;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  provider: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ select: false, nullable: true })
  password: string;

  @Column({ select: false, nullable: true })
  oauthId: string;

  @Column({ type: 'enum', enum: roles, default: roles.CUSTOMER })
  userType: roles;

  @Column({ default: false })
  isAccountVerified: boolean;

  @Column({ type: 'boolean', default: false })
  profileCompleted: boolean;

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

  @OneToMany(() => ProductEntity, (product) => product.creator)
  product: ProductEntity[];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @OneToMany(() => auth, (auth) => auth.user)
  auth: auth[];
}
