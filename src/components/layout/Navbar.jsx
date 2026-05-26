'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';
import useAuthStore from '@/store/authStore';
import useCarritoStore from '@/store/carritoStore';

export default function Navbar() {
  const { esta_logueado, usuario_autenticado, cerrar_sesion, verificar_sesion_activa } = useAuthStore();
  const { total_de_articulos, traer_carrito_del_servidor } = useCarritoStore();

  // Al montar el Navbar verificamos si hay sesión activa
  // y traemos el carrito si el usuario está logueado
  useEffect(() => {
    verificar_sesion_activa();
  }, []);

  useEffect(() => {
    if (esta_logueado) {
      traer_carrito_del_servidor();
    }
  }, [esta_logueado]);

  return (
    <nav className="bg-orange-500 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tight">
          🍊 Tienda Naranja
        </Link>

        {/* Links del centro */}
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-orange-200 transition">
            Inicio
          </Link>
          <Link href="/catalogo" className="hover:text-orange-200 transition">
            Catálogo
          </Link>
        </div>

        {/* Acciones del lado derecho */}
        <div className="flex items-center gap-4">

          {/* Ícono del carrito con contador */}
          <Link href="/carrito" className="relative">
            <ShoppingCartIcon className="w-6 h-6" />
            {total_de_articulos > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-orange-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {total_de_articulos}
              </span>
            )}
          </Link>

          {/* Si está logueado muestra el nombre y botón de salir */}
          {esta_logueado ? (
            <div className="flex items-center gap-3">
              <Link href="/mi-cuenta" className="flex items-center gap-1 text-sm hover:text-orange-200">
                <UserIcon className="w-5 h-5" />
                {usuario_autenticado?.first_name}
              </Link>
              <button
                onClick={cerrar_sesion}
                className="text-sm bg-white text-orange-500 px-3 py-1 rounded-full font-medium hover:bg-orange-100 transition"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm bg-white text-orange-500 px-3 py-1 rounded-full font-medium hover:bg-orange-100 transition"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}