import { Asset } from '@/models/Asset';
import { Matcher } from '@/models/Matcher';
import { Pair } from '@/models/Pair';
import { OrderBook } from '@/models/OrderBook';
import { TradingBot } from './TradingBot';
import ThreadPool from '@/pool/ThreadPool';
import { OrderSideEnumType } from '@/types/order.types';
import { MatchOrdersJob } from '@/jobs/MatchOrdersJob';
import threadPool from '@/utils/threadpool';

// Function to simulate trading bot activities using ThreadPool
export function simulateTradingBots() {
    console.log('Initializing trading bot simulation...');

    const baseAsset = initializeAsset('BTC', 'Bitcoin', 8);
    const quoteAsset = initializeAsset('USDT', 'USDT', 2);
    const pair = new Pair(baseAsset, quoteAsset);

    const orderBook = new OrderBook(pair);
    console.log(
        `OrderBook initialized for pair: ${pair.getBaseAsset().getSymbol()}/${pair.getQuoteAsset().getSymbol()}`,
    );

    const matcher = new Matcher(orderBook, threadPool);
    console.log('Matcher initialized with order book and thread pool.');

    console.log('Creating trading bots...');
    const bots = createTradingBots(pair, 5);
    console.log('All trading bots created. Total:', bots.length);

    // Add jobs for each trading bot to the thread pool
    bots.forEach((bot) => {
        addJobToThreadPool(threadPool, bot, matcher);
    });
    console.log('All jobs have been added to the thread pool.');

    // Log the number of orders placed after some delay
    setTimeout(() => {
        logOrderBookState(orderBook);
    }, 1000);
}

// Helper function to initialize Asset
function initializeAsset(
    symbol: string,
    name: string,
    decimals: number,
): Asset {
    const asset = new Asset(symbol, name, decimals);
    console.log(
        `Asset created: ${name} (${symbol}) with decimals: ${decimals}`,
    );
    return asset;
}

// Helper function to create TradingBots
function createTradingBots(pair: Pair, count: number): TradingBot[] {
    const bots: TradingBot[] = [];
    for (let i = 1; i <= count; i++) {
        const bot = new TradingBot(`Bot-${i}`, pair);
        bots.push(bot);
    }
    return bots;
}

// Helper function to add jobs to ThreadPool
function addJobToThreadPool(
    threadPool: ThreadPool,
    bot: TradingBot,
    matcher: Matcher,
): void {
    const job = new MatchOrdersJob(matcher, bot.placeRandomOrder());

    console.log(`Adding job for ${bot.getName()} to the thread pool...`);
    threadPool.addJob({
        getKey: () => job.getKey(),
        toJSON: () => JSON.stringify(job),
        process: () => {
            console.log(`Processing job for ${bot.getName()}...`);
            job.process();
            console.log(`Job processed for ${bot.getName()}`);
        },
    });
}

// Helper function to log OrderBook state
function logOrderBookState(orderBook: OrderBook): void {
    console.log('Collecting order data after simulation...');
    const buyOrders = orderBook.getOrdersBySide(OrderSideEnumType.BUY);
    const sellOrders = orderBook.getOrdersBySide(OrderSideEnumType.SELL);
    console.log(`Total buy orders: ${buyOrders.length}`);
    console.log(`Total sell orders: ${sellOrders.length}`);
    console.log('Trading bot simulation completed.');
}

// Run the simulation
simulateTradingBots();
