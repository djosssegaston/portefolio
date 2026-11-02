import { NextRequest, NextResponse } from "next/server"
import { listResource, createResource, requireAdmin, unauthorized } from "@/lib/crud"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if ("error" in auth) return unauthorized(auth)
  try {
    const data = await listResource("blog", req.nextUrl.searchParams)
    return NextResponse.json({ data })
  } catch (error) {
    console.error("[api/blog] GET", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if ("error" in auth) return unauthorized(auth)
  try {
    const body = await req.json()
    const result = await createResource("blog", body)
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status })
    return NextResponse.json({ data: result.data }, { status: 201 })
  } catch (error) {
    console.error("[api/blog] POST", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
