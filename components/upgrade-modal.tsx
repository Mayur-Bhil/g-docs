"use client";

import { useState } from "react";
import { X, Zap, FileText, Users, Clock, Shield } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  docCount: number;
}

const FEATURES = [
  { icon: FileText, text: "Unlimited documents" },
  { icon: Users, text: "Real-time collaboration" },
  { icon: Clock, text: "Version history" },
  { icon: Shield, text: "Priority support" },
];

export const UpgradeModal = ({
  isOpen,
  onClose,
  docCount,
}: UpgradeModalProps) => {
  const [loading, setLoading] = useState<string | null>(null);

  if (!isOpen) return null;

  const PLANS = [
    {
      label: "Monthly",
      price: "$5",
      period: "/mo",
      sub: null,
      badge: null,
      priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID ?? "",
    },
    {
      label: "Yearly",
      price: "$4",
      period: "/mo",
      sub: "billed $48/year",
      badge: "Save 20%",
      priceId: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID ?? "",
    },
  ];

  const handleUpgrade = async (priceId: string) => {
    if (!priceId) {
      alert("Pricing not configured yet.");
      return;
    }
    setLoading(priceId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Something went wrong. Please try again.");
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[460px] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#1a73e8] to-[#0d47a1] px-8 py-7 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center mb-4">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <h2 className="text-xl font-semibold mb-1.5">Upgrade to Pro</h2>
          <p className="text-blue-100 text-sm leading-relaxed">
            You've used{" "}
            <span className="text-white font-semibold">{docCount} of 10</span>{" "}
            free documents. Unlock unlimited creation.
          </p>
        </div>

        {/* Features */}
        <div className="px-8 py-5 border-b border-[#f1f3f4]">
          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#e8f0fe] flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-[#1a73e8]" />
                </div>
                <span className="text-[13px] text-[#444746]">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-2 gap-3 mb-5">
            {PLANS.map((plan) => (
              <button
                key={plan.label}
                onClick={() => handleUpgrade(plan.priceId)}
                disabled={!!loading}
                className="relative border-2 border-[#dadce0] hover:border-[#1a73e8] hover:bg-[#f8f9ff] rounded-xl p-4 text-left transition-all disabled:opacity-60 disabled:cursor-not-allowed group"
              >
                {plan.badge && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#34a853] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </span>
                )}
                <p className="text-[11px] font-semibold text-[#5f6368] mb-1.5 uppercase tracking-wide">
                  {plan.label}
                </p>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-[26px] font-bold text-[#202124] group-hover:text-[#1a73e8] transition-colors leading-none">
                    {plan.price}
                  </span>
                  <span className="text-xs text-[#5f6368]">{plan.period}</span>
                </div>
                {plan.sub && (
                  <p className="text-[10px] text-[#9aa0a6] mt-1">{plan.sub}</p>
                )}
                {loading === plan.priceId && (
                  <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-center text-[#9aa0a6]">
            Cancel anytime · Secure payment by Stripe · Test mode active
          </p>
        </div>
      </div>
    </div>
  );
};