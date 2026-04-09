import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Theme } from '../theme/theme.entity';

@Entity('page_configs')
@Index(['theme_id', 'page_type'], { unique: true })
export class PageConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  theme_id: number;

  @ManyToOne(() => Theme, theme => theme.page_configs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'theme_id' })
  theme: Theme;

  @Column({ length: 50 })
  page_type: string; // home, about, contact, product_list, article_detail

  @Column({ type: 'json' })
  config: Record<string, any>; // 页面配置数据

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
