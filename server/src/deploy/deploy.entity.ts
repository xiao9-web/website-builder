import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

export enum DeployStatus {
  PENDING = 0,
  RUNNING = 1,
  SUCCESS = 2,
  FAILED = 3,
}

@Entity('deploy_versions')
export class DeployVersion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  version: string; // 版本号，比如 v1.0.0 或者 时间戳格式

  @Column({ length: 255, nullable: true })
  description: string; // 版本描述

  @Column({
    type: 'enum',
    enum: DeployStatus,
    default: DeployStatus.PENDING,
  })
  status: DeployStatus;

  @Column({ type: 'text', nullable: true })
  deploy_log: string; // 部署日志

  @Column({ type: 'json', nullable: true })
  build_config: Record<string, any>; // 构建配置

  @Column({ length: 255, nullable: true })
  preview_url: string; // 预览地址

  @Column({ nullable: true })
  duration: number; // 部署耗时，单位秒

  @Column()
  created_by: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @CreateDateColumn()
  created_at: Date;
}
