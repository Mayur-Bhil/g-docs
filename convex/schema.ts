import { defineTable, defineSchema } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    // ✅ FIX: optional so documents created without content don't fail validation
    initialContent: v.optional(v.string()),
    ownerId: v.string(),
    roomId: v.string(),
    organizationId: v.optional(v.string()),
  })
    .index("by_owner_id", ["ownerId"])
    .index("by_organization_id", ["organizationId"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["ownerId", "organizationId"],
    }),
});