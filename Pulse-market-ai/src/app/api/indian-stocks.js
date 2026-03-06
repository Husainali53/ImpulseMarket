// pages/api/indian-stocks.js
export default async function handler(req, res) {
  const { symbols } = req.query;
  
  if (!symbols) {
    return res.status(400).json({ error: 'Symbols required' });
  }

  try {
    // Using the free Indian Stock API
    const response = await fetch(
      `https://military-jobye-haiqstudios-14f59639.koyeb.app/stocks?symbols=${symbols}`
    );
    
    if (!response.ok) throw new Error('API failed');
    
    const data = await response.json();
    
    // Transform to match your existing format
    const transformed = data.map(stock => ({
      symbol: stock.symbol.replace('.NS', '').replace('.BO', ''),
      name: stock.name,
      price: stock.price,
      change: stock.change,
      changePercent: stock.changePercent,
      volume: stock.volume,
      marketCap: stock.marketCap,
      exchange: stock.symbol.includes('.BO') ? 'BSE' : 'NSE',
      currency: 'INR',
      aiScore: calculateAIScore(stock) // Your existing logic
    }));
    
    res.status(200).json(transformed);
  } catch (error) {
    // Fallback to mock data if API fails
    res.status(200).json(getMockIndianStocks());
  }
}

// Mock data fallback
function getMockIndianStocks() {
  return [
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2450.50, change: 45.20, changePercent: 1.88, volume: '12.5M', marketCap: '16.5T', exchange: 'NSE', currency: 'INR', aiScore: 92 },
    { symbol: 'TCS', name: 'Tata Consultancy', price: 3890.75, change: -12.30, changePercent: -0.32, volume: '2.1M', marketCap: '14.2T', exchange: 'NSE', currency: 'INR', aiScore: 88 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1420.30, change: 18.50, changePercent: 1.32, volume: '8.7M', marketCap: '8.9T', exchange: 'NSE', currency: 'INR', aiScore: 85 },
    { symbol: 'INFY', name: 'Infosys', price: 1580.20, change: 22.10, changePercent: 1.42, volume: '5.3M', marketCap: '6.5T', exchange: 'NSE', currency: 'INR', aiScore: 83 },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 985.60, change: 15.40, changePercent: 1.59, volume: '10.2M', marketCap: '6.9T', exchange: 'NSE', currency: 'INR', aiScore: 81 },
    { symbol: 'SBIN', name: 'State Bank of India', price: 720.45, change: -8.20, changePercent: -1.13, volume: '15.8M', marketCap: '6.4T', exchange: 'NSE', currency: 'INR', aiScore: 78 },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1120.80, change: 25.60, changePercent: 2.34, volume: '4.2M', marketCap: '6.2T', exchange: 'NSE', currency: 'INR', aiScore: 80 },
    { symbol: 'ITC', name: 'ITC Limited', price: 420.15, change: 3.50, changePercent: 0.84, volume: '9.1M', marketCap: '5.2T', exchange: 'NSE', currency: 'INR', aiScore: 76 },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', price: 1750.90, change: -22.40, changePercent: -1.26, volume: '1.8M', marketCap: '3.5T', exchange: 'NSE', currency: 'INR', aiScore: 74 },
    { symbol: 'LT', name: 'Larsen & Toubro', price: 2850.30, change: 65.20, changePercent: 2.34, volume: '3.2M', marketCap: '4.0T', exchange: 'NSE', currency: 'INR', aiScore: 82 },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: 2350.60, change: -18.30, changePercent: -0.77, volume: '1.5M', marketCap: '5.5T', exchange: 'NSE', currency: 'INR', aiScore: 79 },
    { symbol: 'AXISBANK', name: 'Axis Bank', price: 950.25, change: 12.80, changePercent: 1.37, volume: '6.7M', marketCap: '2.9T', exchange: 'NSE', currency: 'INR', aiScore: 77 },
    { symbol: 'ASIANPAINT', name: 'Asian Paints', price: 3150.40, change: -45.60, changePercent: -1.43, volume: '0.9M', marketCap: '3.0T', exchange: 'NSE', currency: 'INR', aiScore: 75 },
    { symbol: 'MARUTI', name: 'Maruti Suzuki', price: 9850.00, change: 180.50, changePercent: 1.87, volume: '0.5M', marketCap: '2.9T', exchange: 'NSE', currency: 'INR', aiScore: 84 },
    { symbol: 'SUNPHARMA', name: 'Sun Pharma', price: 1420.75, change: 28.90, changePercent: 2.08, volume: '3.8M', marketCap: '3.4T', exchange: 'NSE', currency: 'INR', aiScore: 81 },
    { symbol: 'TATAMOTORS', name: 'Tata Motors', price: 780.50, change: 35.20, changePercent: 4.72, volume: '25.4M', marketCap: '2.6T', exchange: 'NSE', currency: 'INR', aiScore: 86 },
    { symbol: 'ADANIENT', name: 'Adani Enterprises', price: 2180.30, change: -120.50, changePercent: -5.23, volume: '8.9M', marketCap: '2.5T', exchange: 'NSE', currency: 'INR', aiScore: 65 },
    { symbol: 'BAJFINANCE', name: 'Bajaj Finance', price: 6850.60, change: 125.40, changePercent: 1.87, volume: '1.2M', marketCap: '4.1T', exchange: 'NSE', currency: 'INR', aiScore: 87 },
    { symbol: 'WIPRO', name: 'Wipro', price: 285.40, change: 5.60, changePercent: 2.00, volume: '8.3M', marketCap: '1.5T', exchange: 'NSE', currency: 'INR', aiScore: 72 },
    { symbol: 'SENSEX', name: 'Sensex Index', price: 72500.30, change: 850.20, changePercent: 1.19, volume: '-', marketCap: '-', exchange: 'BSE', currency: 'INR', aiScore: 85 }
  ];
}
