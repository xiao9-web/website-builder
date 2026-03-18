import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  original_name: string;

  @Column()
  path: string;

  @Column()
  url: string;

  @Column()
  mime_type: string;

  @Column()
  size: number;

  @Column({ default: 0 })
  created_by: number;

  @CreateDateColumn()
  created_at: Date;
}
