import mysql from "mysql2/promise"
import "dotenv/config"
import { projects } from "../src/lib/data/projects"
import { skills } from "../src/lib/data/skills"
import { experiences } from "../src/lib/data/experiences"
import { education } from "../src/lib/data/education"
import { certifications } from "../src/lib/data/certifications"
import { testimonials } from "../src/lib/data/testimonials"
import { blogPosts } from "../src/lib/data/blog-posts"
import { services } from "../src/lib/data/services"
import { faq } from "../src/lib/data/faq"
import { events } from "../src/lib/data/events"

function uuid() {
  return "id_" + Math.random().toString(36).slice(2, 15)
}

async function main() {
  const connection = await mysql.createConnection({ uri: process.env.DATABASE_URL })
  console.log("Connected\n")

  // Clear tables
  const tables = [
    "chat_messages", "blog_comments", "blog_posts", "contact_messages", "event_trainings",
    "faq", "services", "testimonials", "certifications", "education", "experiences",
    "skills", "projects", "admin_users", "site_configs",
  ]
  for (const t of tables) {
    await connection.execute(`DELETE FROM \`${t}\``)
  }
  console.log("Cleared existing data\n")

  // Projects
  for (const p of projects) {
    await connection.execute(
      `INSERT INTO projects (id, title, slug, description, long_description, problem, solution, key_features, results, challenges, technologies, category, image, gallery, github_url, demo_url, featured, date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [p.id, p.title, p.slug, p.description, p.longDescription, p.problem, p.solution,
       JSON.stringify(p.keyFeatures), JSON.stringify(p.results), JSON.stringify(p.challenges),
       JSON.stringify(p.technologies), p.category, p.image, JSON.stringify(p.gallery),
       p.githubUrl ?? null, p.demoUrl ?? null, p.featured, new Date(p.date), p.status]
    )
  }
  console.log(`✓ ${projects.length} projects`)

  // Skills
  for (const s of skills) {
    await connection.execute(
      `INSERT INTO skills (id, name, level, icon, category, description) VALUES (?, ?, ?, ?, ?, ?)`,
      [s.id, s.name, s.level, s.icon, s.category, s.description ?? null]
    )
  }
  console.log(`✓ ${skills.length} skills`)

  // Experiences
  for (const e of experiences) {
    await connection.execute(
      `INSERT INTO experiences (id, company, position, location, start_date, end_date, current, description, achievements, company_logo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [e.id, e.company, e.position, e.location, new Date(e.startDate),
       e.endDate ? new Date(e.endDate) : null, e.current, e.description,
       JSON.stringify(e.achievements), e.companyLogo ?? null]
    )
  }
  console.log(`✓ ${experiences.length} experiences`)

  // Education
  for (const e of education) {
    await connection.execute(
      `INSERT INTO education (id, institution, degree, field, start_date, end_date, current, description, highlights, logo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [e.id, e.institution, e.degree, e.field, new Date(e.startDate),
       e.endDate ? new Date(e.endDate) : null, e.current, e.description,
       JSON.stringify(e.highlights), e.logo ?? null]
    )
  }
  console.log(`✓ ${education.length} education entries`)

  // Certifications
  for (const c of certifications) {
    await connection.execute(
      `INSERT INTO certifications (id, title, issuer, date, expiry_date, credential_url, badge, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [c.id, c.title, c.issuer, new Date(c.date),
       c.expiryDate ? new Date(c.expiryDate) : null, c.credentialUrl ?? null, c.badge, c.description]
    )
  }
  console.log(`✓ ${certifications.length} certifications`)

  // Testimonials
  for (const t of testimonials) {
    await connection.execute(
      `INSERT INTO testimonials (id, name, position, company, avatar, content, rating, date, featured, validated)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [t.id, t.name, t.position, t.company, t.avatar, t.content, t.rating,
       new Date(t.date), t.featured, t.validated]
    )
  }
  console.log(`✓ ${testimonials.length} testimonials`)

  // Blog posts + comments
  for (const bp of blogPosts) {
    await connection.execute(
      `INSERT INTO blog_posts (id, title, slug, excerpt, content, cover_image, category, tags, author, author_avatar, date, read_time, published, scheduled_date, popular)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [bp.id, bp.title, bp.slug, bp.excerpt, bp.content, bp.coverImage, bp.category,
       JSON.stringify(bp.tags), bp.author, bp.authorAvatar, new Date(bp.date),
       bp.readTime, bp.published, bp.scheduledDate ? new Date(bp.scheduledDate) : null, bp.popular]
    )
    for (const c of bp.comments) {
      await connection.execute(
        `INSERT INTO blog_comments (id, name, email, content, date, validated, post_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [c.id, c.name, c.email, c.content, new Date(c.date), c.validated, bp.id]
      )
    }
  }
  console.log(`✓ ${blogPosts.length} blog posts with comments`)

  // Services
  for (const s of services) {
    await connection.execute(
      `INSERT INTO services (id, title, description, long_description, icon, features, price) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [s.id, s.title, s.description, s.longDescription, s.icon,
       JSON.stringify(s.features), s.price ?? null]
    )
  }
  console.log(`✓ ${services.length} services`)

  // FAQ
  for (const f of faq) {
    await connection.execute(
      `INSERT INTO faq (id, question, answer, category, ordr) VALUES (?, ?, ?, ?, ?)`,
      [f.id, f.question, f.answer, f.category, f.order]
    )
  }
  console.log(`✓ ${faq.length} FAQ entries`)

  // Events
  for (const e of events) {
    await connection.execute(
      `INSERT INTO event_trainings (id, title, slug, description, long_description, \`type\`, start_date, end_date, location, organizer, organizer_url, image, gallery, tags, certificate, certificate_url, registration_url, speaker, speaker_bio, skills, featured, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [e.id, e.title, e.slug, e.description, e.longDescription, e.type,
       new Date(e.startDate), e.endDate ? new Date(e.endDate) : null,
       e.location, e.organizer, e.organizerUrl ?? null, e.image ?? null,
       JSON.stringify(e.gallery), JSON.stringify(e.tags), e.certificate,
       e.certificateUrl ?? null, e.registrationUrl ?? null, e.speaker ?? null,
       e.speakerBio ?? null, JSON.stringify(e.skills), e.featured, e.status]
    )
  }
  console.log(`✓ ${events.length} events`)

  await connection.end()
  console.log("\nSeed complete!")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
