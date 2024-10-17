import type {
    OrderSideEnumType,
    OrderStatusEnumType,
} from '@/types/order.types';
import { Order } from './Order';
import { Pair } from './Pair';

export class OrderBook {
    private pair: Pair;
    private orders: Order[] = [];

    constructor(pair: Pair) {
        this.pair = pair;
    }

    addOrder(order: Order): void {
        this.orders.push(order);
    }

    removeOrder(orderId: string): void {
        const index = this.orders.findIndex(
            (order) => order.getId() === orderId,
        );
        if (index === -1) {
            throw new Error('Order not found.');
        }
        this.orders = this.orders.filter((order) => order.getId() !== orderId);
    }

    getOrders(): Order[] {
        return this.orders;
    }

    getOrdersByType(type: OrderSideEnumType): Order[] {
        return this.orders.filter((order) => order.getType() === type);
    }

    getOrdersByStatus(status: OrderStatusEnumType): Order[] {
        return this.orders.filter((order) => order.getStatus() === status);
    }

    getPair(): Pair {
        return this.pair;
    }
}
