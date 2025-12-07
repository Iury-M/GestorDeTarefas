'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody, CardFooter, Input, Button, Link, Alert } from "@heroui/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Credenciais inválidas.");
        setLoading(false);
      } else {
        router.push('/workspaces');
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado.');
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-100px)] bg-gray-50/50">
      <Card className="w-full max-w-md p-6 bg-white border border-gray-100 shadow-xl shadow-gray-200/50 rounded-2xl">
        <CardHeader className="flex flex-col gap-2 items-center pb-8 pt-4">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Bem-vindo de volta</h1>
          <p className="text-sm text-gray-500">Acesse sua conta para continuar</p>
        </CardHeader>
        <CardBody className="overflow-visible px-2">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && <Alert color="danger" variant="flat" className="text-sm">{error}</Alert>}

            <div className="flex flex-col gap-2">
              <label className="text-xs font-extrabold text-gray-500 ml-4 uppercase tracking-widest">Email</label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                variant="flat"
                radius="full"
                classNames={{
                  inputWrapper: "bg-gray-50 hover:bg-gray-100 focus-within:bg-white shadow-none h-12 transition-all duration-300 data-[hover=true]:bg-gray-100 group-data-[focus=true]:bg-white !border-none !ring-0 !outline-none px-6",
                  input: "text-gray-900 font-semibold placeholder:text-gray-400 !border-none !ring-0 !outline-none",
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-extrabold text-gray-500 ml-4 uppercase tracking-widest">Senha</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="flat"
                radius="full"
                classNames={{
                  inputWrapper: "bg-gray-50 hover:bg-gray-100 focus-within:bg-white shadow-none h-12 transition-all duration-300 data-[hover=true]:bg-gray-100 group-data-[focus=true]:bg-white !border-none !ring-0 !outline-none px-6",
                  input: "text-gray-900 font-semibold placeholder:text-gray-400 !border-none !ring-0 !outline-none",
                }}
              />
            </div>

            <div className="flex justify-end -mt-2">
              <Link href="#" className="text-xs text-gray-500 hover:text-gray-900">Esqueceu a senha?</Link>
            </div>

            <Button
              color="primary"
              type="submit"
              isLoading={loading}
              fullWidth
              className="bg-gray-900 text-white font-semibold h-12 rounded-xl text-md shadow-lg shadow-gray-900/10 hover:shadow-gray-900/20 hover:scale-[1.01] transition-all mt-4"
            >
              Entrar
            </Button>
          </form>
        </CardBody>
        <CardFooter className="justify-center pt-6 pb-2">
          <p className="text-sm text-gray-500">
            Não tem uma conta? <Link href="/register" className="text-gray-900 font-semibold hover:underline">Criar conta</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
