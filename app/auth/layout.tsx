"use client";

import { Suspense } from "react";
import {
  Brain,
  BarChart3,
  Sparkles,
  Target,
  AlertTriangle,
} from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const features = [
    {
      icon: Brain,
      text: "Predictive Student Analytics",
    },
    {
      icon: BarChart3,
      text: "Real-Time Performance Insights",
    },
    {
      icon: Sparkles,
      text: "AI-Powered Reports",
    },
    {
      icon: Target,
      text: "Personalized Learning Paths",
    },
    {
      icon: AlertTriangle,
      text: "Early Risk Detection",
    },
  ];

  return (
    <div className="w-screen h-screen bg-[#fafafa] flex relative border-t-4 border-b-4 border-r-4 border-[#1e3a8a] font-outfit">
      {/* Left Section - Branding & Features */}
      <div className="hidden md:flex lg:w-3/5 h-full bg-[#f4f1e9] px-12 py-10 flex-col relative tracking-wide">
        {/* Main Content - Centered */}
        <div className="flex-1 flex flex-col justify-center space-y-8">
          {/* Headings */}
          <div className="space-y-4">
            <h2 className="text-5xl font-bold text-gray-900 leading-tight">
              Your School, Powered by AI
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
              Automated attendance, predictive performance insights, and
              personalized learning — all in one system.
            </p>
          </div>

          {/* Floating Feature Pills */}
          <div className="relative mt-12 min-h-[300px]">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              // Position pills in a more natural, floating arrangement
              const positions = [
                { top: "0%", left: "0%" },
                { top: "20%", left: "15%" },
                { top: "40%", left: "5%" },
                { top: "60%", left: "20%" },
                { top: "80%", left: "10%" },
              ];
              return (
                <div
                  key={index}
                  className="absolute inline-flex items-center gap-3 bg-[#1e3a8a] text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  style={{
                    top: positions[index].top,
                    left: positions[index].left,
                  }}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-semibold whitespace-nowrap">
                    {feature.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Decorative Icons - Bottom */}
        <div className="flex w-full gap-6 items-center justify-around pb-4">
          {[Brain, BarChart3, Target, AlertTriangle, Sparkles].map(
            (Icon, index) => (
              <Icon key={index} className="w-8 h-8 text-[#1e3a8a] opacity-60" />
            )
          )}
        </div>
      </div>

      {/* Right Section - Auth Form */}
      <div className="w-full lg:w-1/2 h-full bg-[#fafafa] flex flex-col items-center justify-center px-6 py-8">
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </div>
    </div>
  );
}
