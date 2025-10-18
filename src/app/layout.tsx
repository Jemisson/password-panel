import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gradient-to-r from-[#91BE6D] to-[#287DA2]">
        {children}
      </body>
    </html>
  );
}
