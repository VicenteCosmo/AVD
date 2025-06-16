
"use client"

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import Swal from 'sweetalert2'

export type Leave = {
  id: number
  motivo: string
  inicio: string
  fim: string
  justificativo: string 
  status: 'pendente' | 'aprovado' | 'rejeitado'
  admin_comentario: string | null
  created_at: string
  funcionario_nome?: string
}
function calculateDays(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = endDate.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
  return isNaN(diffDays) ? 0 : diffDays;
}

function formatDate(dateString: string) {
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' })
}
export  default function AdminLeavesPage() {
  const [leaves, setLeaves] = useState<Leave[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetch('https://backend-django-2-7qpl.onrender.com/api/leaves/all/')
      .then(res => res.json())
      .then(json => setLeaves(json.message || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleDecision = async (id: number, decision: 'aprovado' | 'rejeitado') => {
    const comment = await Swal.fire({
      title: decision === 'aprovado' ? 'Comentário de aprovação' : 'Comentário de reprovação',
      input: 'textarea',
      showCancelButton: true
    }).then(res => res.isConfirmed ? res.value || '' : null)

    if (comment === null) return

    const mappedDecision = decision === 'rejeitado' ? 'rejeitado' : 'aprovado';

    try {
      const res = await fetch(`https://backend-django-2-7qpl.onrender.com/api/leaves/update/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: mappedDecision, admin_comentario: comment })
      })
      if (!res.ok) throw new Error()
      setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: mappedDecision as Leave["status"], admin_comentario: comment } : l))
      toast({ title:'Atualizado', description:'Status salvo.', variant:'default' })
    } catch {
      toast({ title:'Erro', description:'Não foi possível atualizar.', variant:'destructive' })
    }
  }

  if (loading) return <p>Carregando...</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pedidos de Dispensa</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Funcionário</TableHead>
            <TableHead>Motivo</TableHead>
            <TableHead>Período</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Comentário</TableHead>
            <TableHead>Justificativo</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaves.map(l => (
            <TableRow key={l.id}>
              <TableCell>{l.funcionario_nome || '—'}</TableCell>
              <TableCell>{l.motivo}</TableCell>
              <TableCell>
                <span className="text-sm text-black-800">
               {calculateDays(l.inicio, l.fim)} dias
              </span></TableCell>
              <TableCell>{l.status}</TableCell>
              <TableCell>{l.admin_comentario || '—'}</TableCell>
              <TableCell>
                {l.justificativo ? (
                  <a href={l.justificativo} target="_blank">Ver PDF</a>
                ) : "—"}
              </TableCell>
              <TableCell className="flex gap-2">
              {l.status === "pendente" ? (
           <>
      <Button className="bg-green-500" onClick={() => handleDecision(l.id, "aprovado")}>
        Aprovar
      </Button>
      <Button variant="destructive" onClick={() => handleDecision(l.id, "rejeitado")}>
        Reprovar
      </Button>
    </>
  ) : (
    <span className="italic text-gray-500">Já {l.status}</span>
  )}
</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
