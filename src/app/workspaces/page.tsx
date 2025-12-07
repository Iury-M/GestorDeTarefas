'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Spinner,
  Button,
  Card,
  CardBody,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useDisclosure,
  Textarea
} from "@heroui/react";
import {
  FiPlus,
  FiBriefcase,
  FiUser,
  FiLayout,
  FiBook,
  FiCoffee,
  FiGlobe,
  FiCode,
  FiMusic,
  FiArrowRight,
  FiMoreVertical,
  FiTrash2
} from "react-icons/fi";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@heroui/react";

interface Workspace {
  name: string;
  description: string;
  icon: string;
}

const ICONS = [
  { id: "layout", icon: FiLayout, label: "Geral" },
  { id: "briefcase", icon: FiBriefcase, label: "Trabalho" },
  { id: "user", icon: FiUser, label: "Pessoal" },
  { id: "book", icon: FiBook, label: "Estudos" },
  { id: "coffee", icon: FiCoffee, label: "Lazer" },
  { id: "code", icon: FiCode, label: "Dev" },
  { id: "music", icon: FiMusic, label: "Hobby" },
  { id: "globe", icon: FiGlobe, label: "Viagem" },
];

export default function WorkspacesPage() {
  const { status } = useSession();
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpenChange } = useDisclosure();

  // Form States
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newIcon, setNewIcon] = useState("layout");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchWorkspaces();
    }
  }, [status, router]);

  const fetchWorkspaces = async () => {
    try {
      const res = await fetch("/api/user/workspace");
      if (res.ok) {
        const data = await res.json();
        const formatted = (data.workspaces || []).map((w: any) =>
          typeof w === 'string'
            ? { name: w, description: '', icon: 'layout' }
            : w
        );
        setWorkspaces(formatted);
      }
    } catch (error) {
      console.error("Erro ao buscar workspaces:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = async (closeFn: () => void) => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/user/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          description: newDesc,
          icon: newIcon
        })
      });
      if (res.ok) {
        const data = await res.json();
        setWorkspaces(data.workspaces);
        setNewName("");
        setNewDesc("");
        setNewIcon("layout");
        closeFn();
        // Optional: Redirect immediately or just refresh list
      }
    } catch (error) {
      console.error("Erro ao criar workspace:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleSelectWorkspace = async (name: string) => {
    router.push(`/dashboard?workspace=${encodeURIComponent(name)}`);
  };

  const renderIcon = (iconName: string, size = 28, className = "") => {
    const found = ICONS.find(i => i.id === iconName) || ICONS[0];
    const IconComp = found.icon;
    return <IconComp size={size} className={className} />;
  };

  // Cores Pastel Suaves para Minimalismo
  const getWorkspaceTheme = (iconName: string) => {
    switch (iconName) {
      case "briefcase": return "bg-blue-50/40 hover:bg-blue-50/80 text-blue-600";
      case "user": return "bg-emerald-50/40 hover:bg-emerald-50/80 text-emerald-600";
      case "book": return "bg-amber-50/40 hover:bg-amber-50/80 text-amber-600";
      case "code": return "bg-violet-50/40 hover:bg-violet-50/80 text-violet-600";
      case "music": return "bg-rose-50/40 hover:bg-rose-50/80 text-rose-600";
      case "globe": return "bg-cyan-50/40 hover:bg-cyan-50/80 text-cyan-600";
      case "coffee": return "bg-orange-50/40 hover:bg-orange-50/80 text-orange-600";
      default: return "bg-gray-50/50 hover:bg-gray-100 text-gray-600";
    }
  };

  if (status === "loading" || loading) return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-12 h-12 rounded-2xl bg-gray-100 mb-2"></div>
        <div className="h-4 w-32 bg-gray-50 rounded-full"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-900 selection:text-white">
      <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-20">

        {/* --- HERO SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-16 gap-8 animate-fade-in-up">
          <div className="max-w-xl">
            <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">
              Visão Geral
            </h5>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              Seus Espaços
            </h1>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">
              Centralize seus projetos e contextos em um único lugar.
              Mantenha o foco onde você precisa hoje.
            </p>
          </div>

          <Popover
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="bottom-end"
            showArrow={false}
            offset={20}
            backdrop="opaque"
            classNames={{
              base: "before:bg-white/20",   // Backdrop tweak
              content: "p-0 rounded-[2rem] w-[380px] border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] outline-none"
            }}
          >
            <PopoverTrigger>
              <Button
                className="group h-14 px-8 rounded-full bg-gray-900 text-white font-bold text-base shadow-xl shadow-gray-900/10 hover:shadow-2xl hover:shadow-gray-900/20 hover:scale-105 active:scale-95 transition-all duration-300"
                startContent={<FiPlus size={22} className="group-hover:rotate-90 transition-transform duration-300" />}
              >
                Novo Espaço
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              {(titleProps) => (
                <div className="flex flex-col bg-white w-full overflow-hidden">
                  <div className="p-8 pb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1" {...titleProps}>Criar Espaço</h3>
                    <p className="text-sm text-gray-500 font-medium">Defina um novo contexto para suas tarefas.</p>
                  </div>

                  <div className="px-8 pb-8 flex flex-col gap-6">
                    {/* Nome */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-extrabold text-gray-500 ml-4 uppercase tracking-widest">Nome</label>
                      <Input
                        autoFocus
                        placeholder="Ex: Marketing"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        variant="flat"
                        radius="full"
                        classNames={{
                          inputWrapper: "bg-gray-50 hover:bg-gray-100 focus-within:bg-white shadow-none h-12 transition-all duration-300 data-[hover=true]:bg-gray-100 group-data-[focus=true]:bg-white !border-none !ring-0 !outline-none px-6",
                          input: "text-base font-semibold text-gray-900 placeholder:text-gray-300 !border-none !ring-0 !outline-none"
                        }}
                      />
                    </div>

                    {/* Descrição */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-extrabold text-gray-500 ml-4 uppercase tracking-widest">Descrição</label>
                      <Textarea
                        placeholder="Objetivo deste espaço..."
                        minRows={3}
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        variant="flat"
                        radius="lg"
                        classNames={{
                          inputWrapper: "bg-gray-50 hover:bg-gray-100 focus-within:bg-white shadow-none p-4 transition-all duration-300 data-[hover=true]:bg-gray-100 group-data-[focus=true]:bg-white !border-none !ring-0 !outline-none",
                          input: "text-sm font-medium text-gray-900 placeholder:text-gray-300 !border-none !ring-0 !outline-none h-full"
                        }}
                      />
                    </div>

                    {/* Ícones */}
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Ícone</span>
                      <div className="grid grid-cols-4 gap-3">
                        {ICONS.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setNewIcon(item.id)}
                            className={`aspect-square rounded-2xl flex items-center justify-center transition-all duration-300 ${newIcon === item.id
                              ? "bg-gray-900 text-white shadow-lg scale-110"
                              : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                              }`}
                          >
                            <item.icon size={20} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="w-full font-bold bg-gray-900 text-white rounded-2xl h-14 mt-2 shadow-lg shadow-gray-900/10 hover:shadow-xl hover:shadow-gray-900/20 active:scale-95 transition-all"
                      onPress={() => handleCreateWorkspace(onOpenChange)}
                      isLoading={creating}
                    >
                      Criar Agora
                    </Button>
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>

        {/* --- GRID SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {workspaces.map((ws, i) => {
            const themeClasses = getWorkspaceTheme(ws.icon);

            return (
              <Card
                key={ws.name + i}
                className="group border-0 bg-transparent shadow-none hover:bg-gray-50 rounded-[2.5rem] p-4 transition-colors duration-300 relative"
              >
                <CardBody className="bg-white rounded-[2rem] p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] group-hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] group-hover:-translate-y-1 transition-all duration-300 border border-gray-100/50 flex flex-col justify-between h-72 relative overflow-hidden">

                  {/* Top: Icon & Actions */}
                  <div className="flex justify-between items-start mb-6 z-10 w-full relative">
                    <div
                      onClick={() => handleSelectWorkspace(ws.name)}
                      className={`cursor-pointer w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${themeClasses}`}
                    >
                      {renderIcon(ws.icon, 32)}
                    </div>

                    {/* Menu de Ações (Excluir) - Fora da área de clique do card */}
                    <Dropdown backdrop="blur">
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          variant="light"
                          radius="full"
                          size="sm"
                          className="text-gray-400 hover:bg-gray-100 hover:text-gray-600 -mr-2 -mt-2 z-50 relative"
                        >
                          <FiMoreVertical size={20} />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Ações do Workspace"
                        onAction={(key) => {
                          if (key === 'delete') handleDeleteWorkspace(ws.name);
                        }}
                      >
                        <DropdownItem
                          key="delete"
                          className="text-danger"
                          color="danger"
                          startContent={<FiTrash2 size={18} />}
                        >
                          Excluir Espaço
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>

                  </div>

                  {/* Middle Content - Clickable for Navigation */}
                  <div
                    className="z-10 cursor-pointer flex-1"
                    onClick={() => handleSelectWorkspace(ws.name)}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-black transition-colors">
                      {ws.name}
                    </h3>
                    <p className="text-gray-400 font-medium leading-relaxed line-clamp-2">
                      {ws.description || "Espaço dedicado para suas tarefas e organização diária."}
                    </p>
                  </div>

                  {/* Bottom: Action Hint */}
                  <div
                    onClick={() => handleSelectWorkspace(ws.name)}
                    className="mt-8 flex items-center gap-2 text-sm font-bold text-gray-900 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-75 cursor-pointer"
                  >
                    <span>Acessar</span>
                    <FiArrowRight />
                  </div>

                  {/* Decorativo de Fundo */}
                  <div className={`absolute -right-12 -bottom-12 w-48 h-48 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none ${themeClasses}`} />
                </CardBody>
              </Card>
            );
          })}

          {/* Empty State Card - Se não houver workspaces */}
          {workspaces.length === 0 && (
            <div className="col-span-full py-32 flex flex-col items-center justify-center text-center opacity-60">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <FiLayout size={40} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Comece por aqui</h3>
              <p className="text-gray-500 max-w-sm">
                Crie seu primeiro espaço para começar a organizar suas tarefas de forma profissional.
              </p>
            </div>
          )}
        </div>

      </div >
    </div >
  );
}
