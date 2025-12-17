import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PriceAlertRequest {
  email: string;
  productTitle: string;
  productUrl: string;
  currentPrice: number;
  targetPrice: number;
  currency: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, productTitle, productUrl, currentPrice, targetPrice, currency }: PriceAlertRequest = await req.json();

    console.log(`Sending price alert to ${email} for product: ${productTitle}`);

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .price-box { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .current-price { font-size: 32px; font-weight: bold; color: #10b981; }
          .target-price { font-size: 18px; color: #6b7280; }
          .btn { display: inline-block; background: #667eea; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
          .footer { text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Price Drop Alert!</h1>
          </div>
          <div class="content">
            <p>Great news! The price for your tracked product has dropped below your target price.</p>
            
            <h3>${productTitle}</h3>
            
            <div class="price-box">
              <div class="current-price">${currency}${currentPrice.toLocaleString()}</div>
              <div class="target-price">Your target: ${currency}${targetPrice.toLocaleString()}</div>
            </div>
            
            <p>Don't miss out on this deal!</p>
            
            <center>
              <a href="${productUrl}" class="btn">View Product</a>
            </center>
            
            <div class="footer">
              <p>You received this email because you set up a price alert on Price Tracker.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Price Tracker <onboarding@resend.dev>",
        to: [email],
        subject: `🎉 Price Drop Alert: ${productTitle.substring(0, 50)}...`,
        html: emailHtml,
      }),
    });

    const data = await res.json();
    
    if (!res.ok) {
      console.error("Resend API error:", data);
      throw new Error(data.message || "Failed to send email");
    }

    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending price alert email:", errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
