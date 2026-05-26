'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import clienteHttp from '@/services/api';

export default function PaginaPrincipal() {
  const [productos_destacados, set_productos_destacados] = useState([]);
  const [categorias_disponibles, set_categorias_disponibles] = useState([]);
  const [cargando_productos, set_cargando_productos] = useState(true);

  // Al cargar la página traemos productos y categorías del backend
  useEffect(() => {
    const traer_datos_iniciales = async () => {
      try {
        const [respuesta_productos, respuesta_categorias] = await Promise.all([
          clienteHttp.get('/api/productos/'),
          clienteHttp.get('/api/productos/categorias/'),
        ]);

        set_productos_destacados(respuesta_productos.data.slice(0, 4));
        set_categorias_disponibles(respuesta_categorias.data);
      } catch (error_al_cargar) {
        console.error('Error al cargar la página principal:', error_al_cargar);
      } finally {
        set_cargando_productos(false);
      }
    };

    traer_datos_iniciales();
  }, []);

  return (
    <div>

      {/* Banner principal */}
      <section className="bg-orange-500 text-white rounded-2xl p-12 mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Bienvenido a Tienda Naranja 🍊
        </h1>
        <p className="text-lg mb-6 text-orange-100">
          Los mejores productos de Paraguay, directo a tu puerta
        </p>
        <Link
          href="/catalogo"
          className="bg-white text-orange-500 font-bold px-8 py-3 rounded-full hover:bg-orange-100 transition"
        >
          Ver catálogo completo
        </Link>
      </section>

      {/* Categorías */}
      {categorias_disponibles.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Categorías</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categorias_disponibles.map((categoria) => (
              <Link
                key={categoria.id}
                href={`/catalogo?categoria=${categoria.slug}`}
                className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition border border-gray-100"
              >
                <p className="font-semibold text-gray-800">{categoria.nombre}</p>
                <p className="text-sm text-orange-500 mt-1">
                  {categoria.cantidad_de_productos} productos
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Productos destacados */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Productos destacados</h2>

        {cargando_productos ? (
          <div className="text-center py-12 text-gray-400">Cargando productos...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productos_destacados.map((producto_de_la_lista) => (
              <Link
                key={producto_de_la_lista.id}
                href={`/producto/${producto_de_la_lista.slug}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden"
              >
                {/* Imagen del producto */}
                <div className="bg-orange-50 h-48 flex items-center justify-center">
                  {producto_de_la_lista.imagen ? (
                    <img
                      src={`http://localhost:8000${producto_de_la_lista.imagen}`}
                      alt={producto_de_la_lista.nombre}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl">🍊</span>
                  )}
                </div>

                {/* Info del producto */}
                <div className="p-4">
                  <p className="text-xs text-orange-500 font-medium mb-1">
                    {producto_de_la_lista.nombre_de_categoria}
                  </p>
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                    {producto_de_la_lista.nombre}
                  </h3>
                  <p className="text-orange-500 font-bold">
                    {producto_de_la_lista.precio_minimo
                      ? `Gs. ${producto_de_la_lista.precio_minimo.toLocaleString('es-PY')}`
                      : 'Sin precio'
                    }
                  </p>
                  {!producto_de_la_lista.tiene_stock && (
                    <span className="text-xs text-red-500 mt-1 block">Agotado</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}