import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Task from "@/models/Task";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(req: Request, props: Props) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  try {
    const { title, description, status } = await req.json();
    await connectDB();

    const task = await Task.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      { title, description, status },
      { new: true }
    );

    if (!task) {
      return NextResponse.json({ message: "Tarefa não encontrada" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ message: "Erro ao atualizar tarefa" }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: Props) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  try {
    await connectDB();
    const task = await Task.findOneAndDelete({ _id: params.id, userId: session.user.id });

    if (!task) {
      return NextResponse.json({ message: "Tarefa não encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Tarefa excluída" });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao excluir tarefa" }, { status: 500 });
  }
}
