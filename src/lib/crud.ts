import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { query } from "@/lib/db"
import { invalidateContent, newId, slugify, stringify, toDbDate, toNullableDbDate } from "@/lib/content"
import {
  mapProject,
  mapSkill,
  mapExperience,
  mapEducation,
  mapCertification,
  mapTestimonial,
  mapBlogPost,
  mapService,
  mapFaq,
  mapEvent,
  mapMessage,
} from "@/lib/content"

export type ColumnType = "text" | "int" | "bool" | "json" | "date" | "datetime" | "jsonText"

export interface Resource {
  table: string
  /** camelCase field -> SQL column + type */
  columns: Record<string, { col: string; type: ColumnType; required?: boolean }>
  map: (row: any) => any
  list: (query: URLSearchParams) => Promise<any[]>
  orderBy: string
  /** default values applied on create when the client omits the field */
  defaults?: Record<string, any>
  /** fields that must be unique; used to auto-suffix slugs */
  uniqueSlug?: boolean
}

/* ------------------------------------------------------------------ */
/* Auth guard                                                          */
/* ------------------------------------------------------------------ */

export type AdminIdentity = { id: string; email: string; role: string }

export type AuthError = { error: string; status: 401 | 403 }
export type AuthResult = AuthError | { user: AdminIdentity }

const ALL_ADMIN_ROLES = ["super_admin", "admin", "editor"] as const

/**
 * Verifies the bearer token, rejects short-lived 2FA challenge tokens, then
 * reloads the account so deactivated users and role changes take effect
 * immediately instead of waiting for the 24h token to expire.
 */
export async function requireAdmin(
  req: NextRequest,
  allowedRoles: readonly string[] = ALL_ADMIN_ROLES
): Promise<AuthResult> {
  const header = req.headers.get("authorization") || ""
  const token = header.startsWith("Bearer ") ? header.slice(7) : null
  if (!token) return { error: "Non authentifié", status: 401 }

  const payload = verifyToken(token)
  if (!payload || payload.purpose !== "access") {
    return { error: "Session expirée ou invalide", status: 401 }
  }

  const rows = (await query(
    "SELECT id, email, role, active FROM admin_users WHERE id = ? LIMIT 1",
    [payload.id]
  )) as any[]
  const account = rows[0]
  if (!account || !account.active) {
    return { error: "Compte désactivé ou introuvable", status: 401 }
  }
  if (!allowedRoles.includes(account.role)) {
    return { error: "Accès refusé", status: 403 }
  }

  return { user: { id: account.id, email: account.email, role: account.role } }
}

export function requireSuperAdmin(req: NextRequest) {
  return requireAdmin(req, ["super_admin"])
}

export function unauthorized(res: { error: string; status: number }) {
  return NextResponse.json({ error: res.error }, { status: res.status })
}

/* ------------------------------------------------------------------ */
/* Value coercion                                                      */
/* ------------------------------------------------------------------ */

function coerce(type: ColumnType, value: any) {
  switch (type) {
    case "int":
      return value === null || value === "" ? 0 : Number(value)
    case "bool":
      // Accepts true, "true", 1, "1", "on"
      if (typeof value === "string") return ["true", "1", "on", "yes"].includes(value.toLowerCase()) ? 1 : 0
      return value ? 1 : 0
    case "json":
    case "jsonText":
      return stringify(value)
    case "date":
    case "datetime":
      return toDbDate(value)
    default:
      return value === undefined || value === null ? null : String(value)
  }
}

function toNullable(type: ColumnType, value: any) {
  if (value === undefined || value === null || value === "") {
    if (type === "date" || type === "datetime") return null
    if (type === "json" || type === "jsonText") return stringify([])
    return null
  }
  return coerce(type, value)
}

/** NOT NULL columns without a DB default must always receive a value on INSERT. */
function blankFor(type: ColumnType): any {
  switch (type) {
    case "int":
      return 0
    case "bool":
      return 0
    case "json":
    case "jsonText":
      return stringify([])
    case "date":
    case "datetime":
      return toDbDate(new Date())
    default:
      return ""
  }
}

/* ------------------------------------------------------------------ */
/* Resource registry                                                   */
/* ------------------------------------------------------------------ */

const c = (col: string, type: ColumnType, required = false) => ({ col, type, required })

export const RESOURCES: Record<string, Resource> = {
  projects: {
    table: "projects",
    orderBy: "date DESC, id ASC",
    uniqueSlug: true,
    map: mapProject,
    list: (q) => require("@/lib/content").getProjects({
      publishedOnly: q.get("status") === "published",
      featuredOnly: q.get("featured") === "1",
    }),
    columns: {
      title: c("title", "text", true),
      slug: c("slug", "text", true),
      description: c("description", "text", true),
      longDescription: c("long_description", "text"),
      problem: c("problem", "text"),
      solution: c("solution", "text"),
      keyFeatures: c("key_features", "json"),
      results: c("results", "json"),
      challenges: c("challenges", "json"),
      technologies: c("technologies", "json"),
      category: c("category", "text", true),
      image: c("image", "text"),
      gallery: c("gallery", "json"),
      githubUrl: c("github_url", "text"),
      demoUrl: c("demo_url", "text"),
      featured: c("featured", "bool"),
      date: c("date", "date"),
      status: c("status", "text"),
    },
    defaults: { status: "draft", featured: false, image: "", category: "web", date: new Date().toISOString().slice(0, 10) },
  },

  skills: {
    table: "skills",
    orderBy: "level DESC, name ASC",
    map: mapSkill,
    list: () => require("@/lib/content").getSkills(),
    columns: {
      name: c("name", "text", true),
      level: c("level", "int", true),
      icon: c("icon", "text"),
      category: c("category", "text", true),
      description: c("description", "text"),
    },
    defaults: { level: 50, icon: "" },
  },

  experiences: {
    table: "experiences",
    orderBy: "current DESC, start_date DESC",
    map: mapExperience,
    list: () => require("@/lib/content").getExperiences(),
    columns: {
      company: c("company", "text", true),
      position: c("position", "text", true),
      location: c("location", "text", true),
      startDate: c("start_date", "date", true),
      endDate: c("end_date", "date"),
      current: c("current", "bool"),
      description: c("description", "text", true),
      achievements: c("achievements", "json"),
      companyLogo: c("company_logo", "text"),
    },
    defaults: { current: false, achievements: [] },
  },

  education: {
    table: "education",
    orderBy: "current DESC, start_date DESC",
    map: mapEducation,
    list: () => require("@/lib/content").getEducation(),
    columns: {
      institution: c("institution", "text", true),
      degree: c("degree", "text", true),
      field: c("field", "text", true),
      startDate: c("start_date", "date", true),
      endDate: c("end_date", "date"),
      current: c("current", "bool"),
      description: c("description", "text"),
      highlights: c("highlights", "json"),
      logo: c("logo", "text"),
    },
    defaults: { current: false, highlights: [] },
  },

  certifications: {
    table: "certifications",
    orderBy: "date DESC",
    map: mapCertification,
    list: () => require("@/lib/content").getCertifications(),
    columns: {
      title: c("title", "text", true),
      issuer: c("issuer", "text", true),
      date: c("date", "date", true),
      expiryDate: c("expiry_date", "date"),
      credentialUrl: c("credential_url", "text"),
      badge: c("badge", "text"),
      description: c("description", "text"),
    },
    defaults: { badge: "" },
  },

  testimonials: {
    table: "testimonials",
    orderBy: "date DESC",
    map: mapTestimonial,
    list: (q) =>
      require("@/lib/content").getTestimonials({
        validatedOnly: q.get("validated") === "1",
        featuredOnly: q.get("featured") === "1",
      }),
    columns: {
      name: c("name", "text", true),
      position: c("position", "text", true),
      company: c("company", "text", true),
      avatar: c("avatar", "text"),
      content: c("content", "text", true),
      rating: c("rating", "int"),
      date: c("date", "date", true),
      featured: c("featured", "bool"),
      validated: c("validated", "bool"),
    },
    defaults: { rating: 5, featured: false, validated: false, avatar: "", date: new Date().toISOString().slice(0, 10) },
  },

  blog: {
    table: "blog_posts",
    orderBy: "date DESC",
    uniqueSlug: true,
    map: mapBlogPost,
    list: (q) =>
      require("@/lib/content").getBlogPosts({
        publishedOnly: q.get("published") === "1",
        popularOnly: q.get("popular") === "1",
        category: q.get("category") || undefined,
      }),
    columns: {
      title: c("title", "text", true),
      slug: c("slug", "text", true),
      excerpt: c("excerpt", "text", true),
      content: c("content", "text", true),
      coverImage: c("cover_image", "text"),
      category: c("category", "text", true),
      tags: c("tags", "json"),
      author: c("author", "text"),
      authorAvatar: c("author_avatar", "text"),
      date: c("date", "date", true),
      readTime: c("read_time", "int"),
      published: c("published", "bool"),
      scheduledDate: c("scheduled_date", "date"),
      popular: c("popular", "bool"),
    },
    defaults: { published: false, popular: false, readTime: 5, tags: [], coverImage: "", date: new Date().toISOString().slice(0, 10) },
  },

  services: {
    table: "services",
    orderBy: "id ASC",
    map: mapService,
    list: () => require("@/lib/content").getServices(),
    columns: {
      title: c("title", "text", true),
      description: c("description", "text", true),
      longDescription: c("long_description", "text"),
      icon: c("icon", "text"),
      features: c("features", "json"),
      price: c("price", "text"),
    },
    defaults: { features: [], icon: "", price: null },
  },

  faq: {
    table: "faq",
    orderBy: "ordr ASC",
    map: mapFaq,
    list: () => require("@/lib/content").getFaq(),
    columns: {
      question: c("question", "text", true),
      answer: c("answer", "text", true),
      category: c("category", "text", true),
      order: c("ordr", "int"),
    },
    defaults: { order: 0 },
  },

  events: {
    table: "event_trainings",
    orderBy: "start_date DESC",
    uniqueSlug: true,
    map: mapEvent,
    list: (q) =>
      require("@/lib/content").getEvents({
        status: q.get("status") || undefined,
        featuredOnly: q.get("featured") === "1",
        includeDrafts: true,
      }),
    columns: {
      title: c("title", "text", true),
      slug: c("slug", "text", true),
      description: c("description", "text", true),
      longDescription: c("long_description", "text"),
      type: c("type", "text", true),
      startDate: c("start_date", "date", true),
      endDate: c("end_date", "date"),
      location: c("location", "text", true),
      organizer: c("organizer", "text", true),
      organizerUrl: c("organizer_url", "text"),
      image: c("image", "text"),
      gallery: c("gallery", "json"),
      tags: c("tags", "json"),
      certificate: c("certificate", "bool"),
      certificateUrl: c("certificate_url", "text"),
      registrationUrl: c("registration_url", "text"),
      speaker: c("speaker", "text"),
      speakerBio: c("speaker_bio", "text"),
      skills: c("skills", "json"),
      featured: c("featured", "bool"),
      status: c("status", "text"),
    },
    defaults: {
      status: "upcoming",
      type: "autre",
      gallery: [],
      tags: [],
      skills: [],
      featured: false,
      certificate: false,
    },
  },
}

export function getResource(name: string): Resource | undefined {
  return RESOURCES[name]
}

/* ------------------------------------------------------------------ */
/* Slug handling                                                       */
/* ------------------------------------------------------------------ */

async function uniqueSlug(table: string, base: string, excludeId?: string) {
  let slug = slugify(base) || "element"
  let i = 1
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const rows = (await query(
      `SELECT id FROM \`${table}\` WHERE slug = ? ${excludeId ? "AND id <> ?" : ""} LIMIT 1`,
      excludeId ? [slug, excludeId] : [slug]
    )) as any[]
    if (!rows.length) return slug
    slug = `${slugify(base)}-${++i}`
  }
}

/* ------------------------------------------------------------------ */
/* CRUD operations                                                     */
/* ------------------------------------------------------------------ */

function pickFields(resource: Resource, body: any) {
  const out: Record<string, any> = {}
  for (const [field, meta] of Object.entries(resource.columns)) {
    if (body[field] !== undefined) out[field] = meta
  }
  return out
}

export async function listResource(name: string, searchParams: URLSearchParams) {
  const resource = getResource(name)
  if (!resource) return null
  return resource.list(searchParams)
}

export async function getResourceById(name: string, id: string) {
  const resource = getResource(name)
  if (!resource) return null
  const rows = (await query(`SELECT * FROM \`${resource.table}\` WHERE id = ? LIMIT 1`, [id])) as any[]
  return rows.length ? resource.map(rows[0]) : null
}

export async function createResource(name: string, body: any) {
  const resource = getResource(name)
  if (!resource) return { error: "Ressource inconnue", status: 404 as const }

  const values: Record<string, any> = { id: newId(), ...(resource.defaults ?? {}) }
  for (const [field, meta] of Object.entries(resource.columns)) {
    if (body[field] !== undefined) values[field] = body[field]
  }

  // Slug is derived from the title, so it must exist before required-field validation.
  if (resource.uniqueSlug) {
    values.slug = await uniqueSlug(resource.table, values.slug || values.title || "element")
  }

  // Required-field validation
  for (const [field, meta] of Object.entries(resource.columns)) {
    if (meta.required && (values[field] === undefined || values[field] === null || values[field] === "")) {
      return { error: `Le champ « ${field} » est obligatoire`, status: 400 as const }
    }
  }

  // Every declared column is written so NOT NULL columns are never omitted.
  const fields = Object.keys(resource.columns)
  const cols = ["id", ...fields.map((f) => resource.columns[f].col)]
  const vals = [
    values.id,
    ...fields.map((f) => {
      const v = values[f]
      return v === undefined || v === null ? blankFor(resource.columns[f].type) : coerce(resource.columns[f].type, v)
    }),
  ]

  await query(
    `INSERT INTO \`${resource.table}\` (${cols.map((x) => `\`${x}\``).join(", ")}) VALUES (${cols.map(() => "?").join(", ")})`,
    vals
  )
  invalidateContent()
  return { data: await getResourceById(name, values.id) }
}

export async function updateResource(name: string, id: string, body: any) {
  const resource = getResource(name)
  if (!resource) return { error: "Ressource inconnue", status: 404 as const }

  const existing = (await query(`SELECT * FROM \`${resource.table}\` WHERE id = ? LIMIT 1`, [id])) as any[]
  if (!existing.length) return { error: "Élément introuvable", status: 404 as const }

  const picked = pickFields(resource, body)
  const fields = Object.keys(picked)
  if (!fields.length) return { data: resource.map(existing[0]) }

  if (resource.uniqueSlug && picked.slug !== undefined) {
    const base = body.slug || body.title || existing[0].slug
    picked.slug = { col: resource.columns.slug.col, type: resource.columns.slug.type }
    body = { ...body, slug: await uniqueSlug(resource.table, base, id) }
  }

  const setClauses = fields.map((f) => `\`${resource.columns[f].col}\` = ?`)
  const vals = fields.map((f) => coerce(resource.columns[f].type, body[f]))
  await query(`UPDATE \`${resource.table}\` SET ${setClauses.join(", ")} WHERE id = ?`, [...vals, id])

  invalidateContent()
  return { data: await getResourceById(name, id) }
}

export async function deleteResource(name: string, id: string) {
  const resource = getResource(name)
  if (!resource) return { error: "Ressource inconnue", status: 404 as const }
  const result: any = await query(`DELETE FROM \`${resource.table}\` WHERE id = ?`, [id])
  invalidateContent()
  return { deleted: result.affectedRows ?? 0 }
}

/** Drag & drop ordering for FAQ. */
export async function reorderResource(name: string, ids: string[]) {
  const resource = getResource(name)
  if (!resource) return { error: "Ressource inconnue", status: 404 as const }
  if (!Array.isArray(ids) || !ids.length) return { error: "Aucun élément fourni", status: 400 as const }
  const col = resource.columns.order?.col ?? "ordr"
  for (let i = 0; i < ids.length; i++) {
    await query(`UPDATE \`${resource.table}\` SET \`${col}\` = ? WHERE id = ?`, [i + 1, ids[i]])
  }
  invalidateContent()
  return { reordered: ids.length }
}

export { mapMessage }
