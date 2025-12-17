import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import PriceChart from "./PriceChart";
import PriceAlertForm from "./PriceAlertForm";
import { useAuth } from "@/hooks/useAuth";

export interface ProductData {
  id?: string;
  title: string;
  currentPrice: number;
  currency: string;
  url: string;
  priceHistory: { date: string; price: number }[];
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
}

interface ProductDisplayProps {
  product: ProductData;
}

const ProductDisplay = ({ product }: ProductDisplayProps) => {
  const { user } = useAuth();
  const priceChange = product.currentPrice - product.averagePrice;
  const priceChangePercent = ((priceChange / product.averagePrice) * 100).toFixed(1);
  const isGoodDeal = product.currentPrice <= product.lowestPrice * 1.05;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 md:p-8 bg-card border-border">
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-2 line-clamp-2">
                    {product.title}
                  </h2>
                  <a 
                    href={product.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    View on store →
                  </a>
                </div>
                {isGoodDeal && (
                  <Badge variant="default" className="bg-accent text-accent-foreground">
                    Great Deal!
                  </Badge>
                )}
              </div>

              {/* Price Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Current Price</p>
                  <p className="font-display text-2xl font-bold text-foreground">
                    {product.currency}{product.currentPrice.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {priceChange < 0 ? (
                      <TrendingDown className="w-4 h-4 text-green-500" />
                    ) : priceChange > 0 ? (
                      <TrendingUp className="w-4 h-4 text-red-500" />
                    ) : (
                      <Minus className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className={`text-xs ${priceChange < 0 ? 'text-green-500' : priceChange > 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                      {priceChange < 0 ? '' : '+'}{priceChangePercent}% vs avg
                    </span>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Lowest Price</p>
                  <p className="font-display text-2xl font-bold text-green-500">
                    {product.currency}{product.lowestPrice.toLocaleString()}
                  </p>
                </div>

                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Highest Price</p>
                  <p className="font-display text-2xl font-bold text-red-500">
                    {product.currency}{product.highestPrice.toLocaleString()}
                  </p>
                </div>

                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Average Price</p>
                  <p className="font-display text-2xl font-bold text-foreground">
                    {product.currency}{product.averagePrice.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Price Alert Form */}
              {product.id && user && (
                <div className="border-t border-border pt-6">
                  <PriceAlertForm
                    productId={product.id}
                    productTitle={product.title}
                    productUrl={product.url}
                    currentPrice={product.currentPrice}
                    currency={product.currency}
                  />
                </div>
              )}

              {!user && (
                <div className="border-t border-border pt-6">
                  <p className="text-sm text-muted-foreground text-center">
                    <a href="/auth" className="text-accent hover:underline">Sign in</a> to set price alerts and save products
                  </p>
                </div>
              )}

              {/* Price Chart */}
              <div className="mt-4">
                <h3 className="font-display font-semibold text-lg text-foreground mb-4">Price History</h3>
                <PriceChart data={product.priceHistory} currency={product.currency} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProductDisplay;
