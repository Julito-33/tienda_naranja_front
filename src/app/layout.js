import { Geist } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';

const tipografia_principal = Geist({ subsets: ['latin'] });

export const metadata = {
  title:       'TechStore Paraguay — Componentes de PC',
  description: 'La mejor tienda de componentes informáticos de Paraguay',
};

export default function LayoutPrincipal({ children }) {
  return (
    <html lang="es">
      <body className={`${tipografia_principal.className} bg-slate-50 min-h-screen`}>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-blue-900 text-white text-center py-4 mt-16 text-sm fixed bottom-0 left-0 right-0 z-10">
          © 2026 TechStore Paraguay — Asunción, Paraguay 🇵🇾
        </footer>
      </body>
    </html>
  );
}