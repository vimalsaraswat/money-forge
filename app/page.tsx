import Link from "next/link";
import { SignIn } from "@/components/auth";
import { auth } from "@/auth";
import Image from "next/image";
import {
  ArrowRightIcon,
  BellIcon,
  BrainCircuit,
  ChevronRightIcon,
  CircleDollarSignIcon,
  PieChartIcon,
  ShieldIcon,
  SparklesIcon,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import SampleLineChart from "@/components/landing-page/line-chart";

export default async function LandingPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="min-h-screen bg-transparent text-white relative">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-8">
            <Alert className="inline-flex w-fit items-center px-4 py-2 rounded-full glass-card text-accent animate-fade-in">
              <SparklesIcon className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">
                AI-Powered Financial Insights
              </span>
            </Alert>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-white via-emerald-200 to-blue-200 bg-clip-text text-transparent">
              Master Your Finances with Smart Technology
            </h1>
            <p className="text-xl text-gray-300">
              Transform your financial future with intelligent tracking, smart
              budgeting, and AI-driven recommendations tailored just for you.
            </p>
            <div className="flex flex-col items-center sm:flex-row gap-4">
              {user ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 group"
                >
                  Dashboard
                </Link>
              ) : (
                <SignIn
                  variant="outline"
                  className="inline-flex items-center h-16 justify-center bg-primary/80 text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 group"
                >
                  <Image
                    className="mr-2 group-hover:-translate-x-1 transition-transform drop-shadow-xl"
                    src="/icons/google.svg"
                    alt="Google Logo"
                    width={24}
                    height={24}
                  />
                  Start Your Journey
                </SignIn>
              )}
              <a
                href="#features"
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 group"
              >
                Learn More
                <ChevronRightIcon className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
          <div className="lg:w-1/2">
            <SampleLineChart />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="relative py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
              Powerful Features for Your Financial Success
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of personal finance management with our
              comprehensive suite of tools and features.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <TrendingUp className="h-6 w-6 text-accent" />,
                title: "Smart Analytics",
                description:
                  "Visualize your spending patterns with interactive charts and get actionable insights.",
              },
              {
                icon: <BrainCircuit className="h-6 w-6 text-accent" />,
                title: "AI Assistant",
                description:
                  "Get personalized financial advice from our advanced AI-powered chat system.",
              },
              {
                icon: <BellIcon className="h-6 w-6 text-accent" />,
                title: "Smart Alerts",
                description:
                  "Stay informed with customizable notifications for budgets and investments.",
              },
              {
                icon: <CircleDollarSignIcon className="h-6 w-6 text-accent" />,
                title: "Budget Tracking",
                description:
                  "Set and monitor budgets with intelligent categorization and insights.",
              },
              {
                icon: <PieChartIcon className="h-6 w-6 text-accent" />,
                title: "Portfolio Management",
                description:
                  "Track and optimize your investment portfolio with real-time data.",
              },
              {
                icon: <ShieldIcon className="h-6 w-6 text-accent" />,
                title: "Bank-Grade Security",
                description:
                  "Your data is protected with enterprise-level encryption and security.",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="rounded-2xl hover:bg-white/5 transition-all duration-300 transform hover:scale-[1.02] group"
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-20">
        <Card className="rounded-2xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 opacity-50" />
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
              Ready to Transform Your Financial Future?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already mastering their finances
              with MoneyForge's intelligent tools.
            </p>
            <Link
              href="/api/auth/signin"
              className="inline-flex items-center justify-center  bg-white/10 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] hover:bg-emerald-500/20 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 group"
            >
              Get Started Now
              <ArrowRightIcon className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
  s;
}
