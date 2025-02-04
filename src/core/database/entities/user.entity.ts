import { Exclude } from 'class-transformer';
import { UserRole } from 'src/common/types/roles.enum';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'Users' })
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  FullName: string;

  @Index()
  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  Email: string;

  @Exclude() // Exclude password from API responses
  @Column({ type: 'varchar', length: 255, nullable: false })
  Password: string;

  @Column({
    type: 'varchar',
    enum: UserRole,
    default: UserRole.USER,
  })
  UserRole: UserRole;
}
