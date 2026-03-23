import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Category } from '../category/category.entity';
import { Article } from '../article/article.entity';

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 255, nullable: true })
  path: string;

  @Column({ nullable: true })
  category_id: number;

  @Column({ nullable: true })
  article_id: number;

  @Column({ nullable: true })
  parent_id: number;

  @Column({ default: 0 })
  sort: number;

  @Column({ length: 50, nullable: true })
  icon: string;

  @Column({ length: 255, nullable: true })
  target: string; // _blank/_self等

  @Column({ default: true })
  is_visible: boolean;

  @Column({ type: 'json', nullable: true })
  meta: Record<string, any>; // 扩展字段

  @ManyToOne(() => Menu, menu => menu.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Menu;

  @OneToMany(() => Menu, menu => menu.parent)
  children: Menu[];

  @ManyToOne(() => Category, { nullable: true, createForeignKeyConstraints: false })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Article, { nullable: true, createForeignKeyConstraints: false })
  @JoinColumn({ name: 'article_id' })
  article: Article;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
