import { Job } from 'bullmq';
import { QueuePro } from '@taskforcesh/bullmq-pro';
import { JobCleanStatus, JobCounts, JobStatus, QueueAdapterOptions } from '../../typings/app';
import { BaseAdapter } from './base';
import Bluebird from 'bluebird';
import { STATUSES } from '../constants/statuses';

export class BullMQProAdapter extends BaseAdapter {
  private readonly LIMIT = 1000;

  constructor(private queue: QueuePro, options: Partial<QueueAdapterOptions> = {}) {
    super(options);
  }

  public async getRedisInfo(): Promise<string> {
    const client = await this.queue.client;
    return client.info();
  }

  public getName(): string {
    return `${this.prefix}${this.queue.name}`;
  }

  public clean(jobStatus: JobCleanStatus, graceTimeMs: number): Promise<void> {
    return this.queue.clean(graceTimeMs, this.LIMIT, jobStatus).then(() => undefined);
  }

  public getJob(id: string): Promise<Job | undefined> {
    return this.queue.getJob(id) as unknown as Promise<Job>;
  }

  public async getJobs(jobStatuses: JobStatus[], start?: number, end?: number): Promise<Job[]> {
    const gotJobs: Job[] = []
    const isWaitingIncluded = jobStatuses.includes(STATUSES.waiting);
    if(isWaitingIncluded){
      // It will work if here's any group
      const groups = await this.queue.getGroups(start, end);
      const jobs = await Bluebird.map(groups, async group => {
        const groupJobs = await this.queue.getGroupJobs(group.id);
        return groupJobs;
      }, {
        concurrency: 20,
      });
      gotJobs.push(...jobs.flat() as unknown as Job[]);
    }
    if(jobStatuses.length > 0){
      const jobs = (await this.queue.getJobs(jobStatuses, start, end)) as unknown as Job[];
      gotJobs.push(...jobs);
    }
    return gotJobs;
  }

  public async getJobCounts(...jobStatuses: JobStatus[]): Promise<JobCounts> {
    const groups = await this.queue.getGroups();
    const groupJobCounts = await Bluebird.map(groups, async group => {
      const groupJobsCount = await this.queue.getGroupJobsCount(group.id);
      return groupJobsCount;
    });
    const jobCounts = await this.queue.getJobCounts(...jobStatuses) as JobCounts;
    return {
      ...jobCounts,
      waiting: groupJobCounts.reduce((acc, cur) => {return acc + cur;}, 0),
    };
  }

  public getJobLogs(id: string): Promise<string[]> {
    return this.queue.getJobLogs(id).then(({ logs }) => logs);
  }

  public isPaused(): Promise<boolean> {
    return this.queue.isPaused();
  }

  public pause(): Promise<void> {
    return this.queue.pause();
  }

  public resume(): Promise<void> {
    return this.queue.resume();
  }

  public empty(): Promise<void> {
    return this.queue.drain();
  }
}
