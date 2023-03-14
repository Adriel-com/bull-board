"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BullMQProAdapter = void 0;
const base_1 = require("./base");
const bluebird_1 = __importDefault(require("bluebird"));
const statuses_1 = require("../constants/statuses");
class BullMQProAdapter extends base_1.BaseAdapter {
    constructor(queue, options = {}) {
        super(options);
        this.queue = queue;
        this.LIMIT = 1000;
    }
    async getRedisInfo() {
        const client = await this.queue.client;
        return client.info();
    }
    getName() {
        return `${this.prefix}${this.queue.name}`;
    }
    clean(jobStatus, graceTimeMs) {
        return this.queue.clean(graceTimeMs, this.LIMIT, jobStatus).then(() => undefined);
    }
    getJob(id) {
        return this.queue.getJob(id);
    }
    async getJobs(jobStatuses, start, end) {
        const gotJobs = [];
        const isWaitingIncluded = jobStatuses.includes(statuses_1.STATUSES.waiting);
        if (isWaitingIncluded) {
            // It will work if here's any group
            const groups = await this.queue.getGroups(start, end);
            const jobs = await bluebird_1.default.map(groups, async (group) => {
                const groupJobs = await this.queue.getGroupJobs(group.id);
                return groupJobs;
            }, {
                concurrency: 20,
            });
            gotJobs.push(...jobs.flat());
        }
        if (jobStatuses.length > 0) {
            const jobs = (await this.queue.getJobs(jobStatuses, start, end));
            gotJobs.push(...jobs);
        }
        return gotJobs;
    }
    async getJobCounts(...jobStatuses) {
        const groups = await this.queue.getGroups();
        const groupJobCounts = await bluebird_1.default.map(groups, async (group) => {
            const groupJobsCount = await this.queue.getGroupJobsCount(group.id);
            return groupJobsCount;
        });
        const jobCounts = await this.queue.getJobCounts(...jobStatuses);
        return {
            ...jobCounts,
            waiting: groupJobCounts.reduce((acc, cur) => { return acc + cur; }, 0),
        };
    }
    getJobLogs(id) {
        return this.queue.getJobLogs(id).then(({ logs }) => logs);
    }
    isPaused() {
        return this.queue.isPaused();
    }
    pause() {
        return this.queue.pause();
    }
    resume() {
        return this.queue.resume();
    }
    empty() {
        return this.queue.drain();
    }
}
exports.BullMQProAdapter = BullMQProAdapter;
//# sourceMappingURL=bullMQPro.js.map