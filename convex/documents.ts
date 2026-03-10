import { paginationOptsValidator } from "convex/server";
import { query ,mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const create = mutation({
  args: {
    title: v.optional(v.string()),
    initialContent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Unauthorized");

    const organizationId = (user.organization_id ?? undefined) as string | undefined;
    const title = (args.title || "Untitled Document").toLowerCase().trim(); // normalize on save

    const documentId = await ctx.db.insert("documents", {
      title,
      initialContent: args.initialContent || "",
      ownerId: user.subject,
      roomId: crypto.randomUUID(),
      organizationId,
    });
    return documentId;
  },
});

export const get = query({
  args: { paginationOpts: paginationOptsValidator, search: v.optional(v.string()) },
  handler: async (ctx, { search, paginationOpts }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Unauthorized");

    const organizationId = (user.organization_id ?? undefined) as string | undefined;

    // Normalize: trim whitespace and lowercase
    const normalizedSearch = search?.trim().toLowerCase();

    if (normalizedSearch && organizationId) {
      return await ctx.db
        .query("documents")
        .withSearchIndex("search_title", (q) =>
          q.search("title", normalizedSearch).eq("organizationId", organizationId)
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
        .withIndex("by_organization_id", (q) => q.eq("organizationId", organizationId))
        .paginate(paginationOpts);
    }

    return await ctx.db
      .query("documents")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", user.subject))
      .paginate(paginationOpts);
  },
});


export const remove  = mutation({
  args:{id:v.id("documents")},
  handler:async (ctx,args) =>{
      const  user = await ctx.auth.getUserIdentity();

      if(!user){
        throw new ConvexError("Unauthorized")
      }
      const document = await ctx.db.get(args.id);

      if(!document){
        throw new ConvexError("Document Not Found")
      }
      const isOwner = document.ownerId === user.subject;
      if(!isOwner){
         throw new ConvexError("Unauthorized")
      }

      return await ctx.db.delete(args.id)
  }
})

export const update = mutation({
  args: { id: v.id("documents"), title: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Unauthorized");

    const document = await ctx.db.get(args.id);
    if (!document) throw new ConvexError("Document Not Found");
    if (document.ownerId !== user.subject) throw new ConvexError("Unauthorized");

    return await ctx.db.patch(args.id, {
      title: args.title.toLowerCase().trim(), // normalize on update
    });
  },
});