import {
    OrderStatusEnumType,
    type OrderSideEnumType,
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

    getOrdersBySide(side: OrderSideEnumType): Order[] {
        return this.orders.filter((order) => order.getSide() === side);
    }

    getPendingOrdersBySide(side: OrderSideEnumType): Order[] {
        return this.orders.filter(
            (order) =>
                order.getSide() === side &&
                order.getStatus() === OrderStatusEnumType.PENDING,
        );
    }

    getOrdersByStatus(status: OrderStatusEnumType): Order[] {
        return this.orders.filter((order) => order.getStatus() === status);
    }

    getPair(): Pair {
        return this.pair;
    }
}
