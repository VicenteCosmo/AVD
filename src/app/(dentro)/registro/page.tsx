"use client"; 
// Indica ao Next.js que este componente roda no cliente (navegador) e não no servidor.

import { useState } from "react"; 
// Importa o hook `useState` do React para criar e gerenciar estados locais (como variáveis) dentro do componente.

import { useRouter } from "next/navigation"; 
// Importa o hook `useRouter` do Next.js (App Router) para permitir redirecionamentos de página.

import { Input } from "@/components/ui/input"; 

import { Label } from "@/components/ui/label"; 

import { Button } from "@/components/ui/button"; 

export default function CadastroFuncionario() { 

  const [nome, setNome] = useState(""); 

  const [email, setEmail] = useState(""); 

  const [carregando, setCarregando] = useState(false); 
const router = useRouter(); 
  async function handleSubmit(e: React.FormEvent) { 
    e.preventDefault(); 

    setCarregando(true); 

    try {
      const resposta = await fetch("http://localhost:8000/api/funcionarios/", {
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ nome, email }), 
      });

      if (resposta.ok) {
        router.push(`/verificar-otp?email=${encodeURIComponent(email)}`);
      } else {
        const dados = await resposta.json();
        alert("Erro: " + JSON.stringify(dados));
      }
    } catch (erro) {
      console.error("Erro ao cadastrar:", erro);
      alert("Erro ao conectar com o servidor");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-md bg-white p-6 rounded-2xl shadow"
      >
        <h1 className="text-2xl font-bold text-center">
          Cadastro de Funcionário
        </h1>

        <div>
          <Label htmlFor="nome">Nome completo</Label>
          <Input
            id="nome"
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome"
          />
        </div>

        <div>
          <Label htmlFor="email">E-mail corporativo</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@empresa.com"
          />
        </div>

        <Button type="submit" className="w-full" disabled={carregando}>
          {carregando ? "Enviando..." : "Cadastrar"}
        </Button>
      </form>
    </div>
  );
}
