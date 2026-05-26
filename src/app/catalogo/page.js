'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import clienteHttp from '@/services/api';

export default function PaginaDeCatalogo() {
  const parametros_de_url = useSearchParams();

  const [todos_los_productos, set_todos_los_productos]     = useState([]);
  const [categorias_del_menu, set_categorias_del_menu]     = useState([]);
  const [cargando_productos,  set_cargando_productos]      = useState(true);

  // Filtros del catálogo
  const [categoria_elegida,   set_categoria_elegida]       = useState(parametros_de_url.get('categoria') || '');
  const [texto_buscado,       set_texto_buscado]           = useState('');
  const [precio_minimo,       set_precio_minimo]           = useState('');
  const [precio_maximo,       set_precio_maximo]           = useState('');

  // Traer categorías al montar la página
  useEffect(() => {
    const traer_categorias = async () => {
      try {
        const respuesta = await clienteHttp.get('/api/productos/categorias/');
        set_categorias_del_menu(respuesta.data);
      } catch (error_de_categorias) {
        console.error('Error al cargar categorías:', error_de_categorias);
      }
    };
    traer_categorias();
  }, []);

  // Traer productos cada vez que cambian los filtros
  useEffect(() => {
    const traer_productos_filtrados = async () => {
      try {
        set_cargando_productos(true);

        // Armamos los query params según los filtros activos
        const parametros_del_filtro = new URLSearchParams();
        if (categoria_elegida) parametros_del_filtro.append('categoria', categoria_elegida);
        if (texto_buscado)     parametros_del_filtro.append('buscar',    texto_buscado);
        if (precio_minimo)     parametros_del_filtro.append('precio_min', precio_minimo);
        if (precio_maximo)     parametros_del_filtro.append('precio_max', precio_maximo);

        const respuesta = await clienteHttp.get(`/api/productos/?${parametros_del_filtro}`);
        set_todos_los_productos(respuesta.data);
      } catch (error_de_productos) {
        console.error('Error al cargar productos:', error_de_productos);
      } finally {
        set_cargando_productos(false);
      }
    };

    traer_productos_filtrados();
  }, [categoria_elegida, texto_buscado, precio_minimo, precio_maximo]);

  const limpiar_todos_los_filtros = () => {
    set_categoria_elegida('');
    set_texto_buscado('');
    set_precio_minimo('');
    set_precio_maximo('');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Catálogo de productos</h1>

      <div className="flex flex-col md:flex-row gap-6">

        {/* Panel de filtros — lado izquierdo */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-5">

            <h2 className="font-bold text-gray-800 text-lg">Filtros</h2>

            {/* Búsqueda por texto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar producto
              </label>
              <input
                type="text"
                value={texto_buscado}
                onChange={(e) => set_texto_buscado(e.target.value)}
                placeholder="Ej: remera naranja"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Filtro por categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => set_categoria_elegida('')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                    categoria_elegida === ''
                      ? 'bg-orange-500 text-white font-medium'
                      : 'hover:bg-orange-50 text-gray-700'
                  }`}
                >
                  Todas las categorías
                </button>
                {categorias_del_menu.map((categoria_de_la_lista) => (
                  <button
                    key={categoria_de_la_lista.id}
                    onClick={() => set_categoria_elegida(categoria_de_la_lista.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      categoria_elegida === categoria_de_la_lista.slug
                        ? 'bg-orange-500 text-white font-medium'
                        : 'hover:bg-orange-50 text-gray-700'
                    }`}
                  >
                    {categoria_de_la_lista.nombre}
                    <span className="ml-1 text-xs opacity-70">
                      ({categoria_de_la_lista.cantidad_de_productos})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro por precio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rango de precio (Gs.)
              </label>
              <div className="space-y-2">
                <input
                  type="number"
                  value={precio_minimo}
                  onChange={(e) => set_precio_minimo(e.target.value)}
                  placeholder="Mínimo"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <input
                  type="number"
                  value={precio_maximo}
                  onChange={(e) => set_precio_maximo(e.target.value)}
                  placeholder="Máximo"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            {/* Botón limpiar filtros */}
            <button
              onClick={limpiar_todos_los_filtros}
              className="w-full text-sm text-orange-500 hover:underline"
            >
              Limpiar filtros
            </button>

          </div>
        </aside>

        {/* Lista de productos — lado derecho */}
        <div className="flex-1">

          {cargando_productos ? (
            <div className="text-center py-16 text-gray-400">
              Cargando productos...
            </div>
          ) : todos_los_productos.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-xl mb-2">😕 No encontramos productos</p>
              <p className="text-sm">Probá cambiando los filtros</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">
                {todos_los_productos.length} producto{todos_los_productos.length !== 1 ? 's' : ''} encontrado{todos_los_productos.length !== 1 ? 's' : ''}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {todos_los_productos.map((producto_de_la_grilla) => (
                  <Link
                    key={producto_de_la_grilla.id}
                    href={`/producto/${producto_de_la_grilla.slug}`}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden"
                  >
                    {/* Imagen */}
                    <div className="bg-orange-50 h-48 flex items-center justify-center">
                      {producto_de_la_grilla.imagen ? (
                        <img
                          src={`http://localhost:8000${producto_de_la_grilla.imagen}`}
                          alt={producto_de_la_grilla.nombre}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-6xl">🍊</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <p className="text-xs text-orange-500 font-medium mb-1">
                        {producto_de_la_grilla.nombre_de_categoria}
                      </p>
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                        {producto_de_la_grilla.nombre}
                      </h3>
                      <p className="text-orange-500 font-bold">
                        {producto_de_la_grilla.precio_minimo
                          ? `Gs. ${producto_de_la_grilla.precio_minimo.toLocaleString('es-PY')}`
                          : 'Sin precio'
                        }
                      </p>
                      {!producto_de_la_grilla.tiene_stock && (
                        <span className="text-xs text-red-500 mt-1 block">Agotado</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}