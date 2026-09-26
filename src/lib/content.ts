import { randomUUID } from "crypto"
import { query, queryRaw } from "@/lib/db"

/* ------------------------------------------------------------------ */
/* Serialization helpers                                               */
/* ------------------------------------------------------------------ */

/** Array/JSON columns are stored as TEXT. Always read them defensively. */
export function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[]
  if (typeof value !== "string" || !value.trim()) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function parseJsonObject<T>(value: unknown, fallback: T): T {
  if (value && typeof value === "object") return value as T
  if (typeof value !== "string" || !value.trim()) return fallback
  try {
    return { ...fallback, ...JSON.parse(value) }
  } catch {
    return fallback
  }
}

export function stringify(value: unknown): string {
  return JSON.stringify(value ?? [])
}

/** `2024-03-15 00:00:00` -> `2024-03-15` */
export function toDateOnly(value: unknown): string {
  if (!value) return ""
  return String(value).slice(0, 10)
}

/** `2024-06-15 10:30:00` -> `2024-06-15T10:30:00.000Z` */
export function toIso(value: unknown): string {
  if (!value) return new Date().toISOString()
  const s = String(value)
  if (s.includes("T")) return new Date(s).toISOString()
  return new Date(s.replace(" ", "T") + "Z").toISOString()
}

/** Accepts ISO or `YYYY-MM-DD` and returns something MySQL DATETIME accepts. */
export function toDbDate(value: unknown): string {
  if (!value) return new Date().toISOString().slice(0, 19).replace("T", " ")
  const s = String(value)
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return `${s} 00:00:00`
  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 19).replace("T", " ")
  return d.toISOString().slice(0, 19).replace("T", " ")
}

export function toNullableDbDate(value: unknown): string | null {
  if (!value) return null
  return toDbDate(value)
}

export function newId(): string {
  return randomUUID()
}

export function slugify(value: string): string {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120)
}

/* ------------------------------------------------------------------ */
/* Fallback helper                                                     */
/* ------------------------------------------------------------------ */

/**
 * Public reads fall back to the bundled static data if the database is
 * unreachable, so a TiDB outage degrades instead of blanking the site.
 */
async function withFallback<T>(
  label: string,
  cacheKey: string,
  dbRead: () => Promise<T>,
  fallback: () => T
): Promise<T> {
  return cached(`${label}:${cacheKey}`, async () => {
    try {
      return await dbRead()
    } catch (error) {
      console.error(`[content] ${label} read failed, using static fallback:`, error)
      return fallback()
    }
  })
}

/* ------------------------------------------------------------------ */
/* Cache                                                               */
/* ------------------------------------------------------------------ */

/**
 * TiDB Serverless sits ~780ms away per round trip and costs ~8s for the TLS
 * handshake, so every read is memoised in-process. Writes bump the version
 * counter, which invalidates the whole cache at once.
 */
const CACHE_TTL_MS = 60_000
const cache = new Map<string, { value: unknown; expires: number }>()
let cacheVersion = 0

export function invalidateContent() {
  cacheVersion += 1
  cache.clear()
}

async function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const fullKey = `${cacheVersion}:${key}`
  const hit = cache.get(fullKey)
  if (hit && hit.expires > Date.now()) return hit.value as T
  const value = await load()
  cache.set(fullKey, { value, expires: Date.now() + CACHE_TTL_MS })
  return value
}

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export function mapProject(row: any) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    longDescription: row.long_description,
    problem: row.problem,
    solution: row.solution,
    keyFeatures: parseJsonArray(row.key_features),
    results: parseJsonArray(row.results),
    challenges: parseJsonArray(row.challenges),
    technologies: parseJsonArray(row.technologies),
    category: row.category,
    image: row.image ?? "",
    gallery: parseJsonArray(row.gallery),
    githubUrl: row.github_url ?? undefined,
    demoUrl: row.demo_url ?? undefined,
    featured: Boolean(row.featured),
    date: toDateOnly(row.date),
    status: row.status,
  }
}

export async function getProjects(opts: { publishedOnly?: boolean; featuredOnly?: boolean } = {}) {
  const { publishedOnly = false, featuredOnly = false } = opts
  const where: string[] = []
  if (publishedOnly) where.push("status = 'published'")
  if (featuredOnly) where.push("featured = 1")
  const sql = `SELECT * FROM projects ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY date DESC, id ASC`
  return withFallback(
    "projects",
    opts.publishedOnly || opts.featuredOnly ? JSON.stringify(opts) : "all",
    async () => ((await query(sql)) as any[]).map(mapProject),
    () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { projects } = require("@/lib/data/projects")
      return projects.filter(
        (p: any) => (!publishedOnly || p.status === "published") && (!featuredOnly || p.featured)
      )
    }
  )
}

export async function getProjectBySlug(slug: string) {
  return withFallback(
    "project_by_slug",
    slug,
    async () => {
      const rows = (await query("SELECT * FROM projects WHERE slug = ? LIMIT 1", [slug])) as any[]
      return rows.length ? mapProject(rows[0]) : null
    },
    () => require("@/lib/data/projects").projects.find((p: any) => p.slug === slug) ?? null
  )
}

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */

export function mapSkill(row: any) {
  return {
    id: row.id,
    name: row.name,
    level: Number(row.level),
    icon: row.icon ?? "",
    category: row.category,
    description: row.description ?? undefined,
  }
}

export async function getSkills() {
  return withFallback(
    "skills",
    "all",
    async () => ((await query("SELECT * FROM skills ORDER BY level DESC, name ASC")) as any[]).map(mapSkill),
    () => require("@/lib/data/skills").skills
  )
}

/* ------------------------------------------------------------------ */
/* Experiences                                                         */
/* ------------------------------------------------------------------ */

export function mapExperience(row: any) {
  return {
    id: row.id,
    company: row.company,
    position: row.position,
    location: row.location,
    startDate: toDateOnly(row.start_date),
    endDate: row.end_date ? toDateOnly(row.end_date) : undefined,
    current: Boolean(row.current),
    description: row.description,
    achievements: parseJsonArray(row.achievements),
    companyLogo: row.company_logo ?? undefined,
  }
}

export async function getExperiences() {
  return withFallback(
    "experiences",
    "all",
    async () =>
      ((await query("SELECT * FROM experiences ORDER BY current DESC, start_date DESC")) as any[]).map(
        mapExperience
      ),
    () => require("@/lib/data/experiences").experiences
  )
}

/* ------------------------------------------------------------------ */
/* Education                                                           */
/* ------------------------------------------------------------------ */

export function mapEducation(row: any) {
  return {
    id: row.id,
    institution: row.institution,
    degree: row.degree,
    field: row.field,
    startDate: toDateOnly(row.start_date),
    endDate: row.end_date ? toDateOnly(row.end_date) : undefined,
    current: Boolean(row.current),
    description: row.description,
    highlights: parseJsonArray(row.highlights),
    logo: row.logo ?? undefined,
  }
}

export async function getEducation() {
  return withFallback(
    "education",
    "all",
    async () =>
      ((await query("SELECT * FROM education ORDER BY current DESC, start_date DESC")) as any[]).map(
        mapEducation
      ),
    () => require("@/lib/data/education").education
  )
}

/* ------------------------------------------------------------------ */
/* Certifications                                                      */
/* ------------------------------------------------------------------ */

export function mapCertification(row: any) {
  return {
    id: row.id,
    title: row.title,
    issuer: row.issuer,
    date: toDateOnly(row.date),
    expiryDate: row.expiry_date ? toDateOnly(row.expiry_date) : undefined,
    credentialUrl: row.credential_url ?? undefined,
    badge: row.badge ?? "",
    description: row.description,
  }
}

export async function getCertifications() {
  return withFallback(
    "certifications",
    "all",
    async () => ((await query("SELECT * FROM certifications ORDER BY date DESC")) as any[]).map(mapCertification),
    () => require("@/lib/data/certifications").certifications
  )
}

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

export function mapTestimonial(row: any) {
  return {
    id: row.id,
    name: row.name,
    position: row.position,
    company: row.company,
    avatar: row.avatar ?? "",
    content: row.content,
    rating: Number(row.rating),
    date: toDateOnly(row.date),
    featured: Boolean(row.featured),
    validated: Boolean(row.validated),
  }
}

export async function getTestimonials(opts: { validatedOnly?: boolean; featuredOnly?: boolean } = {}) {
  const { validatedOnly = false, featuredOnly = false } = opts
  const where: string[] = []
  if (validatedOnly) where.push("validated = 1")
  if (featuredOnly) where.push("featured = 1")
  const sql = `SELECT * FROM testimonials ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY date DESC`
  return withFallback(
    "testimonials",
    opts.validatedOnly || opts.featuredOnly ? JSON.stringify(opts) : "all",
    async () => ((await query(sql)) as any[]).map(mapTestimonial),
    () => {
      const { testimonials } = require("@/lib/data/testimonials")
      return testimonials.filter(
        (t: any) => (!validatedOnly || t.validated) && (!featuredOnly || t.featured)
      )
    }
  )
}

/* ------------------------------------------------------------------ */
/* Blog posts                                                          */
/* ------------------------------------------------------------------ */

/**
 * Comments are attached to posts for public rendering. Pending comments are
 * excluded here on purpose: the posts are serialised into the RSC payload, so
 * anything returned here is readable by any visitor in the page source even if
 * the UI filters it out. Moderation happens in the admin queue (/api/comments).
 */
async function attachComments(
  postIds: string[],
  { includePending = false }: { includePending?: boolean } = {}
): Promise<Record<string, any[]>> {
  if (!postIds.length) return {}
  const placeholders = postIds.map(() => "?").join(",")
  const rows = (await query(
    `SELECT * FROM blog_comments WHERE post_id IN (${placeholders})${
      includePending ? "" : " AND validated = 1"
    } ORDER BY date DESC`,
    postIds
  )) as any[]
  const grouped: Record<string, any[]> = {}
  for (const r of rows) {
    ;(grouped[r.post_id] ||= []).push({
      id: r.id,
      name: r.name,
      email: r.email,
      content: r.content,
      date: toDateOnly(r.date),
      validated: Boolean(r.validated),
    })
  }
  return grouped
}

export function mapBlogPost(row: any, comments: any[] = []) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.cover_image ?? "",
    category: row.category,
    tags: parseJsonArray(row.tags),
    author: row.author,
    authorAvatar: row.author_avatar ?? "",
    date: toDateOnly(row.date),
    readTime: Number(row.read_time),
    published: Boolean(row.published),
    scheduledDate: row.scheduled_date ? toDateOnly(row.scheduled_date) : undefined,
    popular: Boolean(row.popular),
    comments,
  }
}

export async function getBlogPosts(opts: { publishedOnly?: boolean; category?: string; popularOnly?: boolean } = {}) {
  const { publishedOnly = false, category, popularOnly = false } = opts
  const where: string[] = []
  if (publishedOnly) where.push("published = 1")
  if (popularOnly) where.push("popular = 1")
  if (category) where.push("category = ?")
  const params: any[] = []
  if (category) params.push(category)
  const sql = `SELECT * FROM blog_posts ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY date DESC`
  const dbRead = async () => {
    const rows = (await query(sql, params)) as any[]
    const comments = await attachComments(rows.map((r) => r.id))
    return rows.map((r) => mapBlogPost(r, comments[r.id] ?? []))
  }
  return withFallback("blog_posts", opts.publishedOnly || opts.category || opts.popularOnly ? JSON.stringify(opts) : "all", dbRead, () => {
    const { blogPosts } = require("@/lib/data/blog-posts")
    return blogPosts.filter(
      (p: any) =>
        (!publishedOnly || p.published) && (!popularOnly || p.popular) && (!category || p.category === category)
    )
  })
}

export async function getBlogPostBySlug(slug: string) {
  return withFallback(
    "blog_post_by_slug",
    slug,
    async () => {
      const rows = (await query("SELECT * FROM blog_posts WHERE slug = ? LIMIT 1", [slug])) as any[]
      if (!rows.length) return null
      const comments = await attachComments([rows[0].id])
      return mapBlogPost(rows[0], comments[rows[0].id] ?? [])
    },
    () => require("@/lib/data/blog-posts").blogPosts.find((p: any) => p.slug === slug) ?? null
  )
}

export async function getBlogPostById(id: string) {
  const rows = (await query("SELECT * FROM blog_posts WHERE id = ? LIMIT 1", [id])) as any[]
  if (!rows.length) return null
  const comments = await attachComments([id])
  return mapBlogPost(rows[0], comments[id] ?? [])
}

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export function mapService(row: any) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    longDescription: row.long_description,
    icon: row.icon ?? "",
    features: parseJsonArray(row.features),
    price: row.price ?? undefined,
  }
}

export async function getServices() {
  return withFallback(
    "services",
    "all",
    async () => ((await query("SELECT * FROM services ORDER BY id ASC")) as any[]).map(mapService),
    () => require("@/lib/data/services").services
  )
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

export function mapFaq(row: any) {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    category: row.category,
    order: Number(row.ordr ?? row.order ?? 0),
  }
}

export async function getFaq() {
  return withFallback(
    "faq",
    "all",
    async () => ((await query("SELECT * FROM faq ORDER BY ordr ASC")) as any[]).map(mapFaq),
    () => require("@/lib/data/faq").faq
  )
}

/* ------------------------------------------------------------------ */
/* Events & trainings                                                  */
/* ------------------------------------------------------------------ */

export function mapEvent(row: any) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    longDescription: row.long_description,
    type: row.type,
    startDate: toDateOnly(row.start_date),
    endDate: row.end_date ? toDateOnly(row.end_date) : undefined,
    location: row.location,
    organizer: row.organizer,
    organizerUrl: row.organizer_url ?? undefined,
    image: row.image ?? undefined,
    gallery: parseJsonArray(row.gallery),
    tags: parseJsonArray(row.tags),
    certificate: Boolean(row.certificate),
    certificateUrl: row.certificate_url ?? undefined,
    registrationUrl: row.registration_url ?? undefined,
    speaker: row.speaker ?? undefined,
    speakerBio: row.speaker_bio ?? undefined,
    skills: parseJsonArray(row.skills),
    featured: Boolean(row.featured),
    status: row.status,
  }
}

export async function getEvents(opts: { status?: string; featuredOnly?: boolean } = {}) {
  const { status, featuredOnly = false } = opts
  const where: string[] = []
  const params: any[] = []
  if (status) {
    where.push("status = ?")
    params.push(status)
  }
  if (featuredOnly) where.push("featured = 1")
  const sql = `SELECT * FROM event_trainings ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY start_date DESC`
  return withFallback(
    "events",
    opts.status || opts.featuredOnly ? JSON.stringify(opts) : "all",
    async () => ((await query(sql, params)) as any[]).map(mapEvent),
    () => {
      const { events } = require("@/lib/data/events")
      return events.filter((e: any) => (!status || e.status === status) && (!featuredOnly || e.featured))
    }
  )
}

export async function getEventBySlug(slug: string) {
  return withFallback(
    "event_by_slug",
    slug,
    async () => {
      const rows = (await query("SELECT * FROM event_trainings WHERE slug = ? LIMIT 1", [slug])) as any[]
      return rows.length ? mapEvent(rows[0]) : null
    },
    () => require("@/lib/data/events").events.find((e: any) => e.slug === slug) ?? null
  )
}

/* ------------------------------------------------------------------ */
/* Contact messages                                                    */
/* ------------------------------------------------------------------ */

export function mapMessage(row: any) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? undefined,
    subject: row.subject,
    message: row.message,
    date: toIso(row.date),
    read: Boolean(row.read),
    archived: Boolean(row.archived),
    replied: Boolean(row.replied),
  }
}

export async function getContactMessages(opts: { archived?: boolean } = {}) {
  const { archived = false } = opts
  const rows = (await query(
    `SELECT * FROM contact_messages WHERE archived = ? ORDER BY date DESC`,
    [archived ? 1 : 0]
  )) as any[]
  return rows.map(mapMessage)
}

/* ------------------------------------------------------------------ */
/* Site config (key/value) + SEO                                       */
/* ------------------------------------------------------------------ */

export async function getSiteConfig() {
  const base = require("@/lib/data/site-config").siteConfig
  return withFallback("site_config", "all", async () => {
    const rows = (await query(
      "SELECT cle, valeur FROM site_configs WHERE cle NOT LIKE 'seo.%'"
    )) as any[]
    if (!rows.length) return base
    const stored: Record<string, any> = {}
    for (const r of rows) {
      try {
        stored[r.cle] = JSON.parse(r.valeur)
      } catch {
        stored[r.cle] = r.valeur
      }
    }
    return { ...base, ...stored }
  }, () => base)
}

export async function getSeoSettings() {
  const cfg = require("@/lib/data/site-config").siteConfig
  const base = {
    metaTitle: cfg.title,
    metaDescription: cfg.description,
    keywords: cfg.keywords as string[],
    ogTitle: cfg.title,
    ogDescription: cfg.description,
    ogImage: cfg.ogImage as string,
    twitterCard: "summary_large_image",
    canonicalUrl: "",
    robotsTxt: "",
    sitemapUrl: "",
  }
  return withFallback("seo", "all", async () => {
    const rows = (await query("SELECT cle, valeur FROM site_configs WHERE cle LIKE 'seo.%'")) as any[]
    if (!rows.length) return base
    const out: any = { ...base }
    for (const r of rows) {
      const key = r.cle.replace(/^seo\./, "")
      try {
        out[key] = JSON.parse(r.valeur)
      } catch {
        out[key] = r.valeur
      }
    }
    return out
  }, () => base)
}

/* ------------------------------------------------------------------ */
/* Dashboard aggregates                                                */
/* ------------------------------------------------------------------ */

export async function getContentStats() {
  const rows = (await queryRaw(`SELECT
      (SELECT COUNT(*) FROM projects) AS projects,
      (SELECT COUNT(*) FROM projects WHERE status = 'published') AS projectsPublished,
      (SELECT COUNT(*) FROM blog_posts) AS blogPosts,
      (SELECT COUNT(*) FROM blog_posts WHERE published = 1) AS blogPublished,
      (SELECT COUNT(*) FROM contact_messages) AS messages,
      (SELECT COUNT(*) FROM contact_messages WHERE \`read\` = 0 AND archived = 0) AS messagesUnread,
      (SELECT COUNT(*) FROM testimonials) AS testimonials,
      (SELECT COUNT(*) FROM testimonials WHERE validated = 1) AS testimonialsValidated,
      (SELECT COUNT(*) FROM skills) AS skills,
      (SELECT COUNT(*) FROM experiences) AS experiences,
      (SELECT COUNT(*) FROM education) AS education,
      (SELECT COUNT(*) FROM certifications) AS certifications,
      (SELECT COUNT(*) FROM services) AS services,
      (SELECT COUNT(*) FROM faq) AS faq,
      (SELECT COUNT(*) FROM event_trainings) AS events
    `)) as any[]
  const r = rows[0] ?? {}
  const out: Record<string, number> = {}
  for (const [k, v] of Object.entries(r)) out[k] = Number(v ?? 0)
  return out
}

/** Public-safe stats for the Hero section (driven by the DB, not hardcoded). */
export async function getPublicStats() {
  return cached("public_stats", async () => {
    try {
      const [rows] = await Promise.all([
        queryRaw(
          `SELECT
             (SELECT COUNT(*) FROM projects WHERE status = 'published') AS publishedProjects,
             (SELECT COUNT(*) FROM experiences) AS experienceCount,
             (SELECT COUNT(*) FROM certifications) AS certificationCount,
             (SELECT COUNT(*) FROM blog_posts WHERE published = 1) AS publishedArticles`
        ),
      ])
      const r = (rows as any[])[0] ?? {}
      return {
        publishedProjects: Number(r.publishedProjects ?? 0),
        experienceCount: Number(r.experienceCount ?? 0),
        certificationCount: Number(r.certificationCount ?? 0),
        publishedArticles: Number(r.publishedArticles ?? 0),
      }
    } catch (error) {
      console.error("[content] public stats failed:", error)
      return { publishedProjects: 0, experienceCount: 0, certificationCount: 0, publishedArticles: 0 }
    }
  })
}
