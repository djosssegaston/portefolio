import ProjectsList from "./ProjectsList"
import { getProjects } from "@/lib/content"

export const revalidate = 60

export default async function Page() {
  const projects = await getProjects({ publishedOnly: true })
  return <ProjectsList projects={projects} />
}
