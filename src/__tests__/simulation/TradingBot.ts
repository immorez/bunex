import type { Matcher } from '@/models/Matcher';
import { Order } from '@/models/Order';
import type { Pair } from '@/models/Pair';
import { OrderSideEnumType } from '@/types/order.types';

export class TradingBot {
    private pair: Pair;
    private id: string;

    constructor(id: string, pair: Pair) {
        this.id = id;
        this.pair = pair;
    }

    placeRandomOrder(): Order {
        const side =
            Math.random() < 0.5
                ? OrderSideEnumType.BUY
                : OrderSideEnumType.SELL;
        const price = Math.floor(Math.random() * 1000) + 1;
        const quantity = Math.floor(Math.random() * 10) + 1;

        const order = new Order(
            `${this.id}-${Date.now()}`,
            this.pair,
            side,
            price,
            quantity,
        );
        return order;
    }

    getName(): string {
        return this.id;
    }
}
