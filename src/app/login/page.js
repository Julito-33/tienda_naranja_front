'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';

export default function PaginaDeLogin() {
  const router = useRouter();
  const { iniciar_sesion, cargando_sesion } = useAuthStore();

  const [email_ingresado,       set_email_ingresado]       = useState('');
  const [contrasena_ingresada,  set_contrasena_ingresada]  = useState('');
  const [mensaje_de_error,      set_mensaje_de_error]      = useState('');

  const manejar_envio_del_formulario = async (evento) => {
    evento.preventDefault();
    set_mensaje_de_error('');
    const resultado = await iniciar_sesion(email_ingresado, contrasena_ingresada);
    if (resultado.exito) {
      router.push('/');
    } else {
      set_mensaje_de_error(resultado.mensaje);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center -mt-8">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md border border-gray-100">

        <div className="text-center mb-8">
          <span className="text-5xl">🖥️</span>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">Iniciar sesión</h1>
          <p className="text-gray-500 text-sm mt-1">Bienvenido de vuelta</p>
        </div>

        <form onSubmit={manejar_envio_del_formulario} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email_ingresado}
              onChange={(e) => set_email_ingresado(e.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={contrasena_ingresada}
              onChange={(e) => set_contrasena_ingresada(e.target.value)}
              placeholder="Tu contraseña"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {mensaje_de_error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-lg">
              {mensaje_de_error}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando_sesion}
            className="w-full bg-blue-700 text-white font-bold py-2 rounded-lg hover:bg-blue-800 transition disabled:opacity-50"
          >
            {cargando_sesion ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿No tenés cuenta?{' '}
          <Link href="/registro" className="text-blue-600 font-medium hover:underline">
            Registrate acá
          </Link>
        </p>
      </div>
    </div>
  );
}