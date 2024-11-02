import { Asset } from '@/models/Asset';
import { Matcher } from '@/models/Matcher';
import { Pair } from '@/models/Pair';
import { OrderBook } from '@/models/OrderBook';
import { TradingBot } from './TradingBot';
import { OrderBookRenderer } from '../../renderer';
import colorize from '@/utils/colorize';

const baseAsset = new Asset('BTC', 'Bitcoin', 8);
const quoteAsset = new Asset('USDT', 'USDT', 2);
const pair = new Pair(baseAsset, quoteAsset);
const orderBook = new OrderBook(pair);
const matcher = new Matcher(orderBook);

const bots: TradingBot[] = [];

// Create 50 trading bots
for (let i = 1; i <= 50; i++) {
    const bot = new TradingBot(`Bot-${i}`, matcher);
    bots.push(bot);
}

// Function to simulate trading and render the order book
setInterval(() => {
    bots.forEach((bot) => bot.placeRandomOrder());

    // Render the order book after placing orders
    const maxPrice = 1000; // Adjust based on your price range
    console.log('-'.repeat(110));
    console.log(
        colorize('Buyers', 'green').padStart(55) +
            ' | ' +
            colorize('Sellers', 'red').padStart(55),
    );
    OrderBookRenderer.renderStatistics(orderBook);
}, 1000);
