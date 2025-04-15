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
  const [cargos, setCargos] = useState([]);

  useEffect(() => {
    fetchDados();
  }, []);

  const fetchDados = async () => {
    const resFunc = await fetch('http://127.0.0.1:8000/api/funcionarios/');
    const dataFunc = await resFunc.json();
    setFuncionarios(dataFunc);
    setAtivos(dataFunc.filter((f: any) => f.ativo).length);
    setInativos(dataFunc.filter((f: any) => !f.ativo).length);

    const resDisp = await fetch('http://127.0.0.1:8000/api/dispensas/');
    setTotalDispensas((await resDisp.json()).length);

    const resFaltas = await fetch('http://127.0.0.1:8000/api/faltas/');
    setTotalFaltas((await resFaltas.json()).length);

    const resPresencas = await fetch('http://127.0.0.1:8000/api/assiduidade/');
    setTotalPresencas((await resPresencas.json()).length);

    const resDept = await fetch('http://127.0.0.1:8000/api/departamentos/');
    setDepartamentos(await resDept.json());

    const resCargos = await fetch('http://127.0.0.1:8000/api/cargos/');
    setCargos(await resCargos.json());
  };

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

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Distribuição Ativos/Inativos</h3>
        <div className="w-full max-w-xs mx-auto">
          <Doughnut data={chartData} />
        </div>
      </div>

      {/* Dados Organizacionais */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Departamentos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Departamentos</h3>
          {departamentos.length === 0 ? (
            <p className="text-gray-500">Nenhum departamento registrado.</p>
          ) : (
            <ul className="space-y-2">
              {departamentos.map((d: any, i: number) => (
                <li key={i} className="text-gray-700">
                  <span className="font-medium">{d.nome}</span> – {d.descricao}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Cargos e Chefias */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Cargos</h3>
          {cargos.length === 0 ? (
            <p className="text-gray-500">Nenhum cargo registrado.</p>
          ) : (
            <ul className="space-y-2">
              {cargos.map((c: any, i: number) => (
                <li key={i} className="text-gray-700">
                  <span className="font-medium">{c.titulo}</span>{' '}
                  {c.e_chefe && <span className="text-sm text-blue-600">(Chefia)</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
