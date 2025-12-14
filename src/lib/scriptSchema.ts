import { z } from "zod";

export const ScriptMetaSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  level: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
  minutes: z.coerce.number().int().positive().default(8),
  tags: z.array(z.string()).default([]),
  date: z.string().min(4).default(""),
  status: z.enum(["draft", "published"]).default("draft"),
  category: z.string().optional(),
  author: z.string().optional(),
  lastUpdated: z.string().optional(),
  image: z.string().optional(),
  prerequisites: z.array(z.string()).optional(),
  related: z.array(z.string()).optional(),
});

export type ScriptMeta = z.infer<typeof ScriptMetaSchema>;

export type Script = {
  slug: string;
  meta: ScriptMeta;
  content: string;
};
