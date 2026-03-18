"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Zap } from "lucide-react";

export const ManageSubscription = () => {
  const sub = useQuery(api.subscriptions.getSubscription);
  const [loading, setLoading] = useState(false);

  const isPro = sub?.plan === "pro" && sub?.status === "active";

  const handleManage = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Could not open billing portal.");
    } catch {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!isPro) return null;

  return (
    <button
      onClick={handleManage}
      disabled={loading}
      className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#1a73e8] border border-[#dadce0] rounded-full hover:bg-[#f8f9ff] transition-colors disabled:opacity-60"
    >
      {loading ? (
        <div className="w-3.5 h-3.5 border-2 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
      ) : (
        <Zap className="w-3.5 h-3.5 fill-[#1a73e8]" />
      )}
      Pro Plan
    </button>
  );
};