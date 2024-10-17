import { describe, it, expect } from 'bun:test';
import { Asset } from '@/models/Asset';
import { Pair } from '@/models/Pair';
import { Order } from '@/models/Order';
import { OrderSideEnumType, OrderStatusEnumType } from '@/types/order.types';

describe('Order', () => {
    const baseAsset = new Asset('BTC', 'Bitcoin', 8);
    const quoteAsset = new Asset('USDT', 'USDT', 2);
    const pair = new Pair(baseAsset, quoteAsset);

    it('should create an order with valid parameters', () => {
        const order = new Order('1', pair, OrderSideEnumType.BUY, 1000, 0.5);
        expect(order.getId()).toBe('1');
        expect(order.getPair()).toBe(pair);
        expect(order.getType()).toBe(OrderSideEnumType.BUY);
        expect(order.getPrice()).toBe(1000);
        expect(order.getQuantity()).toBe(0.5);
        expect(order.getStatus()).toBe(OrderStatusEnumType.PENDING);
    });

    it('should cancel the order', () => {
        const order = new Order('1', pair, OrderSideEnumType.SELL, 1000, 0.5);
        order.cancelOrder();
        expect(order.getStatus()).toBe(OrderStatusEnumType.CANCELED);
    });

    it('should throw an error for negative price', () => {
        expect(() => {
            new Order('1', pair, OrderSideEnumType.BUY, -1000, 0.5);
        }).toThrow('Price must be a non-negative number.');
    });

    it('should throw an error for negative quantity', () => {
        expect(() => {
            new Order('1', pair, OrderSideEnumType.SELL, 1000, -0.5);
        }).toThrow('Quantity must be a non-negative number.');
    });
});
