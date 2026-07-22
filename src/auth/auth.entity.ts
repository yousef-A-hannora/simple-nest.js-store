import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';
import { CURRENT_TIMESTAMP } from '../utils/constants';
import { User } from '../Users/user.entity';

@Entity()
export class auth {
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  refreshToken: string;

  @Column({
    primary: true,
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  tokenId: string;

  @Column({ type: 'timestamp', nullable: false })
  expiresAt: Date;

  @Column({ type: 'boolean', default: false })
  revoked: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.auth)
  user: User;
}
