'use client';
import { useState } from "react";
// import { XMarkIcon } from "@heroicons/react/24/solid";\  
import { Funcionario } from "@/components/FormModal";

type Tab = "detalhes" | "assiduidade" | "dispensas" | "formacoes";

interface FormModal2Props {
  funcionario: Funcionario;
  onClose: () => void;
}

export default function FormModal2({ funcionario, onClose }: FormModal2Props) {
  const [activeTab, setActiveTab] = useState<Tab>("detalhes");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 relative">
        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
        >
        </button>

        <h2 className="text-3xl font-bold mb-6">Detalhes do Funcionário</h2>

        {/* Aba de navegação */}
        <nav className="mb-6 border-b border-gray-200">
          <ul className="flex space-x-6">
            <li>
              <button
                onClick={() => setActiveTab("detalhes")}
                className={`py-2 px-4 font-medium ${
                  activeTab === "detalhes"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Detalhes
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("assiduidade")}
                className={`py-2 px-4 font-medium ${
                  activeTab === "assiduidade"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Assiduidade
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("dispensas")}
                className={`py-2 px-4 font-medium ${
                  activeTab === "dispensas"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Dispensas
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("formacoes")}
                className={`py-2 px-4 font-medium ${
                  activeTab === "formacoes"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Formações
              </button>
            </li>
          </ul>
        </nav>

        {/* Conteúdo das abas */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {activeTab === "detalhes" && (
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">Nome:</span> {funcionario.nome}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {funcionario.email}
              </p>
              <p>
                <span className="font-semibold">Cargo:</span> {funcionario.cargo}
              </p>
              <p>
                <span className="font-semibold">Departamento:</span> {funcionario.departamento}
              </p>
              <p>
                <span className="font-semibold">Data de Admissão:</span> {funcionario.data_admissao}
              </p>
              <p>
                <span className="font-semibold">Data de Nascimento:</span> {funcionario.data_Nascimento}
              </p>
              <p>
                <span className="font-semibold">Área de Atuação:</span> {funcionario.area_atuacao}
              </p>
              <p>
                <span className="font-semibold">Telefone:</span> {funcionario.phone}
              </p>
              <p>
                <span className="font-semibold">Endereço:</span> {funcionario.address}
              </p>
              <p>
                <span className="font-semibold">BI:</span> {funcionario.bi}
              </p>
              <p>
                <span className="font-semibold">Estado Civil:</span> {funcionario.Estado_Civil}
              </p>
              <p>
                <span className="font-semibold">Gênero:</span> {funcionario.Genero}
              </p>
              <p>
                <span className="font-semibold">Nacionalidade:</span> {funcionario.Nacionalidade}
              </p>
              <p>
                <span className="font-semibold">Tipo de Contrato:</span> {funcionario.tipo_contrato}
              </p>
              <p>
                <span className="font-semibold">IBAN:</span> {funcionario.iban}
              </p>
              <p>
                <span className="font-semibold">NSS:</span> {funcionario.nss}
              </p>
              <p>
                <span className="font-semibold">Nível Académico:</span> {funcionario.Nivel_academico}
              </p>
              <p>
                <span className="font-semibold">Situação Atual:</span> {funcionario.Situacao_actual}
              </p>
              <p>
                <span className="font-semibold">Formação Profissional:</span> {funcionario.formacao_Profissional}
              </p>
              {funcionario.foto && (
                <div className="mt-4">
                  <span className="font-semibold">Foto:</span>
                  <img
                    src={funcionario.foto}
                    alt="Foto do Funcionário"
                    className="mt-2 w-32 h-32 object-cover rounded"
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === "assiduidade" && (
            <div className="text-gray-700">
              {/* Placeholder para dados de assiduidade */}
              <p className="text-center text-sm text-gray-500">Dados de assiduidade serão exibidos aqui.</p>
            </div>
          )}

          {activeTab === "dispensas" && (
            <div className="text-gray-700">
              {/* Placeholder para dados de dispensas */}
              <p className="text-center text-sm text-gray-500">Dados de dispensas serão exibidos aqui.</p>
            </div>
          )}

          {activeTab === "formacoes" && (
            <div className="text-gray-700">
              {/* Placeholder para dados de formações */}
              <p className="text-center text-sm text-gray-500">Histórico de formações será exibido aqui.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
