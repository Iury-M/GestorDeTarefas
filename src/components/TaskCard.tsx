'use client';

import { Card, CardHeader, CardBody, CardFooter, Chip, Button, Popover, PopoverTrigger, PopoverContent, Tooltip } from "@heroui/react";
import TaskForm from "./TaskForm";
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useState } from "react";

type Task = {
  _id: string;
  title: string;
  description: string;
  status: 'pendente' | 'em_andamento' | 'concluida';
  createdAt?: string;
};

type TaskCardProps = {
  task: Task;
  onUpdate: (task: Task) => Promise<void>; // Voltou a ser onUpdate pois o card gerencia o save
  onDelete: (id: string) => Promise<void>;
  isSaving?: boolean;
  isSelected?: boolean;
};

const statusColorMap: Record<string, "warning" | "primary" | "success" | "default"> = {
  pendente: "warning",
  em_andamento: "primary",
  concluida: "success",
};

const statusDotMap: Record<string, string> = {
  pendente: "bg-yellow-400",
  em_andamento: "bg-blue-500",
  concluida: "bg-green-500",
};

const statusLabelMap: Record<string, string> = {
  pendente: "Pendente",
  em_andamento: "Andamento",
  concluida: "Feito",
};

export default function TaskCard({ task, onPress }: { task: Task; onPress: (task: Task) => void }) {

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Data não disponível';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return 'Data inválida';
    }
  };

  return (
    <Card
      isPressable
      onPress={() => onPress(task)}
      className="w-full bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 hover:border-gray-200 group"
      radius="none"
      classNames={{
        base: "rounded-[24px]"
      }}
    >
      <CardHeader className="flex justify-between items-start pb-2 pt-5 px-5">
        <div className="flex flex-col gap-1.5 max-w-[70%]">
          <div className="flex items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full shadow-sm ring-2 ring-white ${statusDotMap[task.status] || "bg-gray-300"}`} />
            <h4 className="text-lg font-bold leading-tight text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">{task.title}</h4>
          </div>
          <small className="text-gray-400 font-semibold text-xs pl-5 opacity-80">
            {formatDate(task.createdAt)}
          </small>
        </div>
        <Chip
          color={statusColorMap[task.status] || "default"}
          size="sm"
          variant="flat"
          className="uppercase font-extrabold text-[10px] tracking-widest border-none"
          radius="full"
          classNames={{
            base: "h-7",
            content: "px-3"
          }}
        >
          {statusLabelMap[task.status] || task.status}
        </Chip>
      </CardHeader>

      <CardBody className="px-5 py-3 text-gray-500 min-h-[70px]">
        <p className="line-clamp-3 text-sm leading-relaxed font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
          {task.description || "Nenhuma descrição fornecida."}
        </p>
      </CardBody>

      <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </Card>
  );
}