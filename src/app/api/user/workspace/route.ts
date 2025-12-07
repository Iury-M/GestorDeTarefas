import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from '@/lib/db';
import User from '@/models/user';

// GET: Busca workspaces do usuário
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email }).select('workspaces activeWorkspace');

    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      workspaces: user.workspaces,
      activeWorkspace: user.activeWorkspace || (user.workspaces[0]?.name || "Meu Kanban")
    });

  } catch (error) {
    console.error("Erro ao buscar workspaces:", error);
    return NextResponse.json({ message: 'Erro interno ao buscar workspaces' }, { status: 500 });
  }
}

// POST: Cria novo workspace
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    await connectDB();
    const { name, description, icon } = await request.json();

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ message: 'Nome inválido' }, { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
    }

    // Verifica duplicação
    const exists = user.workspaces.some((w: any) => {
      if (typeof w === 'string') return w === name;
      return w.name === name;
    });

    if (!exists) {
      user.workspaces.push({
        name,
        description: description || "",
        icon: icon || "layout"
      });
      await user.save();
    }

    return NextResponse.json({ workspaces: user.workspaces });
  } catch (error) {
    console.error("Erro ao criar workspace:", error);
    return NextResponse.json({ message: 'Erro ao criar workspace' }, { status: 500 });
  }
}

// PATCH: Atualiza workspace ativo
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });

    await connectDB();
    const { activeWorkspace } = await request.json();

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { activeWorkspace },
      { new: true }
    );

    return NextResponse.json({ activeWorkspace: user.activeWorkspace });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao atualizar workspace ativo' }, { status: 500 });
  }
}

// DELETE: Remove workspace
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });

    await connectDB();
    const { name } = await request.json();

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });

    // Filtra pelo nome
    user.workspaces = user.workspaces.filter((w: any) => w.name !== name);

    // Se apagou o ativo, reseta para o primeiro
    if (user.activeWorkspace === name) {
      user.activeWorkspace = user.workspaces[0]?.name || 'Meu Kanban';
    }

    await user.save();

    return NextResponse.json({ workspaces: user.workspaces, activeWorkspace: user.activeWorkspace });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao deletar workspace' }, { status: 500 });
  }
}
