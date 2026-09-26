import ServicesContent from "./ServicesContent"
import { getServices } from "@/lib/content"

export const revalidate = 60

export default async function ServicesPage() {
  const services = await getServices()
  return <ServicesContent services={services} />
}
