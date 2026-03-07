import { query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},  // ✅ no args needed
  handler: async (ctx) => {
    return await ctx.db.query("documents").collect();
  },
});