import { z, defineCollection } from 'astro:content'

const commands = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    danger: z.boolean().default(false).optional(),
    tags: z.array(z.string()).optional(),
    flags: z
      .array(
        z.object({
          name: z.string(),
          alias: z.string().optional(),
          description: z.string()
        })
      )
      .optional(),
    examples: z
      .array(
        z.object({
          title: z.string(),
          command: z.string(),
          danger: z.boolean().optional()
        })
      )
      .optional()
  })
})

export const collections = { commands }
