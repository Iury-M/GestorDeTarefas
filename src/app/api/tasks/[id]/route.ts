import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Task from '@/models/Task';

// Helper para pegar o ID da URL
async function getTaskId(params: Promise<{ id: string }>) {
  const { id } = await params;
  return id;
}

// PUT: Atualizar uma tarefa
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const id = await getTaskId(params);
    const data = await request.json();

    const task = await Task.findByIdAndUpdate(id, data, {
      new: true, // Retorna o objeto atualizado
      runValidators: true,
    });

    if (!task) {
      return NextResponse.json({ error: 'Tarefa não encontrada' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar tarefa' }, { status: 500 });
  }
}

// DELETE: Apagar uma tarefa
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const id = await getTaskId(params);

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return NextResponse.json({ error: 'Tarefa não encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Tarefa deletada com sucesso' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar tarefa' }, { status: 500 });
  }
}