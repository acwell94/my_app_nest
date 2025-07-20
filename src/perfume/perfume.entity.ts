import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('perfume')
export class PerfumeEntity {
  @PrimaryGeneratedColumn()
  perfumeId: number;

  @Column({ length: 20 })
  name: string;

  @Column({ length: 20 })
  brand: string;

  @Column({ length: 20 })
  gender: string;

  @Column({ length: 20 })
  category: string;

  @Column({ length: 100 })
  mood: string;

  @Column({ length: 100 })
  topNote: string;

  @Column({ length: 100 })
  middleNote: string;

  @Column({ length: 100 })
  baseNote: string;

  @Column({ length: 20 })
  countryOfOrigin: string;

  @Column({ length: 255 })
  description: string;

  @Column('text')
  image: string; // 여러 URL을 쉼표로 구분하거나 JSON으로 저장

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  createdDate: Date;

  @UpdateDateColumn({ type: 'datetime', precision: 6 })
  updatedDate: Date;
}
