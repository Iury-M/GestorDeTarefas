import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Task from '@/models/Task';

// Rota GET: Busca todas as tarefas
export async function GET() {
  try {
    await connectDB();
    const tasks = await Task.find({});
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar tarefas' }, { status: 500 });
  }
}

// Rota POST: Cria uma nova tarefa
export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const task = await Task.create(data);
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar tarefa' }, { status: 500 });
  }
}

// Rota PUT: Atualiza tarefa (ID vem no JSON)
export async function PUT(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const { _id, ...updateData } = data; // Separa o ID do resto dos dados

    if (!_id) {
      return NextResponse.json({ error: 'ID da tarefa não fornecido' }, { status: 400 });
    }

    const task = await Task.findByIdAndUpdate(_id, updateData, {
      new: true,
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

// Rota DELETE: Apaga tarefa (ID vem no JSON ou na Query, vamos usar Query pra facilitar)
export async function DELETE(request: Request) {
  try {
    await connectDB();
    // Pega o ID da URL assim: /api/tasks?id=123
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID necessário' }, { status: 400 });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return NextResponse.json({ error: 'Tarefa não encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Tarefa deletada com sucesso' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar tarefa' }, { status: 500 });
  }
}