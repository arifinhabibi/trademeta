import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class SchedulerService implements OnModuleDestroy {
  private readonly logger = new Logger(SchedulerService.name);
  private readonly intervals: NodeJS.Timeout[] = [];

  scheduleInterval(name: string, intervalMs: number, task: () => void): void {
    const interval = setInterval(() => {
      task();
    }, intervalMs);
    this.logger.debug(`Scheduled interval ${name} every ${intervalMs}ms`);
    this.intervals.push(interval);
  }

  onModuleDestroy(): void {
    this.intervals.forEach((interval) => clearInterval(interval));
    this.logger.debug('Cleared scheduler intervals');
  }
}
