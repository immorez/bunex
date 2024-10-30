import { Matcher } from '@/models/Matcher';
import type { Order } from '@/models/Order';
import { OrderSideEnumType } from '@/types/order.types';

export class MatchOrdersJob {
    private matcher: Matcher;
    private jobData: Order;

    constructor(matcher: Matcher, data: Order) {
        this.matcher = matcher;
        this.jobData = data;
    }

    getKey(): string {
        return `matchOrders-${Date.now()}`; // Generate a unique key for each job
    }

    process(): void {
        console.log(`Processing match orders job...`);
        this.matcher.placeOrder(this.jobData);
        console.log(`Match orders job completed.`);
    }

    toJSON(): any {
        return {
            matcherId: this.matcher
                .getOrderBook()
                .getPair()
                .getBaseAsset()
                .getSymbol(),
            pair: {
                baseAsset: {
                    symbol: this.matcher
                        .getOrderBook()
                        .getPair()
                        .getBaseAsset()
                        .getSymbol(),
                    name: this.matcher
                        .getOrderBook()
                        .getPair()
                        .getBaseAsset()
                        .getName(),
                    decimals: this.matcher
                        .getOrderBook()
                        .getPair()
                        .getBaseAsset()
                        .getDecimals(),
                },
                quoteAsset: {
                    symbol: this.matcher
                        .getOrderBook()
                        .getPair()
                        .getQuoteAsset()
                        .getSymbol(),
                    name: this.matcher
                        .getOrderBook()
                        .getPair()
                        .getQuoteAsset()
                        .getName(),
                    decimals: this.matcher
                        .getOrderBook()
                        .getPair()
                        .getQuoteAsset()
                        .getDecimals(),
                },
            },
            orderBookState: {
                buyOrders: this.matcher
                    .getOrderBook()
                    .getOrdersBySide(OrderSideEnumType.BUY)
                    .map((order) => ({
                        id: order.getId(),
                        price: order.getPrice(),
                        quantity: order.getQuantity(),
                        status: order.getStatus(),
                    })),
                sellOrders: this.matcher
                    .getOrderBook()
                    .getOrdersBySide(OrderSideEnumType.SELL)
                    .map((order) => ({
                        id: order.getId(),
                        price: order.getPrice(),
                        quantity: order.getQuantity(),
                        status: order.getStatus(),
                    })),
            },
        };
    }

    static fromJSON(data: Order, matcher: Matcher): MatchOrdersJob {
        return new MatchOrdersJob(matcher, data);
    }
}
