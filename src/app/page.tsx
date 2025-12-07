'use client';

import { Button, Link } from "@heroui/react";

export default function Home() {
  return (
    <div className="relative overflow-hidden w-full h-full min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 bg-gray-50">

      {/* Círculos decorativos sutis */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100 rounded-full blur-[100px] opacity-60 pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-100 rounded-full blur-[100px] opacity-60 pointer-events-none mix-blend-multiply" />

      <div className="flex flex-col items-center max-w-4xl text-center z-10 gap-8 animate-fade-in-up">

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
          Organize sua rotina <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900">com clareza.</span>
        </h1>

        <p className="text-xl text-gray-500 max-w-2xl leading-relaxed font-light">
          A ferramenta minimalista para quem precisa de foco.
          Sem distrações, apenas o que importa para você realizar mais.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
          <Button
            as={Link}
            href="/workspaces"
            color="primary"
            size="lg"
            className="w-full sm:w-auto font-semibold bg-gray-900 text-white shadow-xl shadow-gray-900/20 hover:bg-gray-800 transition-all rounded-full px-8 py-6 h-auto text-lg"
          >
            Começar Grátis
          </Button>
          <Button
            as={Link}
            href="/register"
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto font-semibold text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 hover:bg-white rounded-full px-8 py-6 h-auto text-lg"
          >
            Criar Conta
          </Button>
        </div>
      </div>
    </div>
  );
}
