import type { MetadataRoute } from "next"
import { siteUrl } from "@/lib/site-url"
import { getProjects, getBlogPosts, getEvents } from "@/lib/content"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl()
  const staticRoutes = ["", "/a-propos", "/projets", "/services", "/blog", "/evenements", "/contact"]

  const [projects, posts, events] = await Promise.all([
    getProjects({ publishedOnly: true }).catch(() => []),
    getBlogPosts({ publishedOnly: true }).catch(() => []),
    getEvents().catch(() => []),
  ])

  return [
    ...staticRoutes.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...projects.map((p: any) => ({
      url: `${base}/projets/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...posts.map((p: any) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...events.map((e: any) => ({
      url: `${base}/evenements/${e.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ]
}
