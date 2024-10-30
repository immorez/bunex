import { describe, it, expect } from 'bun:test';
import { Asset } from '@/models/Asset';
import { Pair } from '@/models/Pair';
import { Order } from '@/models/Order';
import { Matcher } from '@/models/Matcher';
import { OrderSideEnumType, OrderStatusEnumType } from '@/types/order.types';
import { OrderBook } from '@/models/OrderBook';
import threadPool from '@/utils/threadpool';

describe('Matcher', () => {
    const baseAsset = new Asset('BTC', 'Bitcoin', 8);
    const quoteAsset = new Asset('USDT', 'USDT', 2);
    const pair = new Pair(baseAsset, quoteAsset);
    const orderBook = new OrderBook(pair);
    const matcher = new Matcher(orderBook, threadPool);

    it('should match buy and sell orders correctly', () => {
        const buyOrder = new Order('1', pair, OrderSideEnumType.BUY, 1000, 1);
        const sellOrder = new Order('2', pair, OrderSideEnumType.SELL, 900, 1);

        matcher.placeOrder(buyOrder);
        matcher.placeOrder(sellOrder);

        expect(buyOrder.getQuantity()).toBe(0);
        expect(sellOrder.getQuantity()).toBe(0);
        expect(buyOrder.getStatus()).toBe(OrderStatusEnumType.COMPLETED);
        expect(sellOrder.getStatus()).toBe(OrderStatusEnumType.COMPLETED);
    });

    it('should handle multiple matching orders', () => {
        const buyOrder1 = new Order('5', pair, OrderSideEnumType.BUY, 1000, 1);
        const buyOrder2 = new Order('6', pair, OrderSideEnumType.BUY, 950, 1);
        const sellOrder = new Order('7', pair, OrderSideEnumType.SELL, 900, 2);

        matcher.placeOrder(buyOrder1);
        matcher.placeOrder(buyOrder2);

        matcher.placeOrder(sellOrder);

        expect(buyOrder1.getQuantity()).toBe(0);
        expect(buyOrder2.getQuantity()).toBe(0);
        expect(sellOrder.getQuantity()).toBe(0);
        expect(buyOrder1.getStatus()).toBe(OrderStatusEnumType.COMPLETED);
        expect(buyOrder2.getStatus()).toBe(OrderStatusEnumType.COMPLETED);
        expect(sellOrder.getStatus()).toBe(OrderStatusEnumType.COMPLETED);
    });

    it('should not match orders with incompatible prices', () => {
        const buyOrder = new Order('3', pair, OrderSideEnumType.BUY, 8000, 1);
        const sellOrder = new Order('4', pair, OrderSideEnumType.SELL, 9000, 1);

        matcher.placeOrder(buyOrder);
        matcher.placeOrder(sellOrder);

        expect(buyOrder.getQuantity()).toBe(1);
        expect(sellOrder.getQuantity()).toBe(1);
        expect(buyOrder.getStatus()).toBe(OrderStatusEnumType.PENDING);
        expect(sellOrder.getStatus()).toBe(OrderStatusEnumType.PENDING);
    });
});
