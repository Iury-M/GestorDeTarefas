import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Task from '@/models/Task';

// Força a rota a ser dinâmica para evitar cache estático
export const dynamic = 'force-dynamic';

// GET: Buscar todas as tarefas
export async function GET() {
  try {
    await connectDB();
    const tasks = await Task.find({});
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar' }, { status: 500 });
  }
}

// POST: Criar tarefa
export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const task = await Task.create(data);
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar' }, { status: 500 });
  }
}

// PUT: Atualizar tarefa (ID vem dentro do JSON)
export async function PUT(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const { _id, ...updateData } = data;

    if (!_id) {
      return NextResponse.json({ error: 'ID necessário' }, { status: 400 });
    }

    const task = await Task.findByIdAndUpdate(_id, updateData, { new: true });
    
    if (!task) {
        return NextResponse.json({ error: 'Tarefa não encontrada' }, { status: 404 });
    }
    
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });
  }
}

// DELETE: Apagar tarefa (ID vem na URL como ?id=...)
export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID necessário' }, { status: 400 });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
        return NextResponse.json({ error: 'Tarefa não encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Deletado com sucesso' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar' }, { status: 500 });
  }
}
