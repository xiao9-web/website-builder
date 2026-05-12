import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ArticleService } from './article.service';

@Injectable()
export class ArticleSchedulerService {
  private readonly logger = new Logger(ArticleSchedulerService.name);

  constructor(private readonly articleService: ArticleService) {}

  // Run every minute to publish scheduled articles on time
  @Cron(CronExpression.EVERY_MINUTE)
  async handleScheduledPublishing(): Promise<void> {
    try {
      await this.articleService.publishScheduledArticles();
    } catch (err) {
      this.logger.error('定时发布任务执行失败', err);
    }
  }
}
