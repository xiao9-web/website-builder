import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Menu } from '../menu/menu.entity';
import { ArticleTag } from './article-tag.entity';

export enum ArticleStatus {
  DRAFT = '0',
  PUBLISHED = '1',
  ARCHIVED = '2',
  SCHEDULED = '3', // 定时发布状态
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

  @OneToMany(() => ArticleTag, at => at.article)
  articleTags: ArticleTag[];

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

  @Column({ nullable: true })
  scheduled_at: Date; // 定时发布时间

  @Column()
  author_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @OneToMany(() => Menu, menu => menu.article)
  menus: Menu[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;
}
