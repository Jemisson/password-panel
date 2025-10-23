import Image from "next/image";
import CallForm from "@/components/CallForm";

export default function Home() {
  return (
    <div className="w-full max-w-2xl px-4 text-center">
      <h1 className="text-2xl font-semibold mb-4">Painel de Chamadas</h1>

      <div className="flex justify-center mb-6">
        <Image
          src="/logo.png"
          alt="Logo"
          width={220}
          height={220}
          priority
          className="h-auto w-auto"
        />
      </div>

      <CallForm />
    </div>
  );
}
