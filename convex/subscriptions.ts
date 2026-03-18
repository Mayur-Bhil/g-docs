import { query, mutation } from "./_generated/server"; // ✅ mutation not internalMutation
import { v } from "convex/values";

export const getSubscription = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return null;

    const sub = await ctx.db
      .query("subscriptions")
      .withIndex("by_user_id", (q) => q.eq("userId", user.subject))
      .first();

    return sub ?? { plan: "free" as const, status: "active" as const };
  },
});

export const getDocumentCount = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return 0;

    const docs = await ctx.db
      .query("documents")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", user.subject))
      .collect();

    return docs.length;
  },
});

export const canCreateDocument = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return false;

    const sub = await ctx.db
      .query("subscriptions")
      .withIndex("by_user_id", (q) => q.eq("userId", user.subject))
      .first();

    const isPro =
      sub?.plan === "pro" &&
      (sub.status === "active" ||
        sub.status === "trialing" ||
        sub.status === "past_due");

    if (isPro) return true;

    const docs = await ctx.db
      .query("documents")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", user.subject))
      .collect();

    return docs.length < 10;
  },
});

export const upsertSubscription = mutation({ // ✅ public mutation
  args: {
    userId: v.string(),
    plan: v.union(v.literal("free"), v.literal("pro")),
    status: v.union(
      v.literal("active"),
      v.literal("cancelled"),
      v.literal("past_due"),
      v.literal("trialing")
    ),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    stripePriceId: v.optional(v.string()),
    currentPeriodEnd: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    const patch = Object.fromEntries(
      Object.entries(args).filter(([, val]) => val !== undefined)
    );

    if (existing) {
      await ctx.db.patch(existing._id, patch);
    } else {
      await ctx.db.insert("subscriptions", args);
    }
  },
});