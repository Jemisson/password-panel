import "./globals.css";
import RepeatingStrip from "@/components/RepeatingStrip";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="flex flex-col min-h-screen bg-gradient-to-r from-[#91BE6D] to-[#287DA2] text-white">
        <header>
          <RepeatingStrip height={72} />
        </header>

        <main className="flex-grow flex items-center justify-center">
          {children}
        </main>

        <footer>
          <RepeatingStrip height={72} />
        </footer>
      </body>
    </html>
  );
}
