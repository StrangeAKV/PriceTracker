import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, TrendingDown, Bell, BarChart3 } from "lucide-react";

interface HeroProps {
  onTrackUrl: (url: string) => void;
}

const Hero = ({ onTrackUrl }: HeroProps) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onTrackUrl(url.trim());
      setUrl("");
    }
  };

  return (
    <section className="relative min-h-[90vh] bg-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-8 animate-fade-in">
            <TrendingDown className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-primary-foreground/90">
              Track prices across mutliple stores
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-slide-up">
            Never Miss a{" "}
            <span className="text-accent">Price Drop</span>{" "}
            Again
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/70 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Paste any product URL to track its price history. Get instant alerts when prices drop below your target. Save money effortlessly.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-12 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="url"
                placeholder="Paste product URL from Amazon, eBay, Walmart..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-14 pl-12 pr-4 text-base bg-card border-0 shadow-xl rounded-xl"
              />
            </div>
            <Button type="submit" variant="hero" size="xl" className="group">
              Track Price
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-20 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <div className="bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-2xl p-6 text-left">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-display font-semibold text-lg text-primary-foreground mb-2">
              Price History Charts
            </h3>
            <p className="text-sm text-primary-foreground/60">
              View detailed price trends with lowest, average, and highest prices over time.
            </p>
          </div>

          <div className="bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-2xl p-6 text-left">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
              <Bell className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-display font-semibold text-lg text-primary-foreground mb-2">
              Smart Price Alerts
            </h3>
            <p className="text-sm text-primary-foreground/60">
              Set your target price and get instant email notifications when it drops.
            </p>
          </div>

          <div className="bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-2xl p-6 text-left">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
              <TrendingDown className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-display font-semibold text-lg text-primary-foreground mb-2">
              Multi-Store Support
            </h3>
            <p className="text-sm text-primary-foreground/60">
              Track prices from Amazon, eBay, Walmart, Best Buy, and 100+ more stores.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
