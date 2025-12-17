import { 
  Shield, 
  Zap, 
  Globe, 
  Clock, 
  Smartphone, 
  PieChart 
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "100+ Supported Stores",
    description: "Track prices from Amazon, eBay, Walmart, Best Buy, Target, and many more retailers.",
  },
  {
    icon: Zap,
    title: "Real-Time Tracking",
    description: "Prices are updated multiple times daily to ensure you never miss a deal.",
  },
  {
    icon: Clock,
    title: "Price History",
    description: "View up to 12 months of historical price data to make informed decisions.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is encrypted and we never share your information with third parties.",
  },
  {
    icon: Smartphone,
    title: "Works Everywhere",
    description: "Access your tracked products from any device - desktop, tablet, or mobile.",
  },
  {
    icon: PieChart,
    title: "Price Analytics",
    description: "Get insights on price trends, best time to buy, and potential savings.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to track prices and save money on your online purchases.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl border border-border bg-card hover:border-accent/30 hover:shadow-card-hover transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center mb-4 transition-colors">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
