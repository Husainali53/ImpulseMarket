import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { analyzeSentiment, summarizeNews } from '@/lib/gemini'

export async function GET() {
    try {
        const newsRes = await fetch(`https://newsapi.org/v2/everything?q=stock+market+OR+finance+OR+earnings&language=en&sortBy=publishedAt&pageSize=10&apiKey=${process.env.NEWS_API_KEY}`)
        const newsData = await newsRes.json()
        if (!newsData.articles) return NextResponse.json({ error: 'No articles' }, { status: 500 })

        const processedArticles = await Promise.all(newsData.articles.map(async (article: any) => {
            const sentiment = await analyzeSentiment(article.title + ' ' + (article.description || ''))
            const summary = await summarizeNews(article.description || article.title)
            return { title: article.title, summary, source: article.source.name, url: article.url, image_url: article.urlToImage, published_at: article.publishedAt, sentiment, related_symbols: [] }
        }))

        for (const article of processedArticles) {
            await supabase.from('news_articles').upsert(article, { onConflict: 'url' })
        }
        return NextResponse.json({ success: true, count: processedArticles.length })
    } catch (error) { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}