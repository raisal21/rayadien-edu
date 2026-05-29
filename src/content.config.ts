import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const entries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/entries' }),
  schema: z.object({
    subject: z.enum(['biologi', 'sejarah', 'ekonomi', 'geografi', 'ppkn']),
    semester: z.number(),
    // Sub-topic within a subject (free-form): biologi → jamur/eko,
    // sejarah → hindu-buddha/islam, ekonomi → mikro/pembayaran/lembaga, etc.
    topic: z.string(),
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

const flashcards = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/flashcards' }),
  schema: z.object({
    deck: z.string(),
    front: z.string(),
    back: z.string(),
    tags: z.array(z.string()).optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  }),
});

export const collections = { entries, flashcards };
