"use client"
import { useEffect, useState } from "react"

export function useSupabaseClient() {
  const [data, setData] = useState<any>(null)
  const [loading1, setLoading] = useState(true)
  const [error1, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/supabase")
      .then(res => res.json())
      .then((json) => {
        setData(json)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { data, loading1, error1 }
}
