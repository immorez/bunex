import type { Order } from '@/models/Order';
import type { OrderBook } from '@/models/OrderBook';
import { OrderSideEnumType } from '@/types/order.types';

export class OrderBookRenderer {
    static renderStatistics(orderBook: OrderBook): void {
        const stats: { [key: string]: number } = {
            totalBuyOrders: 0,
            totalSellOrders: 0,
            totalBuyQuantity: 0,
            totalSellQuantity: 0,
            highestBuyPrice: 0,
            lowestSellPrice: Infinity,
        };

        const maxPrice = orderBook.getMaxPrice();

        if (maxPrice)
            for (let price = 1; price <= maxPrice; price++) {
                const buyOrders = orderBook.getOrdersByPrice(price);
                const sellOrders = orderBook.getOrdersByPrice(price);

                stats.totalBuyOrders += buyOrders.length;
                stats.totalSellOrders += sellOrders.length;

                stats.totalBuyQuantity += buyOrders.reduce(
                    (sum, order) => sum + order.getQuantity(),
                    0,
                );

                stats.totalSellQuantity += sellOrders.reduce(
                    (sum, order) => sum + order.getQuantity(),
                    0,
                );

                if (buyOrders.length > 0) {
                    stats.highestBuyPrice = Math.max(
                        stats.highestBuyPrice,
                        price,
                    );
                }

                if (sellOrders.length > 0) {
                    stats.lowestSellPrice = Math.min(
                        stats.lowestSellPrice,
                        price,
                    );
                }
            }

        // Render statistics
        console.clear(); // Optional: Clear previous logs for clarity
        console.log('-'.repeat(50));
        console.log(`Total Buy Orders: ${stats.totalBuyOrders}`);
        console.log(`Total Sell Orders: ${stats.totalSellOrders}`);
        console.log(`Total Buy Quantity: ${stats.totalBuyQuantity}`);
        console.log(`Total Sell Quantity: ${stats.totalSellQuantity}`);
        console.log(`Highest Buy Price: ${stats.highestBuyPrice}`);
        console.log(
            `Lowest Sell Price: ${stats.lowestSellPrice === Infinity ? 'N/A' : stats.lowestSellPrice}`,
        );
        console.log('-'.repeat(50));
    }
}
