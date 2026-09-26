import EventsList from "./EventsList"
import { getEvents } from "@/lib/content"

export const revalidate = 60

export default async function Page() {
  const events = await getEvents()
  return <EventsList events={events} />
}
