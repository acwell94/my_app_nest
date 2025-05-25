import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('admin')
export class Admin {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  email: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedDate: Date;

  @Column({ type: 'varchar', length: 200, nullable: true })
  refresh_token: string | null;

  @Column({ type: 'tinyint', default: 0, nullable: true })
  level: number | null;

  @Column({ type: 'tinyint', default: 0, nullable: true })
  approve: number | null;
}
