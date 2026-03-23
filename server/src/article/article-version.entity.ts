import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Article } from './article.entity';
import { User } from '../user/user.entity';

@Entity('article_versions')
export class ArticleVersion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'article_id' })
  articleId: number;

  @ManyToOne(() => Article)
  @JoinColumn({ name: 'article_id' })
  article: Article;

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

  @Column({ nullable: true })
  version: number; // 版本号

  @Column({ name: 'author_id' })
  authorId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ nullable: true })
  description: string; // 版本描述
}
