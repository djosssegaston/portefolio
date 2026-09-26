import { query } from "@/lib/db"

export const SELECT_COMMENT = `
  SELECT c.id, c.name, c.email, c.content, c.date, c.validated, c.post_id,
         p.title AS post_title, p.slug AS post_slug
  FROM blog_comments c
  LEFT JOIN blog_posts p ON p.id = c.post_id`

export function mapComment(row: any) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    content: row.content,
    date: row.date,
    validated: Boolean(row.validated),
    postId: row.post_id,
    postTitle: row.post_title ?? "Article supprimé",
    postSlug: row.post_slug ?? null,
  }
}
