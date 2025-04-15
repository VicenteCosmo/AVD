'use client';
import { useState, useEffect } from 'react';

export default function FormacaoForm() {
  const [formacao, setFormacao] = useState({
    titulo: '',
    descricao: '',
    data_inicio: '',
    data_fim: '',
    local: '',
    funcionario_id: '', // Agora é o ID de um único funcionário
  });

  const [funcionarios, setFuncionarios] = useState([]);  // Lista de funcionários

  // Carregar os funcionários ao carregar a página
  useEffect(() => {
    const fetchFuncionarios = async () => {
      const res = await fetch('http://127.0.0.1:8000/api/funcionarios/');  // Endpoint que retorna todos os funcionários
      const data = await res.json();
      setFuncionarios(data);
    };

    fetchFuncionarios();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormacao({ ...formacao, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('http://127.0.0.1:8000/api/formacoes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formacao),
      });

      if (!res.ok) {
        throw new Error('Erro ao cadastrar formação');
      }

      alert('Formação cadastrada com sucesso!');
      setFormacao({
        titulo: '',
        descricao: '',
        data_inicio: '',
        data_fim: '',
        local: '',
        funcionario_id: '',
      });
    } catch (error) {
      console.error(error);
      alert('Erro ao cadastrar formação');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Cadastrar Formação</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="titulo"
          placeholder="Título"
          value={formacao.titulo}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="descricao"
          placeholder="Descrição"
          value={formacao.descricao}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="date"
          name="data_inicio"
          value={formacao.data_inicio}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="date"
          name="data_fim"
          value={formacao.data_fim}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="local"
          placeholder="Local"
          value={formacao.local}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <select
          name="funcionario_id"
          value={formacao.funcionario_id}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Selecione um Funcionário</option>
          {funcionarios.map((funcionario: any) => (
            <option key={funcionario.id} value={funcionario.id}>
              {funcionario.username}  {/* Aqui você pode personalizar o nome do funcionário */}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}
