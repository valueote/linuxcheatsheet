import { getCollection } from 'astro:content'

export const prerender = true

export async function GET() {
  const list = await getCollection('commands')
  const items = list.map((e) => ({
    slug: e.slug,
    title: e.data.title,
    description: e.data.description ?? ''
  }))
  return new Response(JSON.stringify({ items }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  })
}

