export interface WorkerMessage {
    type: string;
    data: any;
}

export interface WorkerJob {
    getKey(): string;
    process(): void;
    toJSON(): string;
}
