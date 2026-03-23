import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Article } from './article.entity';
import { Menu } from '../menu/menu.entity';

@Entity('article_menu')
export class ArticleMenu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  article_id: number;

  @Column()
  menu_id: number;

  @ManyToOne(() => Article)
  @JoinColumn({ name: 'article_id' })
  article: Article;

  @ManyToOne(() => Menu)
  @JoinColumn({ name: 'menu_id' })
  menu: Menu;

  @CreateDateColumn()
  created_at: Date;
}
