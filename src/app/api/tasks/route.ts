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
    
    // Cria a tarefa no banco
    const task = await Task.create(data);
    
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar tarefa' }, { status: 500 });
  }
}