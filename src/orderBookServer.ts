import net from 'net';
import { OrderBook } from './models/OrderBook';
import { Order } from './models/Order';
import { Pair } from './models/Pair';
import { Asset } from './models/Asset';
import { OrderSideEnumType } from './types/order.types';

function parseOrderMessage(message: string): {
    side: OrderSideEnumType;
    price: number;
    quantity: number;
} | null {
    // Expected format: "BUY/SELL <quantity> @ <price>"
    const regex = /^(BUY|SELL) (\d+(\.\d+)?) @ (\d+(\.\d+)?)$/i;
    const match = message.match(regex);

    if (match) {
        const side = match[1].toUpperCase() as unknown as OrderSideEnumType;
        const quantity = parseFloat(match[2]);
        const price = parseFloat(match[4]);
        return { side, price, quantity };
    }
    return null;
}

function createOrderFromParsed(
    parsedOrder: {
        side: OrderSideEnumType;
        price: number;
        quantity: number;
    },
    pair: Pair,
): Order {
    // Unique order ID with timestamp
    const orderId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    return new Order(
        orderId,
        pair,
        parsedOrder.side,
        parsedOrder.price,
        parsedOrder.quantity,
    );
}

export function startOrderBookServer(
    port: number,
    base: string,
    quote: string,
) {
    const baseAsset = new Asset(base, `${base} Asset`, 8);
    const quoteAsset = new Asset(quote, `${quote} Asset`, 2);
    const pair = new Pair(baseAsset, quoteAsset);
    const orderBook = new OrderBook(pair);

    const server = net.createServer((socket) => {
        socket.on('data', (data) => {
            const message = data.toString().trim();
            const parsedOrder = parseOrderMessage(message);

            if (parsedOrder) {
                const order = createOrderFromParsed(parsedOrder, pair);
                orderBook.addOrder(order);
                socket.write(`Order received; orderId=${order.getId()}\n`);
            } else {
                socket.write(
                    `Invalid order format. Use "BUY/SELL <quantity> @ <price>"\n`,
                );
            }
        });

        socket.on('error', (err) => {
            console.error(`Socket error: ${err.message}`);
        });

        socket.on('end', () => {
            console.log('Client disconnected');
        });
    });

    server.listen(port, () => {
        console.log(
            `OrderBook server for ${base}/${quote} listening on port ${port}`,
        );
    });
}
