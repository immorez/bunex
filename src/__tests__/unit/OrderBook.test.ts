import { describe, it, expect } from 'bun:test';
import { Asset } from '@/models/Asset';
import { Pair } from '@/models/Pair';
import { Order } from '@/models/Order';
import { OrderSideEnumType, OrderStatusEnumType } from '@/types/order.types';
import { OrderBook } from '@/models/OrderBook';

describe('OrderBook', () => {
    const baseAsset = new Asset('BTC', 'Bitcoin', 8);
    const quoteAsset = new Asset('USDT', 'USDT', 2);
    const pair = new Pair(baseAsset, quoteAsset);
    const orderBook = new OrderBook(pair);

    it('should add an order to the order book', () => {
        const order = new Order('1', pair, OrderSideEnumType.BUY, 1000, 0.5);
        orderBook.addOrder(order);
        expect(orderBook.getOrders()).toContain(order);
    });

    it('should remove an order from the order book', () => {
        const order = new Order('1', pair, OrderSideEnumType.BUY, 1000, 0.5);
        orderBook.addOrder(order);
        orderBook.removeOrder('1');

        expect(orderBook.getOrders()).not.toContain(order);
    });

    it('should throw an error when trying to remove a non-existing order', () => {
        expect(() => {
            orderBook.removeOrder('non-existing-id');
        }).toThrow('Order not found.');
    });

    it('should return the correct number of orders', () => {
        const order1 = new Order('1', pair, OrderSideEnumType.BUY, 1000, 0.5);
        const order2 = new Order('2', pair, OrderSideEnumType.SELL, 2000, 1);
        orderBook.addOrder(order1);
        orderBook.addOrder(order2);
        expect(orderBook.getOrders().length).toBe(2);
    });
});
