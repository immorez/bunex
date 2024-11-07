import { Order } from './Order';
import { OrderBook } from './OrderBook';
import { OrderSideEnumType } from '@/types/order.types';
import type { Pair } from './Pair';

export class Matcher {
    private readonly orderBook: OrderBook;

    constructor(orderBook: OrderBook) {
        this.orderBook = orderBook;
    }

    placeOrder(order: Order): void {
        this.orderBook.addOrder(order);
        this.matchOrders();
    }

    private matchOrders(): void {
        const buyOrders = this.orderBook.getPendingOrdersBySide(
            OrderSideEnumType.BUY,
        );
        const sellOrders = this.orderBook.getPendingOrdersBySide(
            OrderSideEnumType.SELL,
        );

        for (const buyOrder of buyOrders) {
            for (const sellOrder of sellOrders) {
                if (this.canMatch(buyOrder, sellOrder)) {
                    this.executeOrder(buyOrder, sellOrder);
                    if (buyOrder.getQuantity() === 0) {
                        break;
                    }
                }
            }
        }
    }

    getPair(): Pair {
        return this.orderBook.getPair();
    }

    private canMatch(buyOrder: Order, sellOrder: Order): boolean {
        return buyOrder.getPrice() >= sellOrder.getPrice();
    }

    private executeOrder(buyOrder: Order, sellOrder: Order): void {
        const quantity = Math.min(
            buyOrder.getQuantity(),
            sellOrder.getQuantity(),
        );

        buyOrder.setQuantity(buyOrder.getQuantity() - quantity);
        sellOrder.setQuantity(sellOrder.getQuantity() - quantity);

        if (buyOrder.getQuantity() === 0) {
            buyOrder.closeOrder();
        }

        if (sellOrder.getQuantity() === 0) {
            sellOrder.closeOrder();
        }
    }
}
