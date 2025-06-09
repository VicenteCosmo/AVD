export async function apiFetch<T = any>(input: RequestInfo, init: RequestInit = {}): Promise<T> {
  let access = localStorage.getItem('access_token')
  const headers: Record<string,string> = {
    'Content-Type': init.body instanceof FormData ? undefined : 'application/json',
    ...(access ? { Authorization: `Bearer ${access}` } : {}),
  }
  let res = await fetch(input, { ...init, headers })
  if (res.status === 401 && localStorage.getItem('refresh_token')) {
    // tenta refresh
    const r = await fetch('/api/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: localStorage.getItem('refresh_token') }),
    })
    if (r.ok) {
      const { access: newAccess } = await r.json()
      localStorage.setItem('access_token', newAccess)
      access = newAccess
      res = await fetch(input, { ...init, headers: { ...headers, Authorization: `Bearer ${access}` } })
    } else {
      // logout
      localStorage.clear()
      window.location.href = '/login'
      throw new Error('Sessão expirada')
    }
  }
    if (!res.ok) throw await res.json()
    return res.json()
  }