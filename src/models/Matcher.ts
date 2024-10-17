import { Order } from './Order';
import { OrderBook } from './OrderBook';
import { OrderSideEnumType, OrderStatusEnumType } from '@/types/order.types';

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
        const buyOrders = this.orderBook.getOrdersBySide(OrderSideEnumType.BUY);

        const sellOrders = this.orderBook.getOrdersBySide(
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

    private canMatch(buyOrder: Order, sellOrder: Order): boolean {
        return (
            buyOrder.getPrice() >= sellOrder.getPrice() &&
            buyOrder.getStatus() === OrderStatusEnumType.PENDING &&
            sellOrder.getStatus() === OrderStatusEnumType.PENDING
        );
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

        console.log('TRADE HAPPENED', buyOrder.getId(), sellOrder.getId());
    }
}
