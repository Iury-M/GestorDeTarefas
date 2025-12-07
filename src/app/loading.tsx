'use client';

import { Spinner, Button } from "@heroui/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FiHome, FiRefreshCw } from "react-icons/fi";

export default function Loading() {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white p-6 text-center">
      {/* Custom Tailwind Spinner to ensure visibility */}
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />

      <h2 className="text-xl font-bold text-gray-700 animate-pulse">Carregando...</h2>

      {showMessage && (
        <div className="mt-8 flex flex-col items-center animate-fade-in-up">
          <p className="text-gray-500 font-medium mb-6 max-w-sm">
            Parece que isso vai demorar um pouco, recarregue a página ou volte para o início.
          </p>
          <div className="flex gap-4">
            <Button
              onPress={() => window.location.reload()}
              variant="flat"
              startContent={<FiRefreshCw />}
            >
              Recarregar
            </Button>

            <Link href="/">
              <Button color="primary" startContent={<FiHome />}>
                Voltar para o Início
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
