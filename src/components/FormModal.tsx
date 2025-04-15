'use client';

import { useState } from "react";

// Definição da tipagem para o funcionário, conforme o modelo Django.
export type Funcionario = {
  id?: number;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  data_admissao: string;
  data_nascimento: string;
  area_atuacao: string;
  phone?: string;
  address?: string;
  bi: string;
  estado_civil: string;
  genero: string;
  nacionalidade: string;
  foto?: File | string;
  tipo_contrato?: string;
  iban?: string;
  nss?: string;
  nivel_academico?: string;
  situacao_actual?: string;
  formacao_profissional?: string;
};

interface FormModalProps {
  type?: "create" | "edit" | "delete";
  initialData?: Funcionario;
  onClose: () => void;
  onSuccess: (newData?: Funcionario) => void;
}

export default function FormModal({
  type = "create",
  initialData,
  onClose,
  onSuccess,
}: FormModalProps) {
  // Estado inicial usando os nomes dos campos conforme o backend
  const [funcionario, setFuncionario] = useState<Funcionario>({
    nome: initialData?.nome || "",
    email: initialData?.email || "",
    cargo: initialData?.cargo || "",
    departamento: initialData?.departamento || "",
    data_admissao: initialData?.data_admissao || "",
    data_nascimento: initialData?.data_nascimento || "",
    area_atuacao: initialData?.area_atuacao || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    bi: initialData?.bi || "",
    estado_civil: initialData?.estado_civil || "",
    genero: initialData?.genero || "",
    nacionalidade: initialData?.nacionalidade || "",
    foto: initialData?.foto || "",
    tipo_contrato: initialData?.tipo_contrato || "",
    iban: initialData?.iban || "",
    nss: initialData?.nss || "",
    nivel_academico: initialData?.nivel_academico || "",
    situacao_actual: initialData?.situacao_actual || "activo",
    formacao_profissional: initialData?.formacao_profissional || "",
  });

  // Atualiza os campos do formulário
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0];
      // Armazena o objeto File para posterior envio
      setFuncionario((prev) => ({ ...prev, [name]: file ? file : "" }));
    } else {
      setFuncionario((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Envio do formulário com FormData para incluir arquivos
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
  
    Object.entries(funcionario).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
  
    try {
      const response = await fetch("http://localhost:8000/api/funcionarios/", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        const error = await response.json();
        console.error("Erro no cadastro:", error);
        alert("Erro ao cadastrar: " + JSON.stringify(error));
      } else {
        alert("Funcionário cadastrado com sucesso!");
        onClose(); // fechar o modal
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      alert("Erro ao enviar formulário");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Pessoais */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Dados Pessoais</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                value={funcionario.nome}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="date"
                name="data_nascimento"
                value={funcionario.data_nascimento}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="nacionalidade"
                placeholder="Nacionalidade"
                value={funcionario.nacionalidade}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <select
                name="genero"
                value={funcionario.genero}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Gênero</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
              </select>
              <select
                name="estado_civil"
                value={funcionario.estado_civil}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Estado Civil</option>
                <option value="Solteiro">Solteiro</option>
                <option value="Casado">Casado</option>
              </select>
              <input
                type="text"
                name="bi"
                placeholder="BI"
                value={funcionario.bi}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Telefone"
                value={funcionario.phone}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="address"
                placeholder="Endereço"
                value={funcionario.address}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Dados Profissionais */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Dados Profissionais</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={funcionario.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="cargo"
                placeholder="Cargo"
                value={funcionario.cargo}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="departamento"
                placeholder="Departamento"
                value={funcionario.departamento}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="area_atuacao"
                placeholder="Área de Atuação"
                value={funcionario.area_atuacao}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                name="data_admissao"
                value={funcionario.data_admissao}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="nivel_academico"
                placeholder="Nível Académico"
                value={funcionario.nivel_academico}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="formacao_profissional"
                placeholder="Formação Profissional"
                value={funcionario.formacao_profissional}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="situacao_actual"
                value={funcionario.situacao_actual}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="activo">Ativo</option>
                <option value="inactivo">Inativo</option>
              </select>
            </div>
          </div>

          {/* Dados Financeiros */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Dados Financeiros</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="iban"
                placeholder="IBAN"
                value={funcionario.iban}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="nss"
                placeholder="NSS"
                value={funcionario.nss}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="tipo_contrato"
                value={funcionario.tipo_contrato}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tipo de Contrato</option>
                <option value="efectivo">Efetivo</option>
                <option value="temporario">Temporário</option>
                <option value="estagio">Estágio</option>
              </select>
              <input
                type="file"
                name="foto"
                accept="image/*"
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
              />
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-4 mt-6">
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
              {type === "create" ? "Cadastrar" : "Atualizar"}
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
