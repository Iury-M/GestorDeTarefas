import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Task from "@/models/Task";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const workspace = searchParams.get('workspace') || "Meu Kanban";

  await connectDB();
  try {
    const tasks = await Task.find({
      userId: session.user.id,
      workspace: workspace
    }).sort({ createdAt: -1 });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ message: "Erro ao buscar tarefas" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  try {
    const { title, description, status, workspace } = await req.json();
    await connectDB();

    const newTask = await Task.create({
      title,
      description,
      status,
      workspace: workspace || "Meu Kanban",
      userId: session.user.id,
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao criar tarefa" }, { status: 500 });
  }
}
