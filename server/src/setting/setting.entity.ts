import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('settings')
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  key: string;

  @Column({ type: 'text', nullable: true })
  value: string;

  @Column({ length: 200, nullable: true })
  description: string;

  @Column({ length: 50, default: 'string' })
  type: string; // string, number, boolean, json

  @Column({ length: 50, default: 'basic' })
  group: string; // basic, theme, seo, comment

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
