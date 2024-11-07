import { OrderStatusEnumType, OrderSideEnumType } from '@/types/order.types';
import { Order } from './Order';
import { Pair } from './Pair';
import { RedBlackTree } from '@/utils/rbt';

export class OrderBook {
    private pair: Pair;
    private orders: Order[] = [];
    private askOrders: RedBlackTree<Order>;
    private bidOrders: RedBlackTree<Order>;

    constructor(pair: Pair) {
        this.pair = pair;

        this.askOrders = new RedBlackTree<Order>();
        this.bidOrders = new RedBlackTree<Order>();
    }

    addOrder(order: Order): void {
        this.orders.push(order);
        if (order.getSide() === OrderSideEnumType.BUY) {
            this.bidOrders.insert(order);
        } else {
            this.askOrders.insert(order);
        }
    }

    removeOrder(orderId: string): void {
        const orderIndex = this.orders.findIndex(
            (order) => order.getId() === orderId,
        );
        if (orderIndex !== -1) {
            const order = this.orders[orderIndex];
            this.orders.splice(orderIndex, 1);
            if (order.getSide() === OrderSideEnumType.BUY) {
                this.bidOrders.delete(order); // Use the delete method
            } else {
                this.askOrders.delete(order); // Use the delete method
            }
        }
    }

    getOrders(): Order[] {
        return this.orders;
    }

    getOrdersBySide(side: OrderSideEnumType): Order[] {
        return side === OrderSideEnumType.BUY
            ? this.bidOrders.inOrder()
            : this.askOrders.inOrder();
    }

    getPendingOrdersBySide(side: OrderSideEnumType): Order[] {
        return this.orders.filter(
            (order) =>
                order.getSide() === side &&
                order.getStatus() === OrderStatusEnumType.PENDING,
        );
    }

    getOrdersByPrice(price: number): Order[] {
        return this.orders.filter((order) => order.getPrice() === price);
    }

    getOrdersByStatus(status: OrderStatusEnumType): Order[] {
        return this.orders.filter((order) => order.getStatus() === status);
    }

    getAskMin(): number | null {
        const minAsk = this.askOrders.getMinimum(this.askOrders.root);
        return minAsk ? minAsk.value.getPrice() : null;
    }

    getBidMax(): number | null {
        const maxBid = this.bidOrders.getMaximum(this.bidOrders.root);
        return maxBid ? maxBid.value.getPrice() : null;
    }

    getPair(): Pair {
        return this.pair;
    }

    getMaxPrice(): number | null {
        const maxBidNode = this.bidOrders.getMaximum(this.bidOrders.root);
        const maxAskNode = this.askOrders.getMaximum(this.askOrders.root);

        const maxBidPrice = maxBidNode ? maxBidNode.value.getPrice() : null;
        const maxAskPrice = maxAskNode ? maxAskNode.value.getPrice() : null;

        // Return the higher of the two prices or null if both are null
        if (maxBidPrice !== null && maxAskPrice !== null) {
            return Math.max(maxBidPrice, maxAskPrice);
        } else if (maxBidPrice !== null) {
            return maxBidPrice;
        } else if (maxAskPrice !== null) {
            return maxAskPrice;
        }
        return null;
    }
}
