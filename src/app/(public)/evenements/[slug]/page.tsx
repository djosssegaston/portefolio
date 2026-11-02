import { notFound } from "next/navigation"
import type { EventTraining } from "@/types"
import { Metadata } from "next"
import EventDetail from "./EventDetail"
import { getEventBySlug, getEvents } from "@/lib/content"

export const revalidate = 60

export async function generateStaticParams() {
  const events = await getEvents()
  return events.map((event: EventTraining) => ({ slug: event.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const evt = await getEventBySlug(params.slug)
  if (!evt) return { title: "Événements" }
  return {
    title: evt.title,
    description: evt.description,
    openGraph: {
      title: evt.title,
      description: evt.description,
      images: evt.image ? [evt.image] : undefined,
      type: "article",
    },
    alternates: { canonical: `/evenements/${params.slug}` },
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const evt = await getEventBySlug(params.slug)
  if (!evt) notFound()
  const related = (await getEvents())
    .filter(
      (e: EventTraining) =>
        (e.type === evt.type || e.tags.some((t: string) => evt.tags.includes(t))) &&
        e.slug !== evt.slug
    )
    .slice(0, 3)
  return <EventDetail evt={evt} related={related} />
}
