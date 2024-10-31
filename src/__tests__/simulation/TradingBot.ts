import type { Matcher } from '@/models/Matcher';
import { Order } from '@/models/Order';
import { OrderSideEnumType } from '@/types/order.types';

export class TradingBot {
    private matcher: Matcher;
    private id: string;

    constructor(id: string, matcher: Matcher) {
        this.id = id;
        this.matcher = matcher;
    }

    placeRandomOrder(): void {
        const side =
            Math.random() < 0.5
                ? OrderSideEnumType.BUY
                : OrderSideEnumType.SELL;
        const price = Math.floor(Math.random() * 1000) + 1;
        const quantity = Math.floor(Math.random() * 10) + 1;

        const order = new Order(
            `${this.id}-${Date.now()}`,
            this.matcher.getPair(),
            side,
            price,
            quantity,
        );
        this.matcher.placeOrder(order);
    }
}
