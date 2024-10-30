import type { WorkerJob, WorkerMessage } from '@/types/worker.types';
import { TypedWorker } from '@/utils/TypedWorker';

class ThreadPool {
    private workers: TypedWorker[] = [];
    private jobQueue: WorkerJob[] = [];
    private workerJobCount: Map<TypedWorker, number> = new Map();

    constructor(
        private numThreads: number,
        private workerScriptPath: string,
    ) {
        this.initializeWorkers();
    }

    private initializeWorkers(): void {
        for (let i = 0; i < this.numThreads; i++) {
            const worker = new TypedWorker(this.workerScriptPath);
            this.workers.push(worker);
            this.workerJobCount.set(worker, 0);

            worker.onmessage = (event) => {
                const message: WorkerMessage = event.data;
                this.handleWorkerMessage(worker, message);
            };
        }
    }

    private handleWorkerMessage(
        worker: TypedWorker,
        message: WorkerMessage,
    ): void {
        if (message.type === 'jobComplete') {
            const currentJobCount = this.workerJobCount.get(worker) || 0;
            this.workerJobCount.set(worker, Math.max(0, currentJobCount - 1));

            if (this.jobQueue.length > 0) {
                const nextJob = this.jobQueue.shift();
                if (nextJob) {
                    this.dispatchJobToWorker(nextJob, worker);
                }
            }
        }
    }

    addJob(job: WorkerJob): void {
        const worker = this.getBestAvailableWorker();
        if (worker) {
            this.dispatchJobToWorker(job, worker);
        } else {
            console.log(this.getJobQueueLength());
            this.jobQueue.push(job);
        }
    }

    private getBestAvailableWorker(): TypedWorker | null {
        let bestWorker: TypedWorker | null = null;
        let minJobCount = Infinity;

        for (const [worker, jobCount] of this.workerJobCount.entries()) {
            if (jobCount < minJobCount) {
                minJobCount = jobCount;
                bestWorker = worker;
            }
        }

        return bestWorker;
    }

    private dispatchJobToWorker(job: WorkerJob, worker: TypedWorker): void {
        worker.postMessage({
            type: 'addJob',
            data: job.toJSON(),
        });

        const currentJobCount = this.workerJobCount.get(worker) || 0;
        this.workerJobCount.set(worker, currentJobCount + 1);
    }

    getJobQueueLength(): number {
        return this.jobQueue.length;
    }
}

export default ThreadPool;
