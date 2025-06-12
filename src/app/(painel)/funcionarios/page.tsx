'use client';

import { useEffect, useState } from 'react';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {AuthContext} from '@/app/context/AuthContext';
import { useContext } from "react";

const FuncionarioDashboard = () => {
  const [Dispensas, setDispensas] = useState(0);
  const [totalFaltas, setTotalFaltas] = useState(0);
  const [totalPresencas, setTotalPresencas] = useState(0);
  const { accessToken } = useContext(AuthContext);

 useEffect(() => {
  if (!accessToken) return;

  fetch("http://localhost:8000/api/dispensa/my/", {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
    .then((r) => r.json())
    .then((j) => {
      setDispensas(j);
      const aprovadas = j.filter((l) => l.status === "aprovado").length;
      const rejeitadas = j.filter((l) => l.status === "rejeitado").length;
    })
    .catch((err) => console.error("Erro ao buscar dispensas:", err))
    .finally(() => setLoading(false));
}, [accessToken]);
 

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      <h1 className="text-4xl font-bold text-gray-500">Painel do Funcionario</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {[
          { label: 'Faltas', value: totalFaltas, color: 'rose' },
          { label: 'Presenças', value: totalPresencas, color: 'teal' },
          { label: 'Aprovadas', value: leaves.filter(l => l.status === "aprovado").length, color: 'blue' },
          { label: 'Rejeitadas', value: leaves.filter(l => l.status === "rejeitado").length, color: 'red' },
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
