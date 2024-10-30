import { Matcher } from '@/models/Matcher';
import { MatchOrdersJob } from '@/jobs/MatchOrdersJob';
import { Asset } from '@/models/Asset';
import { OrderBook } from '@/models/OrderBook';
import { Pair } from '@/models/Pair';
import threadPool from './threadpool';

// In-memory storage for matchers
const matchersMap = new Map();

onmessage = (event) => {
    const { type, data } = event.data;
    console.log('Worker received message:', type);

    try {
        switch (type) {
            case 'addJob': {
                if (typeof data === 'string') {
                    try {
                        handleAddJob(JSON.parse(data));
                    } catch (parseError) {
                        console.error('Failed to parse data:', parseError);
                        return;
                    }
                } else {
                    handleAddJob(data);
                }
                break;
            }
            default:
                console.error('Unknown message type received by worker:', type);
        }
    } catch (error) {
        console.error('Error processing message:', error);
    }
};

function handleAddJob(data: any) {
    const {
        pair: { baseAsset, quoteAsset },
    } = data || {};

    if (!baseAsset || !quoteAsset) {
        console.error('Missing baseAsset or quoteAsset in job data:', data);
        return;
    }

    const matcherKey = `${baseAsset.symbol}-${quoteAsset.symbol}`;
    const matcher =
        matchersMap.get(matcherKey) ||
        initializeMatcher(baseAsset, quoteAsset, matcherKey);

    threadPool.addJob(createJob(data, matcher));
}

function initializeMatcher(
    baseAssetData: any,
    quoteAssetData: any,
    matcherKey: string,
): Matcher {
    const baseAsset = new Asset(
        baseAssetData.symbol,
        baseAssetData.name,
        baseAssetData.decimals,
    );

    const quoteAsset = new Asset(
        quoteAssetData.symbol,
        quoteAssetData.name,
        quoteAssetData.decimals,
    );

    const pair = new Pair(baseAsset, quoteAsset);

    const orderBook = new OrderBook(pair);

    const matcher = new Matcher(orderBook, threadPool);

    matchersMap.set(matcherKey, matcher);

    return matcher;
}

function createJob(jobData: any, matcher: Matcher) {
    const job = MatchOrdersJob.fromJSON(jobData, matcher);

    console.log(`Job created with key: ${job.getKey()}`);
    return {
        getKey: () => job.getKey(),
        toJSON: () => job.toJSON(),
        process: () => {
            try {
                console.log('Processing job...');
                job.process();
                console.log('Job processed successfully.');
                postJobCompletion(job.getKey());
            } catch (error) {
                console.error('Error processing job:', error);
            }
        },
    };
}

function postJobCompletion(jobId: string) {
    postMessage({ type: 'jobComplete', id: jobId });
    console.log(`Job completion message posted for job ID: ${jobId}`);
}
