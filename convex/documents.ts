import { paginationOptsValidator } from "convex/server";
import { query, mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const getById = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.id);
    if (!document) throw new ConvexError("Document not Found");
    return document;
  },
});

export const getByRoomId = query({
  args: { roomId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return null;

    const document = await ctx.db
      .query("documents")
      .withIndex("by_room_id", (q) => q.eq("roomId", args.roomId))
      .first();

    if (!document) return null;

    const organizationId = (user.organization_id ?? undefined) as
      | string
      | undefined;
    const isOwner = document.ownerId === user.subject;
    const isOrgMember =
      !!document.organizationId &&
      document.organizationId === organizationId;

    if (!isOwner && !isOrgMember) return null;
    return document;
  },
});

export const getByRoomIdPublic = query({
  args: { roomId: v.string() },
  handler: async (ctx, args) => {
    const doc = await ctx.db
      .query("documents")
      .withIndex("by_room_id", (q) => q.eq("roomId", args.roomId))
      .first();
    if (!doc) return null;
    return { _id: doc._id, title: doc.title };
  },
});

export const create = mutation({
  args: {
    title: v.optional(v.string()),
    initialContent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Unauthorized");

    // ── subscription gate ──────────────────────────────────────────────
    const sub = await ctx.db
      .query("subscriptions")
      .withIndex("by_user_id", (q) => q.eq("userId", user.subject))
      .first();

    const isPro =
      sub?.plan === "pro" &&
      (sub.status === "active" ||
        sub.status === "trialing" ||
        sub.status === "past_due");

    if (!isPro) {
      const docs = await ctx.db
        .query("documents")
        .withIndex("by_owner_id", (q) => q.eq("ownerId", user.subject))
        .collect();

      if (docs.length >= 10) {
        throw new ConvexError("FREE_LIMIT_REACHED");
      }
    }
    // ── end gate ───────────────────────────────────────────────────────

    const organizationId = (user.organization_id ?? undefined) as
      | string
      | undefined;
    const title = (args.title || "Untitled Document").toLowerCase().trim();

    return await ctx.db.insert("documents", {
      title,
      initialContent: args.initialContent ?? "",
      ownerId: user.subject,
      roomId: crypto.randomUUID(),
      organizationId,
    });
  },
});

export const get = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
  },
  handler: async (ctx, { search, paginationOpts }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return { page: [], isDone: true, continueCursor: "" };

    const organizationId = (user.organization_id ?? undefined) as
      | string
      | undefined;
    const normalizedSearch = search?.trim().toLowerCase();

    if (normalizedSearch && organizationId) {
      return await ctx.db
        .query("documents")
        .withSearchIndex("search_title", (q) =>
          q
            .search("title", normalizedSearch)
            .eq("organizationId", organizationId)
        )
        .paginate(paginationOpts);
    }

    if (normalizedSearch) {
      return await ctx.db
        .query("documents")
        .withSearchIndex("search_title", (q) =>
          q.search("title", normalizedSearch).eq("ownerId", user.subject)
        )
        .paginate(paginationOpts);
    }

    if (organizationId) {
      return await ctx.db
        .query("documents")
        .withIndex("by_organization_id", (q) =>
          q.eq("organizationId", organizationId)
        )
        .paginate(paginationOpts);
    }

    return await ctx.db
      .query("documents")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", user.subject))
      .paginate(paginationOpts);
  },
});

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Unauthorized");

    const document = await ctx.db.get(args.id);
    if (!document) throw new ConvexError("Document Not Found");

    const organizationId = (user.organization_id ?? undefined) as
      | string
      | undefined;
    const isOwner = document.ownerId === user.subject;

    if (
      document.organizationId &&
      organizationId === document.organizationId
    ) {
      const isAdmin = user.org_role === "org:admin";
      if (!isOwner && !isAdmin) {
        throw new ConvexError(
          "Only the document owner or an admin can delete this document"
        );
      }
      return await ctx.db.delete(args.id);
    }

    if (!isOwner) throw new ConvexError("Unauthorized");
    return await ctx.db.delete(args.id);
  },
});

export const update = mutation({
  args: { id: v.id("documents"), title: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Unauthorized");

    const document = await ctx.db.get(args.id);
    if (!document) throw new ConvexError("Document Not Found");

    const organizationId = (user.organization_id ?? undefined) as
      | string
      | undefined;
    const isOwner = document.ownerId === user.subject;

    if (
      document.organizationId &&
      organizationId === document.organizationId
    ) {
      const isAdmin = user.org_role === "org:admin";
      if (!isOwner && !isAdmin) throw new ConvexError("Unauthorized");
    } else if (!isOwner) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db.patch(args.id, {
      title: args.title.toLowerCase().trim(),
    });
  },
});

export const updateContent = mutation({
  args: { id: v.id("documents"), initialContent: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Unauthorized");

    const document = await ctx.db.get(args.id);
    if (!document) throw new ConvexError("Document not found");

    const isOwner = document.ownerId === user.subject;
    const organizationId = (user.organization_id ?? undefined) as
      | string
      | undefined;
    const isOrgMember =
      !!document.organizationId &&
      document.organizationId === organizationId;

    if (!isOwner && !isOrgMember) throw new ConvexError("Unauthorized");

    return await ctx.db.patch(args.id, {
      initialContent: args.initialContent,
    });
  },
});