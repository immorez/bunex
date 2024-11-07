import { describe, it, expect } from 'bun:test';
import { Asset } from '@/models/Asset';

describe('Asset', () => {
    it('should create an asset with the correct symbol, name and decimals', () => {
        const asset = new Asset('BTC', 'Bitcoin', 8);

        expect(asset.getSymbol()).toBe('BTC');
        expect(asset.getName()).toBe('Bitcoin');
        expect(asset.getDecimals()).toBe(8);
    });

    it('should correctly format the amount based on the decimals', () => {
        const asset = new Asset('BTC', 'Bitcoin', 8);

        const formattedAmount = asset.formatAmount(123.45678912345);
        expect(formattedAmount).toBe('123.45678912');
    });

    it('should correctly format small amounts', () => {
        const asset = new Asset('ETH', 'Ethereum', 18);

        const formattedAmount = asset.formatAmount(0.000000000123456789);
        expect(formattedAmount).toBe('0.000000000123456789');
    });
});
