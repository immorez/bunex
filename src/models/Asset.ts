export class Asset {
    private symbol: string;
    private name: string;
    private decimals: number;

    constructor(symbol: string, name: string, decimals: number) {
        this.symbol = symbol;
        this.name = name;
        this.decimals = decimals;
    }

    getSymbol(): string {
        return this.symbol;
    }

    getName(): string {
        return this.name;
    }

    getDecimals(): number {
        return this.decimals;
    }

    formatAmount(amount: number): string {
        return amount.toFixed(this.decimals);
    }
}
