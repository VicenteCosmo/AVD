'use client';
import { useState, useEffect } from "react";
import FormModal, { Funcionario } from "@/components/FormModal";
import FormModal2 from "@/components/FormModal2";
import DeleteModal from "@/components/DeleteModal";
// import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";\q

export default function FuncionarioPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState<"create" | "edit" | "delete" | null>(null);
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);
  const [showModal2, setShowModal2] = useState(false); // Modal de detalhes

  const fetchFuncionarios = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/funcionarios/");
      if (!res.ok) throw new Error("Erro ao carregar funcionários");
      const data = await res.json();
      setFuncionarios(data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar funcionários");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  const handleSuccess = (updatedFuncionario?: Funcionario) => {
    if (modalType === "create" && updatedFuncionario) {
      setFuncionarios((prev) => [...prev, updatedFuncionario]);
    } else if (modalType === "edit" && updatedFuncionario) {
      setFuncionarios((prev) =>
        prev.map((f) => (f.id === updatedFuncionario.id ? updatedFuncionario : f))
      );
    } else if (modalType === "delete" && selectedFuncionario) {
      setFuncionarios((prev) =>
        prev.filter((f) => f.id !== selectedFuncionario.id)
      );
    }
    closeModal();
  };

  const openModal = (type: "create" | "edit" | "delete", funcionario?: Funcionario) => {
    setModalType(type);
    setSelectedFuncionario(funcionario || null);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedFuncionario(null);
  };

  return (
    <div className="p-6 max-w-7xl w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Funcionários</h1>
        <button
          onClick={() => openModal("create")}
          className="bg-blue-600 hover:bg-green-700 text-white py-2 px-4 rounded shadow"
        >
          Novo Funcionário
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Nome</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Cargo</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Departamento</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Admissão</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {funcionarios.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{f.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {/* Nome como botão para abrir detalhes */}
                    <button
                      onClick={() => {
                        setSelectedFuncionario(f);
                        setShowModal2(true);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      {f.nome}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{f.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{f.cargo}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{f.departamento}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{f.data_admissao}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => openModal("edit", f)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                     
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para Cadastro/Editar */}
      {modalType && modalType !== "delete" && (
        <FormModal
          type={modalType}
          initialData={selectedFuncionario || undefined}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}

      {/* Modal para Exclusão */}
      {modalType === "delete" && selectedFuncionario && (
        <DeleteModal
          funcionario={selectedFuncionario}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}

      {/* Modal de Detalhes - Abre ao clicar no nome */}
      {showModal2 && selectedFuncionario && (
        <FormModal2
          funcionario={selectedFuncionario}
          onClose={() => {
            setShowModal2(false);
            setSelectedFuncionario(null);
          }}
        />
      )}
    </div>
  );
}
