'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import clienteHttp from '@/services/api';

export default function PaginaDeRegistro() {
  const router = useRouter();

  const [datos_del_formulario, set_datos_del_formulario] = useState({
    email:      '',
    first_name: '',
    last_name:  '',
    phone:      '',
    password:   '',
    password2:  '',
  });

  const [mensaje_de_error,  set_mensaje_de_error]  = useState('');
  const [cargando_registro, set_cargando_registro] = useState(false);

  const actualizar_campo = (nombre_del_campo, valor_nuevo) => {
    set_datos_del_formulario((datos_anteriores) => ({
      ...datos_anteriores,
      [nombre_del_campo]: valor_nuevo,
    }));
  };

  const manejar_registro = async (evento) => {
    evento.preventDefault();
    set_mensaje_de_error('');

    if (datos_del_formulario.password !== datos_del_formulario.password2) {
      set_mensaje_de_error('Las contraseñas no coinciden');
      return;
    }

    try {
      set_cargando_registro(true);
      await clienteHttp.post('/api/usuarios/register/', datos_del_formulario);
      // Registro exitoso — redirigimos al login
      router.push('/login?registro=exitoso');
    } catch (error_en_registro) {
      const errores = error_en_registro.response?.data;
      if (errores?.email) {
        set_mensaje_de_error('Ya existe una cuenta con ese email');
      } else {
        set_mensaje_de_error('Ocurrió un error al registrarse. Intentá de nuevo.');
      }
    } finally {
      set_cargando_registro(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center -mt-8 py-8">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md border border-gray-100">

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-5xl">🍊</span>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">Crear cuenta</h1>
          <p className="text-gray-500 text-sm mt-1">Es gratis y rápido</p>
        </div>

        <form onSubmit={manejar_registro} className="space-y-4">

          {/* Nombre y apellido en dos columnas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={datos_del_formulario.first_name}
                onChange={(e) => actualizar_campo('first_name', e.target.value)}
                placeholder="Julio"
                required
                className="w-full border border-gray-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                type="text"
                value={datos_del_formulario.last_name}
                onChange={(e) => actualizar_campo('last_name', e.target.value)}
                placeholder="González"
                required
                className="w-full border border-gray-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={datos_del_formulario.email}
              onChange={(e) => actualizar_campo('email', e.target.value)}
              placeholder="julio@email.com"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="text"
              value={datos_del_formulario.phone}
              onChange={(e) => actualizar_campo('phone', e.target.value)}
              placeholder="0981123456"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={datos_del_formulario.password}
              onChange={(e) => actualizar_campo('password', e.target.value)}
              placeholder="Mínimo 8 caracteres"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Repetir contraseña
            </label>
            <input
              type="password"
              value={datos_del_formulario.password2}
              onChange={(e) => actualizar_campo('password2', e.target.value)}
              placeholder="Repetí tu contraseña"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {mensaje_de_error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-lg">
              {mensaje_de_error}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando_registro}
            className="w-full bg-orange-500 text-white font-bold py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
          >
            {cargando_registro ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" className="text-orange-500 font-medium hover:underline">
            Iniciá sesión
          </Link>
        </p>

      </div>
    </div>
  );
}