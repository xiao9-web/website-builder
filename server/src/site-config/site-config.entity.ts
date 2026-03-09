import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ConfigGroup {
  SITE = 'site',
  TEMPLATE = 'template',
  DEPLOY = 'deploy',
  SEO = 'seo',
  CUSTOM = 'custom',
}

@Entity('site_config')
export class SiteConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  config_key: string;

  @Column({ type: 'json' })
  config_value: any;

  @Column({
    type: 'enum',
    enum: ConfigGroup,
    default: ConfigGroup.CUSTOM,
  })
  group: ConfigGroup;

  @Column({ length: 255, nullable: true })
  description: string;

  @Column({ default: false })
  is_public: boolean; // 是否公开到前端

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
