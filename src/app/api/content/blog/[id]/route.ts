import { NextRequest, NextResponse } from "next/server"
import { getResourceById, updateResource, deleteResource, reorderResource, requireAdmin, unauthorized } from "@/lib/crud"

export const dynamic = "force-dynamic"

type Ctx = { params: { id: string } }

export async function GET(req: NextRequest, { params }: Ctx) {
  const auth = await requireAdmin(req)
  if ("error" in auth) return unauthorized(auth)
  try {
    const data = await getResourceById("blog", params.id)
    if (!data) return NextResponse.json({ error: "Introuvable" }, { status: 404 })
    return NextResponse.json({ data })
  } catch (error) {
    console.error("[api/blog/[id]] GET", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const auth = await requireAdmin(req)
  if ("error" in auth) return unauthorized(auth)
  try {
    const body = await req.json()
    const result = await updateResource("blog", params.id, body)
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status })
    return NextResponse.json({ data: result.data })
  } catch (error) {
    console.error("[api/blog/[id]] PUT", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  return PUT(req, { params })
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const auth = await requireAdmin(req)
  if ("error" in auth) return unauthorized(auth)
  try {
    const result = await deleteResource("blog", params.id)
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status })
    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    console.error("[api/blog/[id]] DELETE", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const auth = await requireAdmin(req)
  if ("error" in auth) return unauthorized(auth)
  try {
    const body = await req.json()
    if (Array.isArray(body?.ids)) {
      const result = await reorderResource("blog", body.ids)
      if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status })
      return NextResponse.json({ ok: true, ...result })
    }
    const result = await updateResource("blog", params.id, body)
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status })
    return NextResponse.json({ data: result.data })
  } catch (error) {
    console.error("[api/blog/[id]] POST", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
