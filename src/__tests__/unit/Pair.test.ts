import { describe, it, expect } from 'bun:test';
import { Asset } from '@/models/Asset';
import { Pair } from '@/models/Pair';

describe('Pair', () => {
    const baseAsset = new Asset('BTC', 'Bitcoin', 8);
    const quoteAsset = new Asset('USDT', 'USDT', 2);
    const pair = new Pair(baseAsset, quoteAsset);

    it('should return the correct base asset', () => {
        expect(pair.getBaseAsset()).toBe(baseAsset);
    });

    it('should return the correct quote asset', () => {
        expect(pair.getQuoteAsset()).toBe(quoteAsset);
    });

    it('should format the price correctly', () => {
        const price = 1234.5678;
        const formattedPrice = pair.formatPrice(price);
        expect(formattedPrice).toBe('1234.57');
    });

    it('should format the quantity correctly', () => {
        const quantity = 1.12345678;
        const formattedQuantity = pair.formatQuantity(quantity);
        expect(formattedQuantity).toBe('1.12345678');
    });
});
