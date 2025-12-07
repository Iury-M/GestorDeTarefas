import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'O nome é obrigatório'],
  },
  email: {
    type: String,
    required: [true, 'O email é obrigatório'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor, insira um email válido',
    ],
  },
  password: {
    type: String,
    required: [true, 'A senha é obrigatória'],
    select: false, // Não retornar a senha por padrão nas consultas
  },
  workspaces: {
    type: [{
      name: { type: String, required: true },
      description: { type: String, default: "" },
      icon: { type: String, default: "layout" } // layout, briefcase, user, book, coffee
    }],
    default: [
      { name: "Meu Kanban", description: "Espaço padrão", icon: "layout" },
      { name: "Trabalho", description: "Projetos profissionais", icon: "briefcase" },
      { name: "Pessoal", description: "Vida pessoal", icon: "user" }
    ],
  },
  activeWorkspace: {
    type: String,
    default: "Meu Kanban",
  },
}, {
  timestamps: true,
});

const User = models.User || model('User', UserSchema);

export default User;
