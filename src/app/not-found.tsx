'use client';

import Link from 'next/link';
import { Button } from "@heroui/react";
import { FiAlertCircle } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white p-4 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-50 text-red-500">
        <FiAlertCircle size={48} />
      </div>
      <h2 className="mb-2 text-3xl font-bold text-gray-900">Página não encontrada</h2>
      <p className="mb-8 max-w-md text-gray-500">
        Desculpe, não conseguimos encontrar a página que você está procurando. Ela pode ter sido movida ou não existir.
      </p>
      <Link href="/">
        <Button color="primary" variant="shadow" size="lg" className="font-bold">
          Voltar para o Início
        </Button>
      </Link>
    </div>
  );
}
