'use client';

import { useEffect, useState, useContext } from 'react';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { AuthContext } from "@/app/context/AuthContext";
Chart.register(ArcElement, Tooltip, Legend);
export type Leave = {
  id: number;
  motivo: string;
  inicio: string;
  fim: string;
  justificativo: string | null;
  status: "pendente" | "aprovado" | "rejeitado";
  admin_comentario: string | null;
  created_at: string;
  funcionario_nome: string;
};

const FuncionarioDashboard = () => {
  const {accessToken}=useContext(AuthContext)
  const [funcionarios, setFuncionarios] = useState([]);
  const [ativos, setAtivos] = useState(0);
  const [reprovada, setreprovadas] = useState(0);
  const [aprovada, setAprovadas] = useState(0);
  const [dispensa, setdispensa] = useState(0);
  const [totalPresencas, setTotalPresencas] = useState(0);
  const [departamentos, setDepartamentos] = useState([]);

 useEffect(() => {
     fetch('http://localhost:8000/api/dispensa/my/', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
       .then(res => res.json())
       .then((j) => {
      setdispensa(j);
      const aprovadas = j.filter((l:Leave) => l.status === "aprovado").length;
      const reprovadas = j.filter((l:Leave) => l.status === "rejeitado").length;

      console.log("Aprovadas:", aprovadas);
      console.log("Rejeitadas:", reprovadas);
      setAprovadas(aprovadas);
      setreprovadas(reprovadas);
    })
       .catch(err => console.error(err))
   }, [accessToken])
  
  

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      <h1 className="text-4xl font-bold text-gray-500">Painel do Funcionario</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {[
          { label: 'Cadastrados', value: funcionarios.length, color: 'blue' },
          { label: 'Dispensas Reprovadas', value: reprovada, color: 'teal' },
          { label: 'Dispensas Aprovadas', value: aprovada, color: 'yellow' },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`bg-white p-4 rounded-lg shadow-md border-l-4 border-${item.color}-500`}
          >
            <h2 className="text-gray-500">{item.label}</h2>
            <p className={`text-2xl font-bold text-${item.color}-600`}>{item.value}</p>
          </div>
        ))}
      </div>


    </div>
  );
};

export default FuncionarioDashboard;
