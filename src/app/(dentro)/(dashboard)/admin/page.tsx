'use client';

import { useEffect, useState } from 'react';


const AdminDashboard = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [ativos, setAtivos] = useState(0);
  const [inativos, setInativos] = useState(0);
  const [totalDispensas, setTotalDispensas] = useState(0);
  const [totalFaltas, setTotalFaltas] = useState(0);
  const [totalPresencas, setTotalPresencas] = useState(0);
  const [departamentos, setDepartamentos] = useState([]);

 useEffect(() => {
     fetch('https://backend-django-2-7qpl.onrender.com/api/leaves/all/')
       .then(res => res.json())
       .then(json => {
         const dispensas = json.message || []
         setTotalDispensas(dispensas.length)})
       .catch(err => console.error(err))
   }, [])
  
  

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      <h1 className="lg:text-2xl font-bold text-gray-500">Painel Administrativo</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            className={`bg-white p-4 rounded-lg md:flex-col shadow-md border-l-4 border-${item.color}-500`}
          >
            <h2 className="lg:text-gray-500">{item.label}</h2>
            <p className={`text-2xl font-bold text-${item.color}-600`}>{item.value}</p>
          </div>
        ))}
      </div>


    </div>
  );
};

export default AdminDashboard;
