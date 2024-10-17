import type { Matcher } from '@/models/Matcher';
import { Order } from '@/models/Order';
import type { Pair } from '@/models/Pair';
import { OrderSideEnumType } from '@/types/order.types';

export class TradingBot {
    private matcher: Matcher;
    private pair: Pair;
    private id: string;

    constructor(id: string, matcher: Matcher, pair: Pair) {
        this.id = id;
        this.matcher = matcher;
        this.pair = pair;
    }

    placeRandomOrder(): void {
        const side =
            Math.random() < 0.5
                ? OrderSideEnumType.BUY
                : OrderSideEnumType.SELL;
        const price = Math.floor(Math.random() * 1000) + 1; // Random price between 1 and 1000
        const quantity = Math.floor(Math.random() * 10) + 1; // Random quantity between 1 and 10

        const order = new Order(
            `${this.id}-${Date.now()}`,
            this.pair,
            side,
            price,
            quantity,
        );
        this.matcher.placeOrder(order);
    }
}
