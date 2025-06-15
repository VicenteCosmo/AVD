'use client';

import { useEffect, useState, useRef, useContext } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { AuthContext } from '@/app/context/AuthContext';
interface Assiduidade {
  id: number;
  funcionario: number;
  entrada: string;
  saida: string | null;
  data: string;
  duracao: string;
}

export default function FormModalAssiduidade() {
  const {accessToken, userId, userName } = useContext(AuthContext);
  const [assiduidadeList, setAssiduidadeList] = useState<Assiduidade[]>([]);
  const [formData, setFormData] = useState({
    entrada: '',
    data: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isRegisteringFace, setIsRegisteringFace] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (userId) fetchAssiduidade();
  }, [userId]);

  const fetchAssiduidade = async () => {
    const res = await fetch(`https://backend-django-2-7qpl.onrender.com/api/assiduidade/?funcionario=${userId}`,{
      headers:{
        Authorization:`Bearer ${accessToken}`,
      },}
    );
    const data = await res.json();
    console.log('teu ID', userId)
    setAssiduidadeList(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openCamera = async () => {
    setIsRegisteringFace(true);
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setError('Erro ao acessar a câmera: ' + (err as Error).message);
    }
  };

  const captureImage = (): string | null => {
    if (!videoRef.current) return null;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg');
    }
    return null;
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
    setIsRegisteringFace(false);
    setError(null);
  };

  const registerNewFace = async () => {
    //if//(!//userName) return;
    const accessToken = localStorage.getItem('access_token');
    const imageData = captureImage();
    console.log("accessToken usado:", accessToken);

if (!imageData) {
  setError('Falha ao capturar imagem');
  return;
}

try {
  const formData = new FormData();
  const blob = await (await fetch(imageData)).blob(); // converte base64 para blob
  formData.append("image", blob, "face.jpg");

  const response = await fetch('https://backend-django-2-7qpl.onrender.com/api/register_face/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    body: formData,
  });

  const data = await response.json();
  console.log(data)
  if (response.ok) {
    Swal.fire({ icon: 'success', title: `Rosto cadastrado para ${userName}` });
    closeCamera();
  } else {
    Swal.fire({ icon: 'error', title: data.error || 'Erro no cadastro facial' });
  }
} catch (err) {
  console.error(err);
}
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Minha Assiduidade de {userName}</h1>

      <div className="flex space-x-2">
        
        <button onClick={openCamera}  className="bg-purple-600 text-white px-4 py-2 rounded">
          Cadastrar Foto (Rosto)
        </button>
      </div>

      {isRegisteringFace && isCameraOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96 space-y-4">
            <h2 className="text-xl font-semibold">Cadastrar Rosto de {userName}</h2>
            <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
            <div className="flex space-x-2">
              <button onClick={registerNewFace} className="flex-1 bg-green-600 text-white py-2 rounded">
                Salvar Foto
              </button>
              <button onClick={closeCamera} className="flex-1 bg-gray-500 text-white py-2 rounded">
                Cancelar
              </button>
            </div>
            {error && <p className="text-red-600">{error}</p>}
          </div>
        </div>
      )}

      <div className="overflow-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2">Entrada</th>
              <th className="p-2">Saída</th>
              <th className="p-2">Data</th>
              <th className="p-2">Duração</th>  
            </tr>
          </thead>
          <tbody>
            {assiduidadeList.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-2">{item.entrada}</td>
                <td className="p-2">{item.saida || '-'}</td>
                <td className="p-2">{item.data}</td>
                <td className="p-2">{item.duracao || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
