import { NextRequest, NextResponse } from "next/server"
import { getResourceById, updateResource, deleteResource, reorderResource, requireAdmin, unauthorized } from "@/lib/crud"

export const dynamic = "force-dynamic"

type Ctx = { params: { id: string } }

export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const data = await getResourceById("testimonials", params.id)
    if (!data) return NextResponse.json({ error: "Introuvable" }, { status: 404 })
    return NextResponse.json({ data })
  } catch (error) {
    console.error("[api/testimonials/[id]] GET", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const auth = requireAdmin(req)
  if ("error" in auth) return unauthorized(auth)
  try {
    const body = await req.json()
    const result = await updateResource("testimonials", params.id, body)
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status })
    return NextResponse.json({ data: result.data })
  } catch (error) {
    console.error("[api/testimonials/[id]] PUT", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  return PUT(req, { params })
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const auth = requireAdmin(req)
  if ("error" in auth) return unauthorized(auth)
  try {
    const result = await deleteResource("testimonials", params.id)
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status })
    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    console.error("[api/testimonials/[id]] DELETE", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const auth = requireAdmin(req)
  if ("error" in auth) return unauthorized(auth)
  try {
    const body = await req.json()
    if (Array.isArray(body?.ids)) {
      const result = await reorderResource("testimonials", body.ids)
      if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status })
      return NextResponse.json({ ok: true, ...result })
    }
    const result = await updateResource("testimonials", params.id, body)
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status })
    return NextResponse.json({ data: result.data })
  } catch (error) {
    console.error("[api/testimonials/[id]] POST", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
