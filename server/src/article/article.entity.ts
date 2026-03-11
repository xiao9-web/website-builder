import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

export enum ArticleStatus {
  DRAFT = '0',
  PUBLISHED = '1',
  ARCHIVED = '2',
}

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ unique: true, length: 255 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ length: 500, nullable: true })
  summary: string;

  @Column({ length: 255, nullable: true })
  cover_image: string;

  @Column({ nullable: true })
  category_id: number;

  @Column({ length: 255, nullable: true })
  tags: string; // 逗号分隔的标签

  @Column({ length: 255, nullable: true })
  seo_title: string;

  @Column({ type: 'text', nullable: true })
  seo_description: string;

  @Column({ length: 255, nullable: true })
  seo_keywords: string;

  @Column({
    type: 'enum',
    enum: ArticleStatus,
    default: ArticleStatus.DRAFT,
  })
  status: ArticleStatus;

  @Column({ default: 0 })
  view_count: number;

  @Column({ default: true })
  is_public: boolean;

  @Column({ nullable: true })
  published_at: Date;

  @Column()
  author_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
