'use client';

import { useState, useEffect, useMemo } from "react";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Spinner,
  Tabs,
  Tab,
  Accordion,
  AccordionItem
} from "@heroui/react";
import TaskCard from "@/components/TaskCard";
import TaskForm from "@/components/TaskForm";
import TaskModal from "@/components/TaskModal"; // Alterado para TaskModal
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

// Ícones
import { FiPlus, FiList } from 'react-icons/fi';

type TaskStatus = 'pendente' | 'em_andamento' | 'concluida';

type Task = {
  _id?: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt?: string;
  workspace?: string;
};

type Workspace = {
  name: string;
  description?: string;
  icon?: string;
};

// Configuração para o Kanban
const TASK_STATUSES = [
  { key: 'pendente', title: 'A Fazer', color: 'bg-gray-50' },
  { key: 'em_andamento', title: 'Em Andamento', color: 'bg-blue-50' },
  { key: 'concluida', title: 'Concluídas', color: 'bg-green-50' },
];

// Opções de Filtro
const FILTER_OPTIONS = [
  { key: 'all', title: 'Todas', icon: <FiList size={16} /> },
  { key: 'pendente', title: 'Pendentes', icon: <span className="w-2 h-2 rounded-full bg-yellow-400 mr-1 inline-block"></span> },
  { key: 'em_andamento', title: 'Em Andamento', icon: <span className="w-2 h-2 rounded-full bg-blue-500 mr-1 inline-block"></span> },
  { key: 'concluida', title: 'Concluídas', icon: <span className="w-2 h-2 rounded-full bg-green-500 mr-1 inline-block"></span> },
];

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlWorkspace = searchParams.get('workspace');

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false); // Para o botão "Nova Tarefa"

  // Detalhes da Tarefa (Modal)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // NOVO ESTADO DE FILTRO
  const [currentFilter, setCurrentFilter] = useState<'all' | TaskStatus>('all');

  // ESTADOS DE WORKSPACE
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState("Meu Kanban");
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  // --- Funções de Busca e CRUD ---

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchWorkspaces();
    }
  }, [status, router]);

  // Sincroniza URL com estado
  useEffect(() => {
    if (urlWorkspace) {
      setActiveWorkspace(urlWorkspace);
    }
  }, [urlWorkspace]);

  useEffect(() => {
    if (status === "authenticated" && activeWorkspace) {
      // Atualiza URL se mudar estado interno (exceto na carga inicial se já tiver url)
      if (urlWorkspace !== activeWorkspace) {
        router.push(`/dashboard?workspace=${encodeURIComponent(activeWorkspace)}`);
      }
      fetchTasks();
    }
  }, [activeWorkspace, status]);

  const fetchWorkspaces = async () => {
    try {
      const res = await fetch("/api/user/workspace");
      if (res.ok) {
        const data = await res.json();
        // Normaliza dados para sempre serem objetos
        const formatted: Workspace[] = (data.workspaces || []).map((w: any) =>
          typeof w === 'string'
            ? { name: w, description: '', icon: 'layout' }
            : w
        );
        setWorkspaces(formatted);

        // Se não tiver URL, usa o ativo do banco ou o primeiro
        if (!urlWorkspace) {
          const active = data.activeWorkspace || (formatted[0]?.name || "Meu Kanban");
          setActiveWorkspace(active);
        } else {
          // Garante que se tiver URL, ela é respeitada mesmo após o fetch
          setActiveWorkspace(urlWorkspace);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar workspaces:", error);
    }
  };

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim()) return;
    try {
      const res = await fetch("/api/user/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newWorkspaceName })
      });
      if (res.ok) {
        const data = await res.json();
        // Atualiza conforme a resposta da API (que retorna lista atualizada)
        const formatted: Workspace[] = (data.workspaces || []).map((w: any) =>
          typeof w === 'string' ? { name: w } : w
        );
        setWorkspaces(formatted);
        setActiveWorkspace(newWorkspaceName); // Switch to new
        setIsCreatingWorkspace(false);
        setNewWorkspaceName("");
      }
    } catch (error) {
      console.error("Erro ao criar workspace:", error);
    }
  };

  const handleDeleteWorkspace = async (name: string) => {
    if (!confirm(`Excluir workspace "${name}" e todas as suas tarefas?`)) return;
    try {
      const res = await fetch("/api/user/workspace", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });
      if (res.ok) {
        const data = await res.json();
        const formatted: Workspace[] = (data.workspaces || []).map((w: any) =>
          typeof w === 'string' ? { name: w } : w
        );
        setWorkspaces(formatted);
        setActiveWorkspace(data.activeWorkspace || formatted[0]?.name || "Meu Kanban");
      }
    } catch (error) {
      console.error("Erro ao deletar workspace:", error);
    }
  };

  const handleSwitchWorkspace = async (name: string) => {
    setActiveWorkspace(name);
    // Persiste escolha no banco (opcional, já muda via URL)
    try {
      await fetch("/api/user/workspace", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activeWorkspace: name })
      });
    } catch (e) { console.error(e); }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks?workspace=${encodeURIComponent(activeWorkspace)}`);
      const data: Task[] = await res.json();
      data.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setTasks(data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (task: Task) => {
    setLoading(true);
    try {
      const isEditing = !!task._id;
      const url = isEditing ? `/api/tasks/${task._id}` : "/api/tasks";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, workspace: activeWorkspace }),
      });

      if (res.ok) {
        await fetchTasks();
        setIsPopoverOpen(false);
        setIsTaskModalOpen(false); // Fecha o modal também
        return;
      }
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
      alert("Houve um erro ao salvar a tarefa.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTasks(prev => prev.filter(task => task._id !== id));
        setIsTaskModalOpen(false); // Fecha o modal se estiver aberto
      }
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      alert("Houve um erro ao excluir a tarefa.");
    }
  };

  // Abre modal para criar
  const openCreateModal = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  // Abre modal para editar
  // Abre modal para editar
  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  // Lógica de Agrupamento COM FILTRO
  const filteredAndGroupedTasks = useMemo(() => {
    // 1. Aplica o Filtro
    const filteredTasks = tasks.filter(task => {
      if (currentFilter === 'all') return true;
      return task.status === currentFilter;
    });

    // 2. Agrupa (apenas os status que estão ativos no Kanban)
    return filteredTasks.reduce((acc, task) => {
      const statusKey = task.status;
      if (!acc[statusKey]) {
        acc[statusKey] = [];
      }
      acc[statusKey].push(task);
      return acc;
    }, {} as Record<TaskStatus, Task[]>);
  }, [tasks, currentFilter]);

  // --- Renderização ---

  if (status === "loading" || (loading && !tasks.length)) return (
    <div className="flex justify-center items-center h-[calc(100vh-100px)]">
      <Spinner size="lg" />
    </div>
  );

  const totalTasks = tasks.length;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">

      {/* 1. Workspaces Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 pb-2 mb-6">
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 pb-1">
            {activeWorkspace}
          </h1>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {workspaces.map((ws, index) => (
              <div
                key={ws.name || index} // Chave corrigida
                onClick={() => handleSwitchWorkspace(ws.name)}
                className={`
                            px-4 py-2 rounded-full cursor-pointer text-sm font-bold transition-all whitespace-nowrap flex items-center
                            ${activeWorkspace === ws.name
                    ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20'
                    : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                  }
                        `}
              >
                {ws.name}
                {/* Botão de excluir */}
                {activeWorkspace === ws.name && workspaces.length > 1 && (
                  <span
                    onClick={(e) => { e.stopPropagation(); handleDeleteWorkspace(ws.name); }}
                    className="ml-2 opacity-50 hover:opacity-100 text-[10px] text-red-300 hover:text-red-500 bg-white/20 rounded-full px-1.5 py-0.5"
                    title="Excluir espaço"
                  >
                    ✕
                  </span>
                )}
              </div>
            ))}

            {/* Botão Criar Novo Workspace (Atalho rápido na dashboard) */}
            <Popover isOpen={isCreatingWorkspace} onOpenChange={setIsCreatingWorkspace} placement="bottom-start" showArrow offset={10}>
              <PopoverTrigger>
                <button className="px-3 py-2 rounded-full bg-gray-100/50 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors">
                  <FiPlus />
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-4 w-[260px] flex gap-2">
                <input
                  autoFocus
                  className="flex-1 bg-gray-50 border-none outline-none text-sm font-semibold text-gray-800 placeholder:text-gray-400 rounded-lg px-2 py-1"
                  placeholder="Nome do espaço..."
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateWorkspace()}
                />
                <button
                  onClick={handleCreateWorkspace}
                  className="bg-gray-900 text-white rounded-lg p-1.5 hover:bg-gray-800 transition-colors"
                >
                  <FiPlus size={16} />
                </button>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <p className="text-gray-400 font-medium text-sm">
              <strong className="font-bold text-gray-800">{totalTasks}</strong> tarefa{totalTasks !== 1 && 's'} neste espaço
            </p>
          </div>
        </div>

        <div className="hidden md:flex gap-3">
          <Button
            className="font-semibold bg-white text-gray-600 hover:bg-gray-50 border border-gray-200/60 shadow-sm hover:shadow-md rounded-xl px-5 h-11 transition-all"
            onPress={async () => {
              setLoading(true);
              const sampleTasks = [
                { title: "Definir MVP", description: "Listar funcionalidades essenciais para a primeira versão", status: "concluida" },
                { title: "Design System", description: "Criar tokens de cores, tipografia e componentes base", status: "concluida" },
                { title: "Setup do Projeto", description: "Inicializar repositório e configurar CI/CD", status: "concluida" },
                { title: "Integração API", description: "Conectar frontend com endpoints de usuários e tarefas", status: "em_andamento" },
                { title: "Dashboard V1", description: "Implementar visualização de quadros e listas", status: "em_andamento" },
                { title: "Testes E2E", description: "Escrever testes com Cypress para fluxos críticos", status: "pendente" },
                { title: "Lançamento Beta", description: "Deploy em ambiente de staging para validadores", status: "pendente" },
              ];

              for (const t of sampleTasks) {
                const newTask: Task = { ...t, status: t.status as TaskStatus };
                await handleSave(newTask);
              }
              setLoading(false);
            }}
            isDisabled={loading}
          >
            Gerar Demo
          </Button>

          {/* NOVA TAREFA - BOTÃO (Desktop Popover) */}
          <Popover placement="bottom-end" showArrow offset={10} backdrop="transparent">
            <PopoverTrigger>
              <Button
                className="font-bold bg-gray-900 text-white shadow-xl shadow-gray-900/10 hover:shadow-gray-900/20 rounded-xl px-6 h-11 transition-all hover:scale-105 active:scale-95"
                startContent={<FiPlus size={18} />}
              >
                Nova Tarefa
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[340px] p-0 bg-white border border-gray-100 shadow-2xl rounded-3xl z-[9999]">
              <div className="w-full">
                <TaskForm
                  onSave={async (task) => {
                    await handleSave(task);
                    document.dispatchEvent(new MouseEvent('mousedown'));
                  }}
                  onCancel={() => {
                    document.dispatchEvent(new MouseEvent('mousedown'));
                  }}
                  loading={loading}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* 2. Filtros (Barra de Ícones Expansíveis) */}
      {/* MOBILE: Barra de Ícones Expansíveis (md:hidden) */}
      <div className="mb-8 flex justify-center md:hidden items-center gap-3">
        <div className="inline-flex p-1.5 bg-white border border-gray-100 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.03)] gap-1">
          {FILTER_OPTIONS.map((option) => {
            const isActive = currentFilter === option.key;
            const count = option.key !== 'all'
              ? (filteredAndGroupedTasks[option.key as TaskStatus] || []).length
              : totalTasks;

            return (
              <button
                key={option.key}
                onClick={() => setCurrentFilter(option.key as 'all' | TaskStatus)}
                className={`
                  relative flex items-center justify-center rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden cursor-pointer
                  ${isActive
                    ? 'bg-gray-900 text-white pr-5 pl-4 py-2.5 shadow-md'
                    : 'bg-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-600 w-11 h-11'
                  }
                `}
              >
                {/* Ícone Wrapper */}
                <span className={`flex items-center justify-center shrink-0 ${isActive ? 'mr-2' : ''}`}>
                  {/* Renderização condicional para ícones coloridos ou monocromáticos dependendo do estado */}
                  {option.key === 'all'
                    ? <FiList size={18} className={isActive ? 'text-white' : ''} />
                    : option.icon // Usa o ícone definido (bolinhas coloridas)
                  }
                </span>

                {/* Texto Expansível */}
                <div
                  className={`
                    flex items-center whitespace-nowrap overflow-hidden transition-all duration-500
                    ${isActive ? 'max-w-[200px] opacity-100' : 'max-w-0 opacity-0'}
                  `}
                >
                  <span className="text-sm font-bold mr-2">{option.title}</span>
                  {count > 0 && (
                    <span className="bg-white/20 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-md">
                      {count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Botão Nova Tarefa Mobile (Popover Grudado) */}
        <Popover placement="top" showArrow offset={10} backdrop="transparent">
          <PopoverTrigger>
            <button className="relative z-[90] w-11 h-11 shrink-0 flex items-center justify-center bg-gray-900 text-white rounded-full shadow-lg shadow-gray-900/20 active:scale-95 transition-transform">
              <FiPlus size={20} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0 bg-white border border-gray-100 shadow-2xl rounded-3xl z-[9999]">
            <div className="w-full">
              <TaskForm
                onSave={async (task) => {
                  await handleSave(task);
                  // Fechar popover hack
                  document.dispatchEvent(new MouseEvent('mousedown'));
                }}
                onCancel={() => {
                  document.dispatchEvent(new MouseEvent('mousedown'));
                }}
                loading={loading}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* DESKTOP: Tabs Padrão (hidden md:block) */}
      <div className="mb-8 hidden md:block">
        <Tabs
          aria-label="Filtro de Status"
          selectedKey={currentFilter}
          onSelectionChange={(key) => setCurrentFilter(key as 'all' | TaskStatus)}
          variant="light"
          radius="lg"
          classNames={{
            tabList: "p-1 bg-gray-100/50 rounded-full gap-2",
            tab: "h-9 px-4 rounded-full",
            cursor: "w-full bg-gray-900 shadow-md rounded-full",
            tabContent: "group-data-[selected=true]:text-white text-gray-500 font-bold text-sm transition-colors flex items-center gap-2",
          }}
        >
          {FILTER_OPTIONS.map((option) => (
            <Tab
              key={option.key}
              title={
                <div className="flex items-center gap-2">
                  <span className="opacity-70 group-data-[selected=true]:opacity-100">{option.icon}</span>
                  <span>{option.title}</span>
                  {/* Contador */}
                  {option.key !== 'all' && (filteredAndGroupedTasks[option.key as TaskStatus] || []).length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-extrabold rounded-md bg-gray-200/50 text-gray-600 group-data-[selected=true]:bg-gray-100 group-data-[selected=true]:text-gray-900">
                      {(filteredAndGroupedTasks[option.key as TaskStatus] || []).length}
                    </span>
                  )}
                  {option.key === 'all' && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-extrabold rounded-md bg-gray-200/50 text-gray-600 group-data-[selected=true]:bg-gray-100 group-data-[selected=true]:text-gray-900">
                      {totalTasks}
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </Tabs>
      </div>

      {/* 3. Mobile Task List (Accordion) - md:hidden */}
      <div className="md:hidden">
        <Accordion variant="splitted" className="px-0">
          {Object.entries(filteredAndGroupedTasks).flatMap(([statusKey, groupTasks]) =>
            groupTasks.map((task) => (
              <AccordionItem
                key={task._id}
                aria-label={task.title}
                title={
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${task.status === 'pendente' ? 'bg-yellow-400' :
                      task.status === 'em_andamento' ? 'bg-blue-500' : 'bg-green-500'
                      }`} />
                    <span className="font-semibold text-gray-900">{task.title}</span>
                  </div>
                }
                subtitle={<span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold ml-5.5">{task.status.replace('_', ' ')}</span>}
                classNames={{
                  base: "group-[.is-splitted]:px-4 group-[.is-splitted]:bg-white group-[.is-splitted]:shadow-[0_2px_10px_rgba(0,0,0,0.03)] rounded-2xl mb-3 border border-gray-100",
                  title: "text-base",
                  trigger: "py-4",
                  content: "pb-4 pt-0"
                }}
              >
                <div className="pl-2 flex flex-col gap-4">
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {task.description || "Sem descrição."}
                  </p>

                  <div className="flex gap-2 pt-2 border-t border-gray-50">
                    {/* Botão Editar com Popover Grudado */}
                    <Popover placement="bottom" showArrow offset={10} backdrop="transparent">
                      <PopoverTrigger>
                        <Button size="sm" variant="flat" className="flex-1 font-semibold text-gray-700 bg-gray-100">
                          Editar
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0 bg-white border border-gray-100 shadow-2xl rounded-3xl z-[9999]">
                        <div className="w-full">
                          <TaskForm
                            initialData={task}
                            onSave={async (updatedTask) => {
                              await handleSave(updatedTask);
                              document.dispatchEvent(new MouseEvent('mousedown'));
                            }}
                            onCancel={() => {
                              document.dispatchEvent(new MouseEvent('mousedown'));
                            }}
                            loading={loading}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Button
                      size="sm"
                      color="danger"
                      variant="flat"
                      className="flex-1 font-semibold"
                      onPress={() => handleDelete(task._id!)}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              </AccordionItem>
            ))
          )}
        </Accordion>
      </div>

      {/* 4. Desktop Kanban Board (Grid) - hidden md:grid */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
        {TASK_STATUSES.map(status => {
          const statusTasks = filteredAndGroupedTasks[status.key as TaskStatus] || [];

          // Define cores específicas por status
          const statusStyles = {
            pendente: "bg-gray-50/50 border-gray-200/60 hover:border-gray-300",
            em_andamento: "bg-blue-50/30 border-blue-200/50 hover:border-blue-300/60",
            concluida: "bg-green-50/30 border-green-200/50 hover:border-green-300/60",
          };

          return (
            <div
              key={status.key}
              className={`flex flex-col gap-4 md:p-5 p-0 rounded-3xl transition-all duration-300
                ${currentFilter === 'all'
                  // Mobile: Borda transparente. Desktop: Borda tracejada.
                  ? `md:border-2 md:border-dashed border-0 ${statusStyles[status.key as TaskStatus]}`
                  : 'bg-transparent border-transparent'
                }`}
              style={currentFilter !== 'all' ? { gridColumn: 'span 3' } : {}}
            >
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center justify-between px-1">
                <span>{status.title}</span>
                <span className="text-[10px] font-extrabold px-2 py-1 rounded-lg bg-white border border-gray-100 text-gray-400">
                  {statusTasks.length}
                </span>
              </h2>

              <div className="flex flex-col gap-3 min-h-[150px]">
                {statusTasks.length > 0 ? (
                  statusTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onPress={openEditModal} // Agora abrimos o modal ao clicar
                    />
                  ))
                ) : (
                  <div className="h-full min-h-[120px] flex flex-col items-center justify-center text-center p-4 border border-dashed border-gray-200 rounded-2xl">
                    <p className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Vazio</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Estado Vazio Global */}
      {totalTasks === 0 && !loading && (
        <div className="col-span-full flex flex-col items-center justify-center p-20 border border-dashed border-gray-200 rounded-3xl bg-gray-50/50 mt-4">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6 transform rotate-3">
            <span className="text-4xl filter grayscale opacity-50">🚀</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Tudo limpo por aqui!</h3>
          <p className="text-gray-500 max-w-xs text-center leading-relaxed">
            Seu quadro está vazio. Que tal criar uma nova tarefa ou gerar exemplos para começar?
          </p>
        </div>
      )}

      {/* Modal Centralizado de Tarefa (Criação e Edição) */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        initialData={selectedTask}
        loading={loading}
      />
    </div>
  );
}