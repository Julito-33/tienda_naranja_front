import { Geist } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';

const tipografia_principal = Geist({
  subsets: ['latin'],
});

export const metadata = {
  title:       'Tienda Naranja — Paraguay',
  description: 'La mejor tienda online de Paraguay',
};

export default function LayoutPrincipal({ children }) {
  return (
    <html lang="es">
      <body className={`${tipografia_principal.className} bg-gray-50 min-h-screen`}>

        {/* Navbar aparece en todas las páginas */}
        <Navbar />

        {/* Contenido de cada página va aquí */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-orange-500 text-white text-center py-4 mt-16 text-sm fixed bottom-0 left-0 right-0 z-10">
          © 2026 Tienda Naranja — Asunción, Paraguay
        </footer>

      </body>
    </html>
  );
}