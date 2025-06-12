"use client"; 
// Indica ao Next.js que este componente roda no cliente (navegador) e não no servidor.

import { useState } from "react"; 
// Importa o hook `useState` do React para criar e gerenciar estados locais (como variáveis) dentro do componente.

import { useRouter } from "next/navigation"; 
// Importa o hook `useRouter` do Next.js (App Router) para permitir redirecionamentos de página.

import { Input } from "@/components/ui/input"; 
// Importa o componente de campo de texto (`Input`) do conjunto de UI que estamos usando (shadcn/ui).

import { Label } from "@/components/ui/label"; 
// Importa o componente de rótulo (`Label`) para associar textos descritivos aos inputs.

import { Button } from "@/components/ui/button"; 
// Importa o componente de botão (`Button`) estilizado pelo shadcn/ui.

export default function CadastroFuncionario() { 
  // Declaração do componente React chamado `CadastroFuncionario`. É a função que retorna o JSX da página.

  const [nome, setNome] = useState(""); 
  // Cria o estado `nome` (inicialmente vazio) e a função `setNome` para atualizá-lo quando o usuário digitar.

  const [email, setEmail] = useState(""); 
  // Cria o estado `email` (inicialmente vazio) e a função `setEmail` para atualizá-lo com o valor digitado.

  const [carregando, setCarregando] = useState(false); 
  // Cria o estado `carregando` (booleano), para indicar quando a requisição está em andamento.

  const router = useRouter(); 
  // Obtém o objeto `router` para podermos mudar de rota (URL) programaticamente.

  async function handleSubmit(e: React.FormEvent) { 
    // Declara a função `handleSubmit`, que será executada ao enviar o formulário.
    e.preventDefault(); 
    // `preventDefault()` impede que o formulário envie a página inteira e recarregue o navegador.

    setCarregando(true); 
    // Marca `carregando` como `true`, para desativar temporariamente o botão e mostrar feedback.

    try {
      const resposta = await fetch("http://localhost:8000/api/funcionarios/", {
        // Envia uma requisição HTTP POST para o endpoint do Django que cadastra funcionários.
        method: "POST", 
        // Define o método HTTP como POST, para criar um novo recurso.
        headers: { "Content-Type": "application/json" }, 
        // Informa ao servidor que o corpo da requisição está em JSON.
        body: JSON.stringify({ nome, email }), 
        // Converte o objeto `{ nome, email }` para string JSON e envia como corpo.
      });

      if (resposta.ok) {
        // Verifica se o servidor respondeu com status 200–299.
        router.push(`/verificar-otp?email=${encodeURIComponent(email)}`);
        // Se OK, redireciona o usuário para a página de verificação do OTP,
        // passando o email na URL (codificado para caracteres especiais).
      } else {
        const dados = await resposta.json();
        // Se não OK, lê a resposta de erro em JSON.
        alert("Erro: " + JSON.stringify(dados));
        // Exibe um `alert` com os detalhes do erro.
      }
    } catch (erro) {
      // Caso a requisição falhe (por exemplo, servidor offline):
      console.error("Erro ao cadastrar:", erro);
      // Imprime o erro no console do navegador.
      alert("Erro ao conectar com o servidor");
      // Mostra um alerta genérico ao usuário.
    } finally {
      setCarregando(false);
      // No fim (sucesso ou erro), marca `carregando` como `false` para reativar o botão.
    }
  }

  return (
    // Começo do JSX: define o que será renderizado na tela:
    <div className="flex justify-center items-center min-h-screen">
      {/* Container centralizado vertical e horizontalmente */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-md bg-white p-6 rounded-2xl shadow"
      >
        {/* Formulário com espaçamento, largura máxima e estilo de card */}
        <h1 className="text-2xl font-bold text-center">
          Cadastro de Funcionário
        </h1>
        {/* Título do formulário */}

        <div>
          <Label htmlFor="nome">Nome completo</Label>
          {/* Rótulo associado ao input de nome */}
          <Input
            id="nome"
            type="text"
            required
            value={nome}
            // Valor do input ligado ao estado `nome`
            onChange={(e) => setNome(e.target.value)}
            // Atualiza `nome` sempre que o usuário digita
            placeholder="Digite seu nome"
          />
        </div>

        <div>
          <Label htmlFor="email">E-mail corporativo</Label>
          {/* Rótulo associado ao input de email */}
          <Input
            id="email"
            type="email"
            required
            value={email}
            // Valor do input ligado ao estado `email`
            onChange={(e) => setEmail(e.target.value)}
            // Atualiza `email` sempre que o usuário digita
            placeholder="email@empresa.com"
          />
        </div>

        <Button type="submit" className="w-full" disabled={carregando}>
          {/* Botão de envio: desabilitado enquanto `carregando` for true */}
          {carregando ? "Enviando..." : "Cadastrar"}
          {/* Texto muda conforme o estado de carregamento */}
        </Button>
      </form>
    </div>
  );
}
