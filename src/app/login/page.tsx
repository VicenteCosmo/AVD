"use client"; 

import { useState } from "react"; 

import { useRouter } from "next/navigation"; 

import { Input } from "@/components/ui/input"; 

import { Label } from "@/components/ui/label"; 
import { Button } from "@/components/ui/button"; 

export default function LoginFuncionario() { 

  const [email, setEmail] = useState(""); 

  const [carregando, setCarregando] = useState(false); 

  const router = useRouter(); 

  async function handleSubmit(e: React.FormEvent) { 
    e.preventDefault(); 

    setCarregando(true); 

    try {
      const resposta = await fetch(
        "http://localhost:8000/api/funcionarios/send-otp/",
        {
          method: "POST", 

          headers: { "Content-Type": "application/json" }, 

          body: JSON.stringify({ email }),
        }
      );

      if (resposta.ok) {
        router.push(
          `/verificar-otp?email=${encodeURIComponent(email)}`
        );
      } else {
        const dados = await resposta.json();
        alert("Erro: " + JSON.stringify(dados));
      }
    } catch (erro) {
      console.error("Erro ao enviar OTP:", erro);
      alert("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      {/* Container que centraliza vertical e horizontalmente */}
      <form
        onSubmit={handleSubmit}
        // Liga o evento de submit do form à função handleSubmit.
        className="space-y-4 w-full max-w-md bg-white p-6 rounded-2xl shadow"
        // Aplica classes Tailwind para espaçamento, largura, background, padding, bordas arredondadas e sombra.
      >
        <h1 className="text-2xl font-bold text-center">
          Login Inicial
        </h1>
        {/* Título da página de login */}

        <div>
          <Label htmlFor="email">E-mail</Label>
          {/* Label apontando para o input de id="email" */}
          <Input
            id="email"
            type="email"
            required
            // Garante que o campo seja preenchido e contenha formato de email.
            value={email}
            // Liga o valor do input ao estado "email".
            onChange={(e) => setEmail(e.target.value)}
            // Atualiza o estado "email" sempre que o usuário digitar.
            placeholder="seu.email@empresa.com"
            // Texto de exemplo dentro do campo.
          />
        </div>

        <Button type="submit" className="w-full" disabled={carregando}>
          {/* Botão ocupa toda a largura e fica desabilitado se carregando for true */}
          {carregando ? "Enviando OTP..." : "Enviar OTP"}
          {/* Texto do botão muda conforme o estado de carregamento */}
        </Button>
      </form>
    </div>
  );
}
