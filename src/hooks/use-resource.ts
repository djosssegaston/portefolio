"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useToast } from "@/components/ui/toast"

export interface ResourceApi<T> {
  items: T[]
  loading: boolean
  saving: boolean
  error: string | null
  refresh: () => Promise<void>
  create: (payload: any) => Promise<T | null>
  update: (id: string, payload: any) => Promise<T | null>
  remove: (id: string) => Promise<boolean>
  /** Persist an already-mutated object (e.g. after a status toggle). */
  save: (item: T) => Promise<T | null>
  reorder: (ids: string[]) => Promise<boolean>
  setItems: React.Dispatch<React.SetStateAction<T[]>>
}

function authHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function parse(res: Response) {
  return res.json().catch(() => ({}))
}

/**
 * Resources served by a dedicated route instead of the generic
 * `/api/content/[resource]` collection (they need bespoke auth or logic).
 */
const DEDICATED_BASE: Record<string, string> = {
  users: "/api/users",
}

function baseUrl(resource: string) {
  return DEDICATED_BASE[resource] ?? `/api/content/${resource}`
}

/**
 * Navigating between admin screens used to wait for a full network round-trip
 * every time. Visited collections are kept for a short window so the screen
 * renders instantly from cache and then revalidates in the background.
 */
const CACHE_TTL_MS = 30_000
const resourceCache = new Map<string, { data: any[]; ts: number }>()

/**
 * Client-side CRUD over the JSON API, backed by MySQL/TiDB.
 * Handles auth headers, error toasts and local state synchronisation.
 */
export function useResource<T extends { id: string }>(
  resource: string,
  query: Record<string, string> = {}
): ResourceApi<T> {
  const { toast } = useToast()
  const queryKey = JSON.stringify(query)
  const base = baseUrl(resource)
  const cacheKey = `${base}${queryKey}`
  const initialCache = resourceCache.get(cacheKey)
  const hasCache = Boolean(initialCache)
  const hasFreshCache =
    hasCache && Date.now() - (initialCache?.ts ?? 0) < CACHE_TTL_MS

  const [items, setItems] = useState<T[]>(
    () => (hasCache ? (initialCache?.data as T[]) : [])
  )
  const [loading, setLoading] = useState(!hasFreshCache)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const refresh = useCallback(async () => {
    try {
      setError(null)
      const qs = new URLSearchParams(queryKey ? JSON.parse(queryKey) : {})
      const suffix = qs.toString() ? `?${qs}` : ""
      const res = await fetch(`${base}${suffix}`, {
        cache: "no-store",
        headers: authHeaders(),
      })
      const payload = await parse(res)
      if (res.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("admin_token")
          localStorage.removeItem("admin_user")
          window.location.href = "/admin/login"
        }
        return
      }
      if (!res.ok) throw new Error(payload?.error ?? "Erreur de chargement")
      if (mounted.current) setItems(payload.data ?? [])
    } catch (e: any) {
      if (mounted.current) {
        setError(e.message)
        toast({
          title: "Chargement impossible",
          description: e.message,
          variant: "destructive",
        })
      }
    } finally {
      if (mounted.current) setLoading(false)
    }
  }, [base, queryKey, toast])

  useEffect(() => {
    if (!resourceCache.has(cacheKey)) setLoading(true)
    refresh()
  }, [refresh, cacheKey])

  useEffect(() => {
    if (loading) return
    resourceCache.set(cacheKey, { data: items, ts: Date.now() })
  }, [items, loading, cacheKey])

  const request = useCallback(
    async (method: string, path: string, body?: any) => {
      setSaving(true)
      try {
        const res = await fetch(path, {
          method,
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: body === undefined ? undefined : JSON.stringify(body),
        })
        const payload = await parse(res)

        if (res.status === 401) {
          toast({
            title: "Session expirée",
            description: "Veuillez vous reconnecter.",
            variant: "destructive",
          })
          if (typeof window !== "undefined") {
            localStorage.removeItem("admin_token")
            localStorage.removeItem("admin_user")
            window.location.href = "/admin/login"
          }
          return null
        }
        if (!res.ok) throw new Error(payload?.error ?? "Erreur serveur")
        return payload
      } catch (e: any) {
        toast({
          title: "Échec de l'opération",
          description: e.message,
          variant: "destructive",
        })
        return null
      } finally {
        if (mounted.current) setSaving(false)
      }
    },
    [toast]
  )

  const create = useCallback(
    async (payload: any) => {
      const result = await request("POST", base, payload)
      if (result?.data) {
        setItems((prev) => [result.data, ...prev])
        return result.data as T
      }
      return null
    },
    [request, base]
  )

  const update = useCallback(
    async (id: string, payload: any) => {
      const result = await request("PUT", `${base}/${id}`, payload)
      if (result?.data) {
        setItems((prev) => prev.map((item) => (item.id === id ? result.data : item)))
        return result.data as T
      }
      return null
    },
    [request, base]
  )

  const remove = useCallback(
    async (id: string) => {
      const result = await request("DELETE", `${base}/${id}`)
      if (result) {
        setItems((prev) => prev.filter((item) => item.id !== id))
        return true
      }
      return false
    },
    [request, base]
  )

  const save = useCallback((item: T) => update(item.id, item), [update])

  const reorder = useCallback(
    async (ids: string[]) => {
      const result = await request("POST", `${base}/${ids[0] ?? "order"}`, { ids })
      return Boolean(result?.ok)
    },
    [request, base]
  )

  return { items, loading, saving, error, refresh, create, update, remove, save, reorder, setItems }
}
