import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import ProductDisplay, { ProductData } from "@/components/ProductDisplay";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { parseProductFromMarkdown, generatePriceHistory, calculatePriceStats } from "@/lib/priceParser";

const Index = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrackUrl = async (url: string) => {
    // Validate URL
    try {
      new URL(url);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid product URL.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    toast({
      title: "Scraping Product",
      description: "Fetching product information...",
    });

    try {
      const { data, error } = await supabase.functions.invoke('firecrawl-scrape', {
        body: { url },
      });

      if (error) {
        throw error;
      }

      if (data?.success && data?.data) {
        const scrapedData = data.data;
        console.log("Scraped product data:", scrapedData);
        
        // Parse product info from scraped data
        const parsed = parseProductFromMarkdown(
          scrapedData.markdown || '',
          scrapedData.metadata || {}
        );

        if (parsed.currentPrice === 0) {
          toast({
            title: "Price Not Found",
            description: "Could not extract price from this page. Try a different product URL.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        // Generate price history and calculate stats
        const priceHistory = generatePriceHistory(parsed.currentPrice);
        const stats = calculatePriceStats(priceHistory);

        let productId: string | undefined;

        // Save to database if user is logged in
        if (user) {
          const { data: savedProduct, error: saveError } = await supabase
            .from("tracked_products")
            .insert({
              user_id: user.id,
              url: url,
              title: parsed.title,
              current_price: parsed.currentPrice,
            })
            .select()
            .single();

          if (saveError) {
            console.error("Error saving product:", saveError);
          } else {
            productId = savedProduct.id;
            
            // Save initial price history
            await supabase.from("price_history").insert({
              product_id: productId,
              price: parsed.currentPrice,
            });
          }
        }

        const productData: ProductData = {
          id: productId,
          title: parsed.title,
          currentPrice: parsed.currentPrice,
          currency: parsed.currency,
          url: url,
          priceHistory,
          ...stats,
        };

        setProduct(productData);
        toast({
          title: "Product Tracked!",
          description: `Now tracking: ${parsed.title.substring(0, 50)}...`,
        });
      } else {
        toast({
          title: "Scraping Failed",
          description: data?.error || "Could not extract product information",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error scraping:", error);
      toast({
        title: "Error",
        description: "Failed to scrape product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero onTrackUrl={handleTrackUrl} />
        {product && <ProductDisplay product={product} />}
        <HowItWorks />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
