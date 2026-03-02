interface StockPick {
    id: number;
    ticker: string;
    name: string;
    price: number;
    change: number;
    sentiment?: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
}

export default function StockPicks({ picks }: { picks: StockPick[] }) {
    return (
        <div className="space-y-4">
            {picks.map(pick => (
                <div
                    key={pick.id}
                    className="flex justify-between items-center p-4 bg-slate-800 rounded-lg"
                >
                    <div>
                        <div className="font-semibold">{pick.ticker}</div>
                        <div className="text-sm text-slate-400">{pick.name}</div>
                    </div>
                    <div className="text-right">
                        <div>${pick.price.toFixed(2)}</div>
                        <div
                            className={`text-sm ${
                                pick.change > 0 ? 'text-green-400' : 'text-red-400'
                            }`}
                        >
                            {pick.change > 0 ? '+' : ''}
                            {pick.change.toFixed(2)}%
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}