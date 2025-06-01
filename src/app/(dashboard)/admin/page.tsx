'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

Chart.register(ArcElement, Tooltip, Legend);

interface TableData {
  columns: string[];
  rows: Record<string, any>[];
  total?: number;
}

const AdminDashboard = () => {
  // Estados para os dados das tabelas
  const [tables, setTables] = useState<string[]>([]);
  const [tableCounts, setTableCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar dados das tabelas
  useEffect(() => {
    const fetchTableData = async () => {
      try {
        setLoading(true);
        
        // Buscar tabelas disponíveis
        const resTables = await fetch('http://localhost:8001/tables/');
        const tablesData = await resTables.json();
        // console.log(tablesData)
        setTables(tablesData.tables);

        // Buscar contagem de registros para cada tabela
        // const counts: Record<string, number> = {};
        // for (const table of tablesData.tables) {
        //   const resCount = await fetch(`http://localhost:8000/${table}/count`);
        //   const countData = await resCount.json();
        //   counts[table] = countData.count || 0;
        // }
        // setTableCounts(counts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();
  }, []);

  // Dados para os cards de métricas (usando os nomes das tabelas)
  const tableMetrics = tables.map(table => ({
    label: table,
    value: tableCounts[table] || 0,
    color: getColorForTable(table)
  }));

  function getColorForTable(table: string): string {
    // Mapeia cores específicas para tabelas conhecidas ou usa um esquema de cores padrão
    const colorMap: Record<string, string> = {
      'funcionarios': 'blue',
      'dispensas': 'yellow',
      'faltas': 'rose',
      'assiduidade': 'teal',
      'departamentos': 'indigo',
      'cargos': 'purple'
    };
    
    return colorMap[table.toLowerCase()] || 
      ['green', 'red', 'blue', 'yellow', 'indigo', 'purple', 'pink'][tables.indexOf(table) % 7];
  }

  // Dados para o gráfico de tabelas
  const tabelasChartData = {
    labels: tables,
    datasets: [
      {
        label: 'Registros por Tabela',
        data: tables.map(table => tableCounts[table] || 0),
        backgroundColor: tables.map(table => {
          const color = getColorForTable(table);
          return {
            'blue': '#3b82f6',
            'green': '#10b981',
            'red': '#ef4444',
            'yellow': '#f59e0b',
            'indigo': '#6366f1',
            'purple': '#8b5cf6',
            'rose': '#f43f5e',
            'teal': '#14b8a6'
          }[color] || '#3b82f6';
        }),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      <h1 className="text-4xl font-bold text-gray-500">Painel Administrativo - Departamentos</h1>

      {loading && <div className="text-center py-4">Carregando dados...</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      {/* Cards com as métricas das tabelas */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {tableMetrics.map((metric, idx) => (
          <div
            key={idx}
            className={`bg-white p-4 rounded-lg shadow-md border-l-4 border-${metric.color}-500`}
          >
            <Link href="/visualizar" >
            <h2 className="text-gray-500 capitalize">{metric.label}</h2>
            </Link>
            {/* <p className={`text-2xl font-bold text-${metric.color}-600`}>{metric.value}</p> */}
          </div>
        ))}
      </div>

      {/* Gráfico de distribuição das tabelas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Distribuição por Tabela</h3>
        <div className="w-full max-w-md mx-auto">
          <Doughnut data={tabelasChartData} />
        </div>
      </div>

      {/* Lista detalhada das tabelas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Detalhes das Tabelas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((table, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium text-lg capitalize text-gray-800">{table}</h4>
              <p className="text-gray-600 mt-2">
                <span className="font-semibold">Registros:</span> {tableCounts[table] || 0}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;