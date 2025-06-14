'use client';

// import { XMarkIcon } from '@heroicons/react/24/solid';\\\\\\\    
import { useState } from 'react';
import { Funcionario } from '@/components/FormModal';

interface DeleteModalProps {
  funcionario: Funcionario;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteModal({ funcionario, onClose, onSuccess }: DeleteModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/funcionarios/${funcionario.id}/`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert("Funcionário excluído com sucesso!");
        onSuccess();
        onClose();
      } else {
        const errorData = await res.json();
        console.error("Erro ao excluir:", errorData);
        alert("Erro ao excluir funcionário");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro na comunicação com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Excluir Funcionário</h2>
          <button onClick={onClose} className="focus:outline-none">
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <p className="mb-6">
          Você tem certeza que deseja excluir o funcionário <span className="font-semibold">{funcionario.nome}</span>?
        </p>
        <div className="flex gap-4">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded"
          >
            {loading ? "Excluindo..." : "Confirmar Exclusão"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
