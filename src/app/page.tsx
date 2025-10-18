import CallForm from "@/components/CallForm";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center">
      <div className="w-full">
        <h1 className="text-center text-2xl font-semibold mb-4">
          Painel de Chamadas
        </h1>
        <CallForm />
      </div>
    </main>
  );
}
