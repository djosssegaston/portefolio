import AProposContent from "./AProposContent"
import { getSkills } from "@/lib/content"

export const revalidate = 60

export default async function AboutPage() {
  const skills = await getSkills()
  return <AProposContent skills={skills} />
}
