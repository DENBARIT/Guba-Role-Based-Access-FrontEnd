import { useEffect, useState, useCallback, useRef } from 'react'
import api from '../api/apiClient.js'

export default function useFetch(path, { auto = true, params = {}, transform } = {}){
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(auto)
  const [error, setError] = useState(null)
  const paramsRef = useRef(params)

  const run = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(path, { params: paramsRef.current })
      const d = res.data
      setData(transform ? transform(d) : d)
    } catch (err) { setError(err) } finally { setLoading(false) }
  }, [path, transform])

  useEffect(() => { paramsRef.current = params }, [params])

  useEffect(() => {
    let active = true
    if (!auto) return
    ;(async () => {
      try {
        setLoading(true)
        const res = await api.get(path, { params })
        if (!active) return
        const d = res.data
        setData(transform ? transform(d) : d)
      } catch (err) { if (active) setError(err) } finally { if (active) setLoading(false) }
    })()
    return () => { active = false }
  }, [auto, path, transform, JSON.stringify(params)])

  return { data, loading, error, refetch: run }
}
