'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem
} from "@heroui/react";
import { useState, useEffect } from "react";

type Task = {
  _id?: string;
  title: string;
  description: string;
  status: string;
};

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => Promise<void>;
  initialData?: Task | null;
  loading: boolean;
};

export default function TaskModal({ isOpen, onClose, onSave, onDelete, initialData, loading }: TaskModalProps & { onDelete?: (id: string) => Promise<void> }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pendente");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setStatus(initialData.status);
    } else {
      setTitle("");
      setDescription("");
      setStatus("pendente");
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    onSave({
      _id: initialData?._id,
      title,
      description,
      status
    });
  };

  const handleDelete = () => {
    if (initialData?._id && onDelete) {
      onDelete(initialData._id);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      backdrop="blur"
      radius="lg"
      className="z-[9999]"
      classNames={{
        base: "border border-gray-100 bg-white dark:bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:m-0 m-4 z-[9999]", // Margem mobile
        header: "border-b border-gray-100 pb-4",
        footer: "border-t border-gray-100 pt-4 flex justify-between",
        closeButton: "hover:bg-gray-100 active:bg-gray-200 text-gray-400 top-4 right-4 z-[10000]",
        backdrop: "z-[9998]"
      }}
    >
      <ModalContent className="p-2 sm:p-4">
        <ModalHeader className="flex flex-col gap-1 pr-8">
          <h2 className="text-xl font-bold text-gray-900">{initialData ? "Detalhes da Tarefa" : "Criar Nova Tarefa"}</h2>
          <p className="text-sm font-normal text-gray-500">Visualize ou edite as informações abaixo.</p>
        </ModalHeader>
        <ModalBody className="py-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Título</label>
            <Input
              aria-label="Título da Tarefa"
              placeholder="Ex: Reunião de Projeto"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="bordered"
              classNames={{
                inputWrapper: "h-11 border-gray-200 hover:border-gray-400 focus-within:!border-gray-900 bg-transparent shadow-none transition-colors"
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Descrição</label>
            <Textarea
              aria-label="Descrição da Tarefa"
              placeholder="Adicione detalhes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="bordered"
              classNames={{
                inputWrapper: "border-gray-200 hover:border-gray-400 focus-within:!border-gray-900 bg-transparent shadow-none transition-colors"
              }}
              minRows={5}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Status</label>
            <Select
              aria-label="Status da Tarefa"
              selectedKeys={[status]}
              onChange={(e) => setStatus(e.target.value)}
              variant="bordered"
              classNames={{
                trigger: "h-11 border-gray-200 hover:border-gray-400 focus-within:!border-gray-900 bg-transparent shadow-none transition-colors data-[open=true]:border-gray-900",
                value: "text-gray-900"
              }}
              disallowEmptySelection
            >
              <SelectItem key="pendente" className="text-gray-700">Pendente</SelectItem>
              <SelectItem key="em_andamento" className="text-gray-700">Em Andamento</SelectItem>
              <SelectItem key="concluida" className="text-gray-700">Concluída</SelectItem>
            </Select>
          </div>
        </ModalBody>
        <ModalFooter className="flex-col-reverse sm:flex-row gap-3">
          {initialData && onDelete ? (
            <Button
              color="danger"
              variant="flat"
              onPress={handleDelete}
              className="font-semibold text-red-600 bg-red-50 hover:bg-red-100 w-full sm:w-auto"
            >
              Excluir
            </Button>
          ) : <div className="hidden sm:block"></div>}

          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="light"
              onPress={onClose}
              className="font-medium text-gray-500 hover:text-gray-900 flex-1 sm:flex-none"
            >
              Cancelar
            </Button>
            <Button
              className="bg-gray-900 text-white font-semibold shadow-lg shadow-gray-900/10 hover:shadow-gray-900/20 flex-1 sm:flex-none"
              onPress={handleSubmit}
              isLoading={loading}
            >
              Salvar
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
