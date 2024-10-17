import type { Asset } from './Asset';

export class Pair {
    private baseAsset: Asset;
    private quoteAsset: Asset;

    constructor(baseAsset: Asset, quoteAsset: Asset) {
        this.baseAsset = baseAsset;
        this.quoteAsset = quoteAsset;
    }

    getBaseAsset(): Asset {
        return this.baseAsset;
    }

    getQuoteAsset(): Asset {
        return this.quoteAsset;
    }

    formatPrice(price: number): string {
        return price.toFixed(this.quoteAsset.getDecimals());
    }

    formatQuantity(quantity: number): string {
        return quantity.toFixed(this.baseAsset.getDecimals());
    }
}
