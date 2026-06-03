import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const events = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/events" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    venue: z.string().default("TBA"),
    speakers: z.array(z.string()).default([]),
    meetupLink: z
      .string()
      .url()
      .default("https://www.meetup.com/data-engineers-london/"),
    description: z.string().default(""),
  }),
});

export const collections = { events };
