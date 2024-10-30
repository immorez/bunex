import { Order } from './Order';
import { OrderBook } from './OrderBook';
import { OrderSideEnumType, OrderStatusEnumType } from '@/types/order.types';
import ThreadPool from '@/pool/ThreadPool';
import { MatchOrdersJob } from '@/jobs/MatchOrdersJob';

export class Matcher {
    private readonly orderBook: OrderBook;
    private readonly threadPool: ThreadPool;

    constructor(orderBook: OrderBook, threadPool: ThreadPool) {
        this.orderBook = orderBook;
        this.threadPool = threadPool;
    }

    placeOrder(order: Order): void {
        this.orderBook.addOrder(order);

        // Dispatch the matchOrders process to the thread pool
        console.log(`Creating MatchOrdersJob for order matching...`);
        const matchJob = new MatchOrdersJob(this, order);
        this.threadPool.addJob({
            getKey: () => matchJob.getKey(),
            toJSON: () => matchJob.toJSON(),
            process: () => matchJob.process(),
        });
    }

    matchOrders(): void {
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
    }

    getOrderBook(): OrderBook {
        return this.orderBook;
    }
}
