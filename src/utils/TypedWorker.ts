import type { WorkerMessage } from '@/types/worker.types';

export class TypedWorker extends Worker {
    constructor(workerScriptPath: string) {
        super(new URL(workerScriptPath, import.meta.url).href);
    }

    postMessage(message: WorkerMessage): void {
        if (
            !message ||
            typeof message.type !== 'string' ||
            message.data == null
        ) {
            throw new Error(
                'Invalid WorkerMessage. It must have a type (string) and data (not undefined).',
            );
        }
        super.postMessage(message);
    }
}
