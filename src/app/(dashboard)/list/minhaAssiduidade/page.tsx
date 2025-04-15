// src/app/(dashboard)/faltas/page.tsx
'use client';

import { useEffect, useState } from 'react';

const Faltas = () => {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    fetchFaltas();
  }, []);

  const fetchFaltas = async () => {
    const res = await fetch('http://127.0.0.1:8000/api/faltas/');
    const data = await res.json();
    setDados(data);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Relatório de Faltas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dados.map((item: any, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
            <h3 className="text-lg font-bold text-red-600">{item.funcionario}</h3>
            <p className="text-sm text-gray-700">Total de Faltas: <strong>{item.faltas}</strong></p>
            <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
              {item.datas_faltas.map((d: string, i: number) => (
                <li key={i}>{new Date(d).toLocaleDateString()}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faltas;
