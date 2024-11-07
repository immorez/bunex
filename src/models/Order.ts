import {
    OrderStatusEnumType,
    type OrderSideEnumType,
} from '@/types/order.types';
import type { Pair } from './Pair';

export class Order {
    private readonly id: string;
    private readonly pair: Pair;
    private readonly side: OrderSideEnumType;
    private readonly price: number;
    private quantity: number;
    private status: OrderStatusEnumType;

    constructor(
        id: string,
        pair: Pair,
        side: OrderSideEnumType,
        price: number,
        quantity: number,
    ) {
        this.id = id;
        this.pair = pair;
        this.side = side;
        this.price = this.validatePrice(price);
        this.quantity = this.validateQuantity(quantity);
        this.status = OrderStatusEnumType.PENDING;
    }

    private validatePrice(price: number): number {
        if (price < 0) {
            throw new Error('Price must be a non-negative number.');
        }
        return price;
    }

    private validateQuantity(quantity: number): number {
        if (quantity < 0) {
            throw new Error('Quantity must be a non-negative number.');
        }
        return quantity;
    }

    getId(): string {
        return this.id;
    }

    getPair(): Pair {
        return this.pair;
    }

    getSide(): OrderSideEnumType {
        return this.side;
    }

    getPrice(): number {
        return this.price;
    }

    getQuantity(): number {
        return this.quantity;
    }

    getStatus(): OrderStatusEnumType {
        return this.status;
    }

    setQuantity(quantity: number): void {
        this.quantity = this.validateQuantity(quantity);
    }

    cancelOrder(): void {
        this.status = OrderStatusEnumType.CANCELED;
    }

    closeOrder(): void {
        this.status = OrderStatusEnumType.COMPLETED;
    }
}
