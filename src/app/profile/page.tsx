export default async function ProfilePage() {
  // Simula um carregamento infinito para demonstrar a mensagem de timeout no loading.tsx
  await new Promise(() => { });

  return (
    <div className="hidden">
      <h1>Esta página nunca será exibida.</h1>
    </div>
  );
}
