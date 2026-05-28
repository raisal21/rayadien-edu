import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const entries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/entries' }),
  schema: z.object({
    topic: z.enum(['jamur', 'eko']),
    bagian: z.enum(['A', 'B', 'C']),
    type: z.enum(['pg', 'pg-kompleks', 'isian']),
    nomor: z.number(),
    title: z.string(),
    indikator: z.string(),
    image: z.string().optional(),
    diagram: z.string().optional(),
    trik: z.string().optional(),
  }),
});

export const collections = { entries };
