'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import clienteHttp from '@/services/api';

const iconos_de_categoria = {
  'procesadores':   '⚡',
  'placas-de-video':'🎮',
  'memorias-ram':   '💾',
  'almacenamiento': '💿',
  'placas-madre':   '🔧',
  'fuentes':        '🔌',
  'gabinetes':      '🖥️',
  'refrigeracion':  '❄️',
  'perifericos':    '🖱️',
  'monitores':      '📺',
};

export default function PaginaPrincipal() {
  const [productos_destacados,   set_productos_destacados]   = useState([]);
  const [categorias_disponibles, set_categorias_disponibles] = useState([]);
  const [cargando,               set_cargando]               = useState(true);

  useEffect(() => {
    const traer_datos = async () => {
      try {
        const [res_productos, res_categorias] = await Promise.all([
          clienteHttp.get('/api/productos/'),
          clienteHttp.get('/api/productos/categorias/'),
        ]);
        set_productos_destacados(res_productos.data.slice(0, 8));
        // Filtramos la categoría Remeras que no corresponde
        set_categorias_disponibles(
          res_categorias.data.filter(c => c.slug !== 'remeras')
        );
      } catch (e) {
        console.error(e);
      } finally {
        set_cargando(false);
      }
    };
    traer_datos();
  }, []);

  return (
    <div className="pb-20">

      {/* Hero futurista */}
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white rounded-2xl p-10 md:p-16 mb-10 overflow-hidden">
        {/* Círculos decorativos de fondo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 opacity-10 rounded-full -translate-y-24 translate-x-24" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400 opacity-10 rounded-full translate-y-16 -translate-x-16" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-block bg-blue-700 text-blue-200 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            🇵🇾 Tienda oficial en Paraguay
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Armá la PC de <span className="text-cyan-400">tus sueños</span>
          </h1>
          <p className="text-blue-200 text-lg mb-8 leading-relaxed">
            Los mejores componentes de las marcas más reconocidas del mundo. Intel, AMD, NVIDIA, Corsair y más — con garantía y envío a todo el país.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/catalogo"
              className="bg-cyan-400 text-blue-950 font-bold px-8 py-3 rounded-xl hover:bg-cyan-300 transition text-sm"
            >
              Ver catálogo completo →
            </Link>
            <Link
              href="/catalogo?categoria=procesadores"
              className="border border-blue-500 text-white font-medium px-8 py-3 rounded-xl hover:bg-blue-800 transition text-sm"
            >
              Ver procesadores
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4 mt-10 max-w-lg">
          {[
            { numero: '122+', label: 'Productos' },
            { numero: '10',   label: 'Categorías' },
            { numero: '24/7', label: 'Soporte' },
          ].map((stat_de_la_tienda) => (
            <div key={stat_de_la_tienda.label} className="text-center">
              <p className="text-2xl font-bold text-cyan-400">{stat_de_la_tienda.numero}</p>
              <p className="text-xs text-blue-300">{stat_de_la_tienda.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categorías */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Categorías</h2>
          <Link href="/catalogo" className="text-sm text-blue-700 hover:underline">
            Ver todo →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categorias_disponibles.map((categoria_de_la_lista) => (
            <Link
              key={categoria_de_la_lista.id}
              href={`/catalogo?categoria=${categoria_de_la_lista.slug}`}
              className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md hover:border-blue-300 transition border border-gray-100 group"
            >
              <p className="text-3xl mb-2">
                {iconos_de_categoria[categoria_de_la_lista.slug] || '📦'}
              </p>
              <p className="font-semibold text-gray-800 text-sm group-hover:text-blue-700 transition">
                {categoria_de_la_lista.nombre}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {categoria_de_la_lista.cantidad_de_productos} productos
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Productos destacados */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Productos destacados</h2>
          <Link href="/catalogo" className="text-sm text-blue-700 hover:underline">
            Ver todos →
          </Link>
        </div>

        {cargando ? (
          <div className="text-center py-16 text-gray-400">Cargando productos...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {productos_destacados.map((producto_de_la_grilla) => (
              <Link
                key={producto_de_la_grilla.id}
                href={`/producto/${producto_de_la_grilla.slug}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition border border-gray-100 overflow-hidden group"
              >
                <div className="bg-gradient-to-br from-blue-50 to-slate-100 h-44 flex items-center justify-center">
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-200">
                    {iconos_de_categoria[producto_de_la_grilla.slug?.split('-')[0]] || '💻'}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-xs text-blue-600 font-medium mb-1">
                    {producto_de_la_grilla.nombre_de_categoria}
                  </p>
                  <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">
                    {producto_de_la_grilla.nombre}
                  </h3>
                  <p className="text-blue-700 font-bold">
                    {producto_de_la_grilla.precio_minimo
                      ? `Gs. ${producto_de_la_grilla.precio_minimo.toLocaleString('es-PY')}`
                      : 'Consultar precio'
                    }
                  </p>
                  {!producto_de_la_grilla.tiene_stock && (
                    <span className="text-xs text-red-500 mt-1 block">Agotado</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Banner inferior */}
      <section className="mt-10 bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold mb-1">¿Necesitás ayuda para armar tu PC?</h3>
          <p className="text-blue-200 text-sm">
            Contamos con asesoramiento técnico gratuito para que elijas los mejores componentes.
          </p>
        </div>
        <Link
          href="/catalogo"
          className="bg-cyan-400 text-blue-950 font-bold px-6 py-3 rounded-xl hover:bg-cyan-300 transition shrink-0 text-sm"
        >
          Explorar productos →
        </Link>
      </section>

    </div>
  );
}