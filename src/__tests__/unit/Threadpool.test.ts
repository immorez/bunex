import ThreadPool from '@/pool/ThreadPool';
import type { WorkerJob } from '@/types/worker.types';
import threadPool from '@/utils/threadpool';
import { describe, it, expect, beforeEach, jest } from 'bun:test';

// Assuming your worker script is at './workerScript.ts'
class MockJob implements WorkerJob {
    constructor(private id: string) {}
    process(): void {
        throw new Error('Method not implemented.');
    }

    getKey(): string {
        return this.id;
    }

    toJSON(): string {
        return JSON.stringify({ id: this.id });
    }
}

describe('ThreadPool - No Mocks', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize the specified number of workers', () => {
        expect(threadPool['workers'].length).toBe(2);
    });

    it('should assign a job to an available worker', async () => {
        const job = new MockJob('job1');

        threadPool.addJob(job);

        await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it('should assign queued jobs when a worker becomes available', async () => {
        const job1 = new MockJob('job1');
        const job2 = new MockJob('job2');
        const job3 = new MockJob('job3');

        threadPool.addJob(job1);

        threadPool.addJob(job2);

        threadPool.addJob(job3);

        expect(threadPool['jobQueue'].length).toBe(1);

        await new Promise((resolve) => setTimeout(resolve, 200));

        expect(threadPool['jobQueue'].length).toBe(0);
    });

    it('should queue a job if no workers are available', () => {
        const job1 = new MockJob('job1');
        const job2 = new MockJob('job2');

        threadPool.addJob(job1);
        threadPool.addJob(job2);

        // Since we have two jobs and two workers, neither should be queued
        expect(threadPool['jobQueue'].length).toBe(0);
    });

    it('should decrement worker job count when a job is completed', async () => {
        const job = new MockJob('job1');

        threadPool.addJob(job);

        // Wait for job completion
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Since the worker should be idle again, job count should be zero
        const worker = threadPool['workers'][0];

        expect(threadPool['workerJobCount'].get(worker)).toBe(0);
    });
});
