import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'varchar', length: 20 })
  nickname: string;

  @Column({ type: 'varchar', length: 40, unique: true })
  email: string;

  @CreateDateColumn({ type: 'timestamp', precision: 6 })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 6 })
  updatedDate: Date;

  @Column({ type: 'int', nullable: true })
  perfumeId: number | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  refresh_token: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  oauth_id: string | null;
}
