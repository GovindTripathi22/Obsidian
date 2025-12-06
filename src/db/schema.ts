import { pgTable, serial, text, timestamp, integer, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    clerkId: text("clerk_id").notNull().unique(),
    name: text("name"),
    email: text("email").notNull(),
    imageUrl: text("image_url"),
    credits: integer("credits").default(5).notNull(),
    lastGenerationDate: timestamp("last_generation_date"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    createdBy: text("created_by").notNull(), // Clerk User ID
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const frames = pgTable("frames", {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id").references(() => projects.id).notNull(),
    code: text("code").notNull(), // HTML/Tailwind code
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chats = pgTable("chats", {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id").references(() => projects.id).notNull(),
    role: text("role", { enum: ["user", "ai"] }).notNull(),
    message: text("message").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
