import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface PriceAlertFormProps {
  productId: string;
  currentPrice: number;
  currency: string;
  onAlertSet?: (targetPrice: number) => void;
}

const PriceAlertForm = ({ productId, currentPrice, currency, onAlertSet }: PriceAlertFormProps) => {
  const [targetPrice, setTargetPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertSet, setAlertSet] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSetAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to set price alerts.",
        variant: "destructive",
      });
      return;
    }

    const target = parseFloat(targetPrice);
    if (isNaN(target) || target <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid target price.",
        variant: "destructive",
      });
      return;
    }

    if (target >= currentPrice) {
      toast({
        title: "Invalid target",
        description: "Target price should be lower than current price.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("price_alerts").insert({
        product_id: productId,
        user_id: user.id,
        target_price: target,
      });

      if (error) throw error;

      setAlertSet(true);
      onAlertSet?.(target);
      toast({
        title: "Alert set!",
        description: `We'll notify you when the price drops below ${currency}${target.toLocaleString()}`,
      });
    } catch (error: any) {
      console.error("Error setting alert:", error);
      toast({
        title: "Error",
        description: "Failed to set price alert. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (alertSet) {
    return (
      <div className="flex items-center gap-2 text-green-500 bg-green-500/10 rounded-lg p-3">
        <Check className="w-5 h-5" />
        <span className="text-sm font-medium">
          Alert set for {currency}{parseFloat(targetPrice).toLocaleString()}
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSetAlert} className="space-y-3">
      <Label className="text-sm text-muted-foreground">Set Price Alert</Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {currency}
          </span>
          <Input
            type="number"
            step="0.01"
            placeholder={`Below ${currentPrice}`}
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            className="pl-8 bg-background border-border"
          />
        </div>
        <Button type="submit" disabled={loading} className="bg-accent hover:bg-accent/90">
          <Bell className="w-4 h-4 mr-2" />
          {loading ? "Setting..." : "Alert Me"}
        </Button>
      </div>
    </form>
  );
};

export default PriceAlertForm;
