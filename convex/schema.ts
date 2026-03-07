import { defineTable,defineSchema} from "convex/server";
import { v } from "convex/values";


export default defineSchema({
    documents: defineTable({
        name: v.string(),
        content: v.string()
    })
})