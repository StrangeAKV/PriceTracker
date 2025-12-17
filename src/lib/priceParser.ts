export interface ParsedProduct {
  title: string;
  currentPrice: number;
  currency: string;
}

export function parseProductFromMarkdown(markdown: string, metadata: any): ParsedProduct {
  // Extract title from metadata or markdown
  let title = metadata?.title || metadata?.ogTitle || '';
  
  // Clean up common title suffixes
  title = title
    .replace(/\s*[|\-–—]\s*(Amazon\.in|Amazon\.com|eBay|Walmart|Best Buy).*$/i, '')
    .replace(/\s*:\s*Buy\s+.*$/i, '')
    .replace(/\s*Online at Low Prices.*$/i, '')
    .trim();

  // Extract price - look for common price patterns
  let currentPrice = 0;
  let currency = '₹';

  // Try to find price in markdown
  // Common patterns: ₹2,489.00, $99.99, €49,99
  const pricePatterns = [
    /₹\s*([\d,]+(?:\.\d{2})?)/,
    /\$\s*([\d,]+(?:\.\d{2})?)/,
    /€\s*([\d,]+(?:[.,]\d{2})?)/,
    /Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
    /INR\s*([\d,]+(?:\.\d{2})?)/i,
  ];

  const currencyMap: Record<string, string> = {
    '₹': '₹',
    '$': '$',
    '€': '€',
    'Rs': '₹',
    'INR': '₹',
  };

  for (const pattern of pricePatterns) {
    const match = markdown.match(pattern);
    if (match) {
      const priceStr = match[1].replace(/,/g, '');
      currentPrice = parseFloat(priceStr);
      
      // Determine currency
      const currencyMatch = match[0].match(/^[₹$€]|Rs\.?|INR/i);
      if (currencyMatch) {
        const key = currencyMatch[0].replace('.', '');
        currency = currencyMap[key] || key;
      }
      break;
    }
  }

  return {
    title: title || 'Unknown Product',
    currentPrice,
    currency,
  };
}

export function generatePriceHistory(currentPrice: number): { date: string; price: number }[] {
  const history: { date: string; price: number }[] = [];
  const today = new Date();
  
  // Generate 30 days of price history with realistic variations
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Create realistic price fluctuations (±15% from current price)
    const variation = (Math.random() - 0.5) * 0.3; // -15% to +15%
    const price = Math.round(currentPrice * (1 + variation));
    
    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.max(price, Math.round(currentPrice * 0.7)), // Ensure price doesn't go too low
    });
  }
  
  // Set the last price to current price
  if (history.length > 0) {
    history[history.length - 1].price = currentPrice;
  }
  
  return history;
}

export function calculatePriceStats(priceHistory: { date: string; price: number }[]) {
  const prices = priceHistory.map(p => p.price);
  
  return {
    lowestPrice: Math.min(...prices),
    highestPrice: Math.max(...prices),
    averagePrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
  };
}
