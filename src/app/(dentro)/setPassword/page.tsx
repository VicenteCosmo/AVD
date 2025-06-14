"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SetPasswordPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSet = async (e) => {
    e.preventDefault()
    const res = await fetch('http:localhost:8000/api/set-password/', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email, otp, password })
    })
    if (res.ok) router.push('/login')
    else alert((await res.json()).error)
  }

  return (
    <form onSubmit={handleSet}>
      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required />
      <input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="OTP" required />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Senha" required />
      <button>Definir Senha</button>
    </form>
  )
}