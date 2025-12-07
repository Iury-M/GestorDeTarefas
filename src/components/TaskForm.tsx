'use client';

import {
  Button,
  Input,
  Textarea,
  Tab,
  Tabs
} from "@heroui/react";
import { useState, useEffect } from "react";
// Usando React Icons como solicitado/instalado
import { FiType, FiAlignLeft, FiActivity } from "react-icons/fi";

type Task = {
  _id?: string;
  title: string;
  description: string;
  status: string;
};

type TaskFormProps = {
  onSave: (task: Task) => Promise<void>;
  onCancel: () => void;
  initialData?: Task | null;
  loading?: boolean;
};

export default function TaskForm({ onSave, onCancel, initialData, loading = false }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pendente");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setStatus(initialData.status);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      _id: initialData?._id,
      title,
      description,
      status
    });
  };

  return (
    <form className="flex flex-col gap-5 w-full p-6" onSubmit={handleSubmit}>
      <header className="flex flex-col items-center gap-1 border-b border-gray-100 pb-4">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
          {initialData ? "Editar Tarefa" : "Nova Tarefa"}
        </h3>
        <p className="text-xs text-gray-400 font-medium">Preencha os detalhes da sua atividade</p>
      </header>

      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-extrabold text-gray-500 ml-4 uppercase tracking-widest">Título</label>
          <Input
            placeholder="Ex: Reunião de Planejamento"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="flat"
            radius="full" // Bordas totalmente redondas
            size="md"
            startContent={<div className="pointer-events-none flex items-center"><FiType className="text-gray-400 mr-4" /></div>} // Mais espaço no ícone
            classNames={{
              inputWrapper: "bg-gray-50 hover:bg-gray-100 focus-within:bg-white shadow-none h-11 transition-all duration-300 data-[hover=true]:bg-gray-100 group-data-[focus=true]:bg-white !border-none !ring-0 !outline-none px-6", // Mais padding lateral
              input: "text-gray-900 font-semibold placeholder:text-gray-400 !border-none !ring-0 !outline-none",
            }}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-extrabold text-gray-500 ml-4 uppercase tracking-widest">Descrição</label>
          <Textarea
            placeholder="Adicione detalhes, contexto ou links..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="flat"
            minRows={2}
            radius="lg"
            size="md"
            startContent={<div className="h-full py-3"><FiAlignLeft className="text-gray-400 mr-4" /></div>}
            classNames={{
              inputWrapper: "bg-gray-50 hover:bg-gray-100 focus-within:bg-white shadow-none transition-all duration-300 py-2 h-auto min-h-[80px] data-[hover=true]:bg-gray-100 group-data-[focus=true]:bg-white !border-none !ring-0 !outline-none rounded-[20px] px-6", // Borda manual para textarea
              input: "text-gray-700 font-medium placeholder:text-gray-400 !bg-transparent !border-none !ring-0 !outline-none text-sm"
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-extrabold text-gray-500 ml-1 uppercase tracking-widest">Status Atual</label>
          <Tabs
            aria-label="Status da Tarefa"
            selectedKey={status}
            onSelectionChange={(key) => setStatus(key as string)}
            fullWidth
            size="md"
            radius="full"
            classNames={{
              cursor: "w-full bg-gray-900 shadow-lg shadow-gray-900/20 rounded-full",
              tabList: "bg-gray-100 p-1 rounded-full gap-2 border border-gray-100",
              tab: "h-8 rounded-full",
              tabContent: "group-data-[selected=true]:text-white text-gray-500 font-bold text-xs transition-colors",
            }}
          >
            <Tab key="pendente" title="A Fazer" />
            <Tab key="em_andamento" title="Em Andamento" />
            <Tab key="concluida" title="Concluída" />
          </Tabs>
        </div>
      </div>

      <div className="flex gap-3 mt-4 pt-4 border-t border-gray-50">
        <Button
          fullWidth
          variant="flat"
          onPress={onCancel}
          className="h-11 font-bold text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-2xl"
        >
          Cancelar
        </Button>
        <Button
          fullWidth
          type="submit"
          className="h-11 bg-gray-900 text-white font-bold text-sm rounded-2xl shadow-xl shadow-gray-900/10 hover:shadow-gray-900/25 active:scale-[0.98] transition-all"
          isLoading={loading}
          startContent={!loading && <FiActivity className="mt-0.5" />}
        >
          {initialData ? "Salvar" : "Criar Tarefa"}
        </Button>
      </div>
    </form>
  );
}
