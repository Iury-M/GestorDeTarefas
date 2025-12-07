import mongoose, { Schema, model, models } from 'mongoose';

const TaskSchema = new Schema({
  title: {
    type: String,
    required: [true, 'O título é obrigatório'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pendente', 'em_andamento', 'concluida'],
    default: 'pendente',
  },
}, {
  timestamps: true,
});

const Task = models.Task || model('Task', TaskSchema);

export default Task;