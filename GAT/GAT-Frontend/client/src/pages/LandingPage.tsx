import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  ArrowLeftRight,
  Activity,
  BarChart3,
  CheckCircle,
  ChevronDown,
  DollarSign,
  Globe,
  Lock,
  Menu,
  Shield,
  Star,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ThemeName = "cyan" | "violet" | "amber";

interface StatItem {
  label: string;
  value: string;
}

interface ModuleItem {
  title: string;
  desc: string;
  features: string[];
  icon: typeof ArrowLeftRight;
  theme: ThemeName;
}

interface FeatureItem {
  title: string;
  desc: string;
  icon: typeof Shield;
}

const stats: StatItem[] = [
  { label: "Total Volume Traded", value: "$12M+" },
  { label: "Active Traders", value: "2,400+" },
  { label: "Average Monthly ROI", value: "18-34%" },
  { label: "Uptime", value: "99.99%" },
];

const modules: ModuleItem[] = [
  {
    icon: ArrowLeftRight,
    theme: "cyan",
    title: "Arbitrage Engine",
    desc:
      "Automatically scans cross-exchange price differences and executes opportunistic trades across supported exchanges with tight risk controls.",
    features: ["Cross-exchange scanning", "Auto-execution", "Slippage protection", "Live P&L tracking"],
  },
  {
    icon: TrendingUp,
    theme: "violet",
    title: "Futures Trading",
    desc:
      "Trend-following futures workflows with leverage controls, signal generation, and automated stop-loss management.",
    features: ["Leverage controls", "Signal engine", "Auto stop-loss", "Long & short positions"],
  },
  {
    icon: DollarSign,
    theme: "amber",
    title: "Forex Trading",
    desc:
      "Structured forex strategies built around smart money concepts, liquidity sweeps, and disciplined entries and exits.",
    features: ["Major currency pairs", "SMC / ICT strategy", "All market sessions", "Liquidity sweep detection"],
  },
];

const features: FeatureItem[] = [
  {
    icon: Shield,
    title: "Security Controls",
    desc: "Session checks, protected routes, and safer account handling across the platform.",
  },
  {
    icon: Zap,
    title: "Fast Execution",
    desc: "Responsive UI flows built to keep users moving from onboarding to trading without friction.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    desc: "Operational visibility with trading dashboards and performance summaries.",
  },
  {
    icon: Globe,
    title: "Multi-Module Access",
    desc: "Arbitrage, futures, and forex modules available from one unified application.",
  },
  {
    icon: Lock,
    title: "Risk Management",
    desc: "Guardrails designed to keep account actions and trade flows predictable.",
  },
  {
    icon: Activity,
    title: "24/7 Availability",
    desc: "Built for continuous use across desktop and mobile browsers.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$299",
    period: "/mo",
    features: ["1 Trading Module", "1 Exchange API", "Basic Analytics", "Email Support"],
    highlight: false,
  },
  {
    name: "Pro",
    price: "$1,499",
    period: "/yr",
    features: ["All 3 Modules", "Unlimited Exchanges", "Advanced Analytics", "Priority Support"],
    highlight: true,
  },
  {
    name: "Elite",
    price: "Custom",
    period: "",
    features: ["Dedicated Support", "Custom Strategy Builder", "White-label Option", "VIP Access"],
    highlight: false,
  },
];

const testimonials = [
  { name: "Marcus T.", role: "Full-time Trader", text: "The platform layout is clean and easy to follow. I can get to the modules quickly.", stars: 5 },
  { name: "Sophia K.", role: "Crypto Fund Manager", text: "The interface feels more premium now and still keeps the same flows I use daily.", stars: 5 },
  { name: "David O.", role: "Retail Investor", text: "The landing page is easier to read on desktop and mobile, and the navigation still works as expected.", stars: 5 },
];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const themeStyles: Record<ThemeName, { border: string; bg: string; icon: string; glow: string }> = {
  cyan: {
    border: "border-cyan-400/20",
    bg: "bg-cyan-400/10",
    icon: "text-cyan-400",
    glow: "group-hover:shadow-cyan-400/20",
  },
  violet: {
    border: "border-violet-400/20",
    bg: "bg-violet-400/10",
    icon: "text-violet-400",
    glow: "group-hover:shadow-violet-400/20",
  },
  amber: {
    border: "border-amber-400/20",
    bg: "bg-amber-400/10",
    icon: "text-amber-400",
    glow: "group-hover:shadow-amber-400/20",
  },
};

function FeatureCard({ feature }: { feature: FeatureItem }) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -4 }}
      className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-all duration-300"
    >
      <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center mb-4">
        <feature.icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="font-grotesk font-600 text-foreground mb-2">{feature.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
    </motion.div>
  );
}

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300",
          isScrolled ? "glass" : "bg-transparent border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="font-grotesk font-700 text-foreground text-lg">
              GAT <span className="text-primary">Platform</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <button onClick={() => scrollToSection("modules")} className="hover:text-foreground transition-colors">
              Modules
            </button>
            <button onClick={() => scrollToSection("features")} className="hover:text-foreground transition-colors">
              Features
            </button>
            <button onClick={() => scrollToSection("pricing")} className="hover:text-foreground transition-colors">
              Pricing
            </button>
            <button onClick={() => scrollToSection("testimonials")} className="hover:text-foreground transition-colors">
              Reviews
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleLogin} className="text-muted-foreground hover:text-foreground text-sm">
              Sign In
            </Button>
            <Button size="sm" onClick={handleLogin} className="bg-primary text-primary-foreground gap-1.5 text-sm">
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          <button className="md:hidden text-muted-foreground" onClick={() => setMobileMenuOpen((v) => !v)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        <div className={cn("md:hidden overflow-hidden border-b border-border bg-background/95", mobileMenuOpen ? "block" : "hidden")}>
          <div className="px-4 py-4 flex flex-col gap-3">
            <button onClick={() => scrollToSection("modules")} className="text-left py-2 text-muted-foreground">
              Modules
            </button>
            <button onClick={() => scrollToSection("features")} className="text-left py-2 text-muted-foreground">
              Features
            </button>
            <button onClick={() => scrollToSection("pricing")} className="text-left py-2 text-muted-foreground">
              Pricing
            </button>
            <button onClick={() => scrollToSection("testimonials")} className="text-left py-2 text-muted-foreground">
              Reviews
            </button>
            <Button onClick={handleLogin} className="mt-2 bg-primary text-primary-foreground">
              Get Started
            </Button>
          </div>
        </div>
      </motion.nav>

      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium uppercase tracking-wider mb-6"
            >
              <Zap className="w-3 h-3" /> Institutional-Grade Automated Trading
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-grotesk font-800 text-foreground leading-tight mb-6">
              GODSLOVE
              <br />
              <span className="text-primary glow-text">AUTO TRADING</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4 leading-relaxed">
              The most advanced multi-strategy algorithmic trading platform, combining
              <span className="text-foreground font-medium"> Arbitrage</span>,
              <span className="text-foreground font-medium"> Futures</span>, and
              <span className="text-foreground font-medium"> Forex</span> engines in one unified ecosystem.
            </motion.p>

            <motion.p variants={fadeInUp} className="text-base text-muted-foreground max-w-2xl mx-auto mb-10">
              Let AI work while you sleep. The platform keeps the current navigation and account flow intact.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button size="lg" onClick={handleLogin} className="bg-primary text-primary-foreground gap-2 px-8 py-6 text-base font-medium glow-primary">
                Start Trading Now <ArrowRight className="w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => scrollToSection("features")} className="border-border text-foreground px-8 py-6 text-base">
                View Features
              </Button>
            </motion.div>

            <motion.div variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {stats.map((stat) => (
                <motion.div key={stat.label} variants={fadeInUp} className="bg-card border border-border rounded-xl p-4">
                  <p className="text-2xl font-grotesk font-700 text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <div className="flex justify-center mt-16 animate-bounce">
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </div>
      </section>

      <section id="modules" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-secondary text-muted-foreground border-border text-xs uppercase tracking-wider">Trading Engines</Badge>
            <h2 className="text-4xl font-grotesk font-700 text-foreground mb-4">Three Engines. One Platform.</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Each module is a standalone profit center, available from the same experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modules.map((module) => {
              const styles = themeStyles[module.theme];
              const Icon = module.icon;

              return (
                <div key={module.title} className={cn("group bg-card border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg", styles.border, styles.glow)}>
                  <div className={cn("w-12 h-12 border rounded-xl flex items-center justify-center mb-5", styles.bg, styles.border)}>
                    <Icon className={cn("w-6 h-6", styles.icon)} />
                  </div>
                  <h3 className="font-grotesk font-600 text-foreground text-lg mb-3">{module.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{module.desc}</p>
                  <ul className="space-y-2">
                    {module.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className={cn("w-3.5 h-3.5 flex-shrink-0", styles.icon)} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-secondary text-muted-foreground border-border text-xs uppercase tracking-wider">Why GAT</Badge>
            <h2 className="text-4xl font-grotesk font-700 text-foreground mb-4">Built for Serious Traders</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Enterprise-grade structure with a cleaner, easier-to-scan visual hierarchy.</p>
          </div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-secondary text-muted-foreground border-border text-xs uppercase tracking-wider">How It Works</Badge>
          <h2 className="text-4xl font-grotesk font-700 text-foreground mb-14">Start in 3 Simple Steps</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            {[
              { step: "01", title: "Create Account", desc: "Sign up and complete identity verification in under 5 minutes." },
              { step: "02", title: "Fund & Configure", desc: "Deposit funds, select your modules, and set your risk parameters." },
              { step: "03", title: "Let GAT Trade", desc: "Activate your engines and monitor the platform from anywhere." },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <span className="font-grotesk font-700 text-primary text-xl">{item.step}</span>
                </div>
                <h3 className="font-grotesk font-600 text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-secondary text-muted-foreground border-border text-xs uppercase tracking-wider">Pricing</Badge>
            <h2 className="text-4xl font-grotesk font-700 text-foreground mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">No hidden fees. No performance cuts. Just a clear subscription model.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "relative rounded-2xl p-6 border flex flex-col",
                  plan.highlight ? "bg-primary/5 border-primary/40 shadow-lg shadow-primary/10" : "bg-card border-border"
                )}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground text-xs px-3">Most Popular</Badge>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="font-grotesk font-600 text-foreground text-lg mb-2">{plan.name}</h3>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-grotesk font-700 text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground text-sm mb-1">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 flex-1 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button onClick={handleLogin} variant={plan.highlight ? "default" : "outline"} className={cn("w-full", plan.highlight ? "bg-primary text-primary-foreground" : "border-border")}>
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-secondary text-muted-foreground border-border text-xs uppercase tracking-wider">Testimonials</Badge>
            <h2 className="text-4xl font-grotesk font-700 text-foreground mb-4">Trusted by Traders Worldwide</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-card border border-border rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: testimonial.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">"{testimonial.text}"</p>
                <div>
                  <p className="font-medium text-sm text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-card border border-primary/20 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/3 rounded-3xl" />
            <div className="relative z-10">
              <Zap className="w-12 h-12 text-primary mx-auto mb-5" />
              <h2 className="text-4xl font-grotesk font-700 text-foreground mb-4">Ready to Automate Your Workflow?</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                The current app flow stays the same. This page only changes the landing presentation.
              </p>
              <Button size="lg" onClick={handleLogin} className="bg-primary text-primary-foreground gap-2 px-10 py-6 text-base glow-primary">
                Create Free Account <ArrowRight className="w-5 h-5" />
              </Button>
              <p className="text-xs text-muted-foreground mt-4">No credit card required · 7-day free trial · Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-grotesk font-600 text-foreground">GODSLOVE AUTO TRADING</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            © 2026 GODSLOVE AUTO TRADING. All rights reserved. Trading involves risk. Past performance is not indicative of future results.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/support" className="hover:text-foreground transition-colors">
              Support
            </Link>
            <Link href="/admin-login" className="hover:text-foreground transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
