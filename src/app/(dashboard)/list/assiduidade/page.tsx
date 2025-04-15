'use client';

import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Assiduidade {
  id: number;
  funcionario: number;
  funcionario_nome: string;
  entrada: string;
  saida: string | null;
  data: string;
  duracao: string;
}

interface Funcionario {
  id: number;
  nome: string;
}

export default function FormModalAssiduidade() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [assiduidadeList, setAssiduidadeList] = useState<Assiduidade[]>([]);
  const [formData, setFormData] = useState({
    funcionario: '',
    entrada: '',
    data: '',
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedSaida, setEditedSaida] = useState<string>('');

  useEffect(() => {
    fetchFuncionarios();
    fetchAssiduidade();
  }, []);

  const fetchFuncionarios = async () => {
    const res = await fetch('http://127.0.0.1:8000/api/funcionarios/');
    const data = await res.json();
    setFuncionarios(data);
  };

  const fetchAssiduidade = async () => {
    const res = await fetch('http://127.0.0.1:8000/api/assiduidade/');
    const data = await res.json();
    setAssiduidadeList(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEntrada = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/assiduidade/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          funcionario: formData.funcionario,
          entrada: formData.entrada,
          data: formData.data,
        }),
      });

      if (!res.ok) throw new Error('Erro ao registrar entrada');
      await fetchAssiduidade();
      setOpen(false);
      setFormData({ funcionario: '', entrada: '', data: '' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaidaEdit = async () => {
    if (editingId === null || !editedSaida) return;
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/assiduidade/${editingId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saida: editedSaida }),
      });

      if (!res.ok) throw new Error('Erro ao registrar saída');
      await fetchAssiduidade();
      setEditingId(null);
      setEditedSaida('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Relatório de Assiduidade', 14, 16);
    autoTable(doc, {
      head: [['Funcionário', 'Entrada', 'Saída', 'Data', 'Duração']],
      body: assiduidadeList.map((a) => [
        a.funcionario_nome,
        a.entrada,
        a.saida || '-',
        a.data,
        a.duracao || '-',
      ]),
      startY: 20,
    });
    doc.save('relatorio-assiduidade.pdf');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Gestão de Assiduidade</h1>
        <button
          onClick={exportToPDF}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2  rounded shadow"
        >
          Exportar PDF
        </button>
      </div>

      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white  px-4 py-2 rounded shadow"
      >
        Registrar Entrada
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Nova Entrada</h2>

            <select
              name="funcionario"
              value={formData.funcionario}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Selecione o Funcionário</option>
              {funcionarios.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nome}
                </option>
              ))}
            </select>

            <input
              type="time"
              name="entrada"
              value={formData.entrada}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />

            <input
              type="date"
              name="data"
              value={formData.data}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />

            <div className="flex gap-2">
              <button
                onClick={handleEntrada}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
              >
                Cancelar
              </button>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>
        </div>
      )}

      {/* Tabela */}
      <div className="overflow-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2">Funcionário</th>
              <th className="px-4 py-2">Entrada</th>
              <th className="px-4 py-2">Saída</th>
              <th className="px-4 py-2">Data</th>
              <th className="px-4 py-2">Duração</th>
              <th className="px-4 py-2">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {assiduidadeList.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{item.funcionario_nome}</td>
                <td className="px-4 py-2">{item.entrada}</td>
                <td className="px-4 py-2">
                  {editingId === item.id ? (
                    <input
                      type="time"
                      className="border px-2 py-1 rounded"
                      value={editedSaida}
                      onChange={(e) => setEditedSaida(e.target.value)}
                    />
                  ) : (
                    item.saida || '-'
                  )}
                </td>
                <td className="px-4 py-2">{item.data}</td>
                <td className="px-4 py-2">{item.duracao || '-'}</td>
                <td className="px-4 py-2">
                  {editingId === item.id ? (
                    <button
                      onClick={handleSaidaEdit}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                      disabled={loading}
                    >
                      {loading ? 'Atualizando...' : 'Atualizar'}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setEditedSaida(item.saida || '');
                      }}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
                    >
                      Editar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
