import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function analyzeSentiment(newsText: string): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
        const prompt = `Analyze sentiment of this financial news. Reply ONLY: BULLISH, BEARISH, or NEUTRAL.\n\nNews: ${newsText}`
        const result = await model.generateContent(prompt)
        const response = result.response.text().trim().toUpperCase()
        return ['BULLISH', 'BEARISH', 'NEUTRAL'].includes(response) ? response : 'NEUTRAL'
    } catch (error) {
        return 'NEUTRAL'
    }
}

export async function summarizeNews(newsText: string): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
        const prompt = `Summarize this financial news in 2 sentences for retail investors:\n\n${newsText}`
        const result = await model.generateContent(prompt)
        return result.response.text().trim()
    } catch (error) {
        return newsText.slice(0, 200) + '...'
    }
}