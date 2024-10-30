import ThreadPool from '@/pool/ThreadPool';

const threadPool = new ThreadPool(2, '../utils/workerScript.ts');

export default threadPool;
