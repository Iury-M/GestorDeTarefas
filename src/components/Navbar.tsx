'use client';

import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  User as UserAvatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar
} from "@heroui/react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { FiLogOut, FiLayout, FiUser, FiChevronDown, FiHelpCircle } from "react-icons/fi";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <HeroNavbar
      maxWidth="xl"
      position="sticky"
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-sm h-20 transition-all duration-300"
      classNames={{
        wrapper: "px-4 md:px-6",
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[3px]",
          "data-[active=true]:after:rounded-t-full",
          "data-[active=true]:after:bg-gray-900",
          "data-[active=true]:after:transition-all"
        ]
      }}
    >
      <NavbarBrand className="gap-3">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl shadow-lg shadow-gray-900/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20" /></svg>
          </div>
          <div className="flex flex-col">
            <p className="font-bold text-xl tracking-tight text-gray-900 leading-none">Life<span className="font-light text-gray-500">Lab</span></p>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Workspace</span>
          </div>
        </Link>
      </NavbarBrand>

      <NavbarContent justify="end" className="gap-6">
        {session ? (
          <Dropdown
            placement="bottom-end"
            showArrow
            offset={20}
            classNames={{
              base: "before:bg-white before:shadow-none",
              content: "p-2 border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] bg-white/90 backdrop-blur-md rounded-2xl w-64 ring-0"
            }}
          >
            <DropdownTrigger>
              <div className="flex items-center gap-3 cursor-pointer p-1.5 pr-3 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <Avatar
                  isBordered
                  color="default"
                  src={session.user?.image || undefined}
                  name={session.user?.name?.[0]?.toUpperCase()}
                  className="w-9 h-9 text-sm font-bold ring-2 ring-white shadow-md"
                />
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-bold text-gray-800 leading-none">{session.user?.name?.split(' ')[0]}</span>
                  <span className="text-[10px] text-gray-400 font-medium">Free Plan</span>
                </div>
                <FiChevronDown className="text-gray-400 ml-1" />
              </div>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="User Actions"
              variant="flat"
            >
              <DropdownItem key="profile" className="h-16 gap-2 opacity-100 cursor-default mb-2 bg-gray-50/50 rounded-xl" textValue="Perfil">
                <div className="flex flex-col px-1">
                  <p className="font-bold text-gray-900 leading-tight">{session.user?.name}</p>
                  <p className="font-medium text-xs text-gray-400 truncate w-full">{session.user?.email}</p>
                </div>
              </DropdownItem>

              <DropdownItem
                key="dashboard"
                href="/dashboard"
                startContent={<FiLayout className="text-gray-500" size={18} />}
                className="rounded-lg h-10 data-[hover=true]:bg-gray-100/80 font-medium text-gray-600"
              >
                Dashboard
              </DropdownItem>
              <DropdownItem
                href="/profile"
                startContent={<FiUser className="text-gray-500" size={18} />}
                className="rounded-lg h-10 data-[hover=true]:bg-gray-100/80 font-medium text-gray-600"
              >
                Minha Conta (Loading)
              </DropdownItem>
              <DropdownItem
                key="help"
                href="/ajuda"
                startContent={<FiHelpCircle className="text-gray-500" size={18} />}
                className="rounded-lg h-10 data-[hover=true]:bg-gray-100/80 font-medium text-gray-600"
              >
                Ajuda & Suporte (404)
              </DropdownItem>

              <DropdownItem
                key="logout"
                color="danger"
                onPress={() => signOut()}
                startContent={<FiLogOut size={18} />}
                className="text-danger rounded-lg h-10 mt-2 data-[hover=true]:bg-red-50 font-medium"
              >
                Sair
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          !isAuthPage && (
            <>
              <NavbarItem>
                <Link href="/login" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                  Entrar
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Button
                  as={Link}
                  href="/register"
                  className="bg-gray-900 text-white font-bold text-sm h-10 px-6 rounded-xl shadow-lg shadow-gray-900/10 hover:shadow-gray-900/20 hover:-translate-y-0.5 transition-all active:scale-95"
                  variant="flat"
                >
                  Começar Grátis
                </Button>
              </NavbarItem>
            </>
          )
        )}
      </NavbarContent>
    </HeroNavbar>
  );
}
