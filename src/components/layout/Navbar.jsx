'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';
import useAuthStore from '@/store/authStore';
import useCarritoStore from '@/store/carritoStore';

export default function Navbar() {
  const { esta_logueado, usuario_autenticado, cerrar_sesion, verificar_sesion_activa } = useAuthStore();
  const { total_de_articulos, traer_carrito_del_servidor } = useCarritoStore();

  useEffect(() => {
    verificar_sesion_activa();
  }, []);

  useEffect(() => {
    if (esta_logueado) traer_carrito_del_servidor();
  }, [esta_logueado]);

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🖥️</span>
          <div>
            <p className="text-lg font-bold leading-none">TechStore</p>
            <p className="text-xs text-blue-300 leading-none">Paraguay</p>
          </div>
        </Link>

        {/* Links del centro */}
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-blue-300 transition">Inicio</Link>
          <Link href="/catalogo" className="hover:text-blue-300 transition">Catálogo</Link>
          <Link href="/catalogo?categoria=procesadores" className="hover:text-blue-300 transition">Procesadores</Link>
          <Link href="/catalogo?categoria=placas-de-video" className="hover:text-blue-300 transition">GPUs</Link>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-4">
          <Link href="/carrito" className="relative">
            <ShoppingCartIcon className="w-6 h-6" />
            {total_de_articulos > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {total_de_articulos}
              </span>
            )}
          </Link>

          {esta_logueado ? (
            <div className="flex items-center gap-3">
              <Link href="/mi-cuenta" className="flex items-center gap-1 text-sm hover:text-blue-300">
                <UserIcon className="w-5 h-5" />
                {usuario_autenticado?.first_name}
              </Link>
              <button
                onClick={cerrar_sesion}
                className="text-sm bg-blue-700 px-3 py-1 rounded-full font-medium hover:bg-blue-600 transition"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm bg-blue-700 px-3 py-1 rounded-full font-medium hover:bg-blue-600 transition"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}