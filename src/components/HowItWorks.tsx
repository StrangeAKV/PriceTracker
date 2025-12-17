import { Link2, BarChart3, Bell, DollarSign } from "lucide-react";

const steps = [
  {
    icon: Link2,
    title: "Paste URL",
    description: "Copy any product URL from your favorite online store and paste it into our tracker.",
  },
  {
    icon: BarChart3,
    title: "View History",
    description: "Instantly see price trends, lowest, average, and highest prices over time.",
  },
  {
    icon: Bell,
    title: "Set Alerts",
    description: "Define your target price and we'll monitor it 24/7 for you.",
  },
  {
    icon: DollarSign,
    title: "Save Money",
    description: "Get notified via email when prices drop and save on every purchase.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start saving money in 4 simple steps. No registration required.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-border" />
              )}

              <div className="relative bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 h-full">
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>

                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <step.icon className="w-7 h-7 text-accent" />
                </div>

                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
