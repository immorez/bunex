# Bunex

**Bunex** is a high-performance, modular crypto exchange project developed in TypeScript. Built with [Bun](https://bun.sh), a fast JavaScript runtime, Bunex is designed to handle large volumes of orders across multiple trading pairs efficiently. Each trading pair's order book operates on an independent TCP server, allowing for a scalable, event-driven architecture.

## Features

-   **Multi-pair Trading**: Support for various trading pairs, with each pair operating on its own server.
-   **TCP Order Book**: Orders are placed over TCP connections, enabling real-time communication.
-   **Modular Structure**: Each order book instance can be run independently on a unique port.
-   **Event-Driven Architecture**: Events manage order placement, matching, and state updates for scalability.
-   **TypeScript**: Full type safety and modern JavaScript features for maintainability and reliability.

## Prerequisites

-   **Bun**: Ensure you have Bun v1.1.30 or higher installed. Install it [here](https://bun.sh).

## Getting Started

### 1\. Clone the Repository

`git clone https://github.com/your-username/bunex.git
cd bunex`

### 2\. Install Dependencies

Install project dependencies using Bun:

`bun install`

### 3\. Running the Project

To start the primary Bunex server:

`bun run index.ts`

### 4\. Running Order Book Servers

Each trading pair has its own order book server. To start an order book server, specify the port and trading pair:

typescript

Copy code

`// Example in code (for `BTC/USDT`pair on port`3000`)
startOrderBookServer(3000, 'BTC', 'USDT');`

You can run additional trading pairs on separate ports by calling `startOrderBookServer` with different parameters.

## Project Structure

-   `index.ts`: Main entry point for starting the Bunex server.
-   `models/`: Contains core models, including `Order`, `OrderBook`, `Pair`, and `Asset`.
-   `__tests__/`: Contains tests for core functionality.
-   `utils/`: Utility functions for parsing, encoding messages, etc.

## Configuration

You can manage ports and trading pairs in a configuration file for easier deployment:

json

Copy code

`// config.json
{
  "pairs": [
    { "pair": "BTC/USDT", "port": 3000 },
    { "pair": "ETH/USDT", "port": 3001 }
  ]
}`

Load this configuration in `index.ts` to initialize multiple servers dynamically.

## Example Usage

1.  **Place an Order**: Connect to a specific trading pair's TCP server (e.g., `localhost:3000` for BTC/USDT) and send a formatted order string.

    bash

    Copy code

    `telnet localhost 3000`

    Send a message like:

    Copy code

    `BUY 0.5 BTC @ 20000 USDT`

2.  **Monitor Order Book**: The server returns responses to the client. Use tools like `telnet` or `nc` to interact with each server.

## Running Tests

To run tests:

`bun test`

## Built With

-   **Bun** - JavaScript runtime for fast builds and efficient server-side applications.
-   **TypeScript** - Statically typed JavaScript for maintainable code.

## License

This project is licensed under the MIT License.

## Acknowledgements

-   **Bun** for their high-performance runtime environment.
-   Community resources on event-driven architecture in TypeScript and crypto exchanges.
