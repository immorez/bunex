import { Asset } from '@/models/Asset';
import { Matcher } from '@/models/Matcher';
import { Pair } from '@/models/Pair';
import { OrderBook } from '@/models/OrderBook';
import { TradingBot } from './__tests__/simulation/TradingBot';

const baseAsset = new Asset('BTC', 'Bitcoin', 8);
const quoteAsset = new Asset('USDT', 'USDT', 2);
const pair = new Pair(baseAsset, quoteAsset);
const orderBook = new OrderBook(pair);
const matcher = new Matcher(orderBook);

const bots: TradingBot[] = [];

for (let i = 1; i <= 500; i++) {
    const bot = new TradingBot(`Bot-${i}`, matcher, pair);
    bots.push(bot);
}

setInterval(() => {
    bots.forEach((bot) => bot.placeRandomOrder());
}, 5);
