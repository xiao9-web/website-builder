import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PageConfig } from '../page-config/page-config.entity';

@Entity('themes')
export class Theme {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  name: string; // blog, enterprise

  @Column({ length: 100 })
  display_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 255, nullable: true })
  preview_image: string;

  @Column({ default: false })
  is_active: boolean;

  @Column({ type: 'json', nullable: true })
  config: Record<string, any>; // 主题配置：颜色、字体等

  @OneToMany(() => PageConfig, pageConfig => pageConfig.theme)
  page_configs: PageConfig[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
