'use client'
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (!user.is_superuser) {
      router.push('/funcionarioPainel');
    }
  }, [router,user]);

  if (!user) {
    return <p className="text-center mt-10">Carregando...</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Painel do Administrador</h1>
      <p>Bem-vindo, <span className="font-semibold">{user.username}</span>!</p>
      <p>Você pode gerenciar funcionários e configurações aqui.</p>
      <button
        onClick={logout}
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Sair
      </button>
    </div>
  );
}
