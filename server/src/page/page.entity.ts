import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

export enum PageStatus {
  DRAFT = 0,
  PUBLISHED = 1,
  ARCHIVED = 2,
}

@Entity('pages')
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ unique: true, length: 255 })
  slug: string; // 访问路径，比如 /about

  @Column({ type: 'json', nullable: true })
  layout_config: Record<string, any>; // 页面布局配置，JSON格式

  @Column({ type: 'text', nullable: true })
  content: string; // 备用富文本内容

  @Column({ length: 255, nullable: true })
  template: string; // 使用的模板名称

  @Column({ length: 255, nullable: true })
  seo_title: string;

  @Column({ type: 'text', nullable: true })
  seo_description: string;

  @Column({ length: 255, nullable: true })
  seo_keywords: string;

  @Column({
    type: 'enum',
    enum: PageStatus,
    default: PageStatus.DRAFT,
  })
  status: PageStatus;

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
