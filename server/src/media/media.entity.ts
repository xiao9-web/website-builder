import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  FILE = 'file',
}

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  filename: string;

  @Column({ length: 200 })
  original_name: string;

  @Column({ length: 500 })
  url: string;

  @Column({
    type: 'enum',
    enum: MediaType,
    default: MediaType.IMAGE,
  })
  type: MediaType;

  @Column({ length: 50, nullable: true })
  mime_type: string;

  @Column({ type: 'int', default: 0 })
  size: number; // 文件大小，单位：字节

  @Column({ type: 'int', nullable: true })
  width: number; // 图片宽度

  @Column({ type: 'int', nullable: true })
  height: number; // 图片高度

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;
}
