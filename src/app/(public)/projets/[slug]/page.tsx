import { notFound } from "next/navigation"
import type { Project } from "@/types"
import { Metadata } from "next"
import ProjectDetail from "./ProjectDetail"
import { getProjectBySlug, getProjects } from "@/lib/content"

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug)
  if (!project) return { title: "Projets" }
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.image ? [project.image] : undefined,
      type: "article",
    },
    alternates: { canonical: `/projets/${params.slug}` },
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug)
  if (!project) notFound()
  const related = (await getProjects({ publishedOnly: true }))
    .filter((p: Project) => p.category === project.category && p.slug !== project.slug)
    .slice(0, 3)
  return <ProjectDetail project={project} related={related} />
}
