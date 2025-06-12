'use client';

import { useEffect, useState } from 'react';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

Chart.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [ativos, setAtivos] = useState(0);
  const [inativos, setInativos] = useState(0);
  const [totalDispensas, setTotalDispensas] = useState(0);
  const [totalFaltas, setTotalFaltas] = useState(0);
  const [totalPresencas, setTotalPresencas] = useState(0);
  const [departamentos, setDepartamentos] = useState([]);

 useEffect(() => {
     fetch('http://localhost:8000/api/leaves/all/')
       .then(res => res.json())
       .then(json => {
         const dispensas = json.message || []
         setTotalDispensas(dispensas.length)})
       .catch(err => console.error(err))
   }, [])
  
  const chartData = {
    labels: ['Ativos', 'Inativos'],
    datasets: [
      {
        label: 'Funcionários',
        data: [ativos, inativos],
        backgroundColor: ['#10b981', '#ef4444'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      <h1 className="text-4xl font-bold text-gray-500">Painel Administrativo</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {[
          { label: 'Cadastrados', value: funcionarios.length, color: 'blue' },
          { label: 'Ativos', value: ativos, color: 'green' },
          { label: 'Inativos', value: inativos, color: 'red' },
          { label: 'Faltas', value: totalFaltas, color: 'rose' },
          { label: 'Presenças', value: totalPresencas, color: 'teal' },
          { label: 'Dispensas', value: totalDispensas, color: 'yellow' },
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

export default AdminDashboard;
