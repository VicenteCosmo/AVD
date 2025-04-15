import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const VerifyEmailPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const [message, setMessage] = useState("Verificando seu e-mail...");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) return;

      try {
        const res = await fetch(`http://localhost:8000/api/verify-email/${token}/`);
        const data = await res.json();

        if (res.ok) {
          setMessage("✅ E-mail verificado com sucesso! Você já pode fazer login.");
          setSuccess(true);
        } else {
          setMessage(`❌ Erro ao verificar e-mail: ${data.error || "Token inválido ou expirado."}`);
          setSuccess(false);
        }
      } catch (error) {
        setMessage("❌ Ocorreu um erro ao verificar o e-mail.");
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4">Verificação de E-mail</h1>
        <p className={`text-lg ${success === true ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
        {!loading && success && (
          <a
            href="/sign-in"
            className="inline-block mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Ir para Login
          </a>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
