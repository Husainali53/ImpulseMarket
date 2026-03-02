interface NewsArticle {
    id: number;
    title: string;
    summary: string;
    source: string;
    published_at: string;
    sentiment: string;
    image_url: string;
}

export default function NewsSection({ articles }: { articles: NewsArticle[] }) {
    const getSentimentColor = (sentiment: string) => {
        switch (sentiment) {
            case 'BULLISH':
                return 'text-green-400 bg-green-500/10';
            case 'BEARISH':
                return 'text-red-400 bg-red-500/10';
            default:
                return 'text-slate-400 bg-slate-500/10';
        }
    };

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">AI-Curated Market News</h3>
                <button className="text-sm text-blue-400">View All →</button>
            </div>
            {articles.length === 0 ? (
                <div className="text-slate-500 text-center py-12">
                    Loading latest market news...
                </div>
            ) : (
                <div className="grid gap-4">
                    {articles.map((article) => (
                        <div
                            key={article.id}
                            className="flex gap-4 bg-slate-800/30 rounded-lg p-4 hover:bg-slate-800/50 transition"
                        >
                            <div className="w-24 h-24 bg-slate-700 rounded-lg flex-shrink-0 overflow-hidden">
                                {article.image_url ? (
                                    <img
                                        src={article.image_url}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span
                                        className={`text-xs px-2 py-1 rounded font-medium ${getSentimentColor(
                                            article.sentiment
                                        )}`}
                                    >
                                        {article.sentiment || 'NEUTRAL'}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        {article.source}
                                    </span>
                                </div>
                                <h4 className="font-semibold mb-2 line-clamp-2 hover:text-blue-400 transition">
                                    {article.title}
                                </h4>
                                <p className="text-sm text-slate-400 line-clamp-2">
                                    {article.summary || article.title}
                                </p>
                                <div className="text-xs text-slate-500 mt-2">
                                    {new Date(article.published_at).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}