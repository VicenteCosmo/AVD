'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "@/app/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export type Leave = {
  id: number;
  motivo: string;
  inicio: string;
  fim: string;
  justificativo: string | null;
  status: "pending" | "approved" | "rejected";
  admin_comentario: string | null;
  created_at: string;
  funcionario_nome: string;
};

function formatDate(dateString: string) {
  const d = new Date(dateString);
  return isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function EmployeeLeavesPage() {
  const { accessToken } = useContext(AuthContext);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  // busca as próprias dispensas
  useEffect(() => {
    if (!accessToken) return;
    fetch("http://localhost:8000/api/dispensa/my/", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((r) => r.json())
      .then((j) => setLeaves(j.message || []))
      .finally(() => setLoading(false));
  }, [accessToken]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };
function calculateDays(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = endDate.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para contar o primeiro dia
  return isNaN(diffDays) ? 0 : diffDays;
}
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!accessToken) return Swal.fire("Erro", "Faça login primeiro", "error");

    const body = new FormData();
    body.append("motivo", reason);
    body.append("inicio", startDate);
    body.append("fim", endDate);
    if (file) body.append("justificativo", file);

    const res = await fetch("http://localhost:8000/api/dispensa/create/", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body,
    });

    if (!res.ok) return Swal.fire("Erro", "Falha ao enviar pedido", "error");
    const json = await res.json();
    console.log("Resposta do backend:", json);
    setLeaves((prev) => [json, ...prev]);
    setReason(""); setStartDate(""); setEndDate(""); setFile(null);
    Swal.fire("Sucesso", "Pedido enviado!", "success");
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Meus Pedidos de Dispensa</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label>Motivo</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Data Início</label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </div>
          <div>
            <label>Data Término</label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </div>
        </div>
        <div>
          <label>Justificativa (PDF)</label>
          <Input type="file" accept="application/pdf" onChange={handleFileChange} />
        </div>
        <Button type="submit">Enviar Pedido</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Motivo</TableHead>
            <TableHead>Período</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Comentário</TableHead>
            <TableHead>Arquivo</TableHead>
            <TableHead>Quem</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaves.map((l) => (
            <TableRow key={l.id}>
              <TableCell>{l.motivo}</TableCell>
              <TableCell><span className="text-sm text-black-800">
               {calculateDays(l.inicio, l.fim)} dias
              </span></TableCell>
              <TableCell>{l.status}</TableCell>
              <TableCell>{l.admin_comentario || "—"}</TableCell>
              <TableCell>
                {l.justificativo ? (
                  <a href={l.justificativo} target="_blank">Ver PDF</a>
                ) : "—"}
              </TableCell>
              <TableCell>{l.funcionario_nome}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
