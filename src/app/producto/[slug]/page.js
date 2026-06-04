'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import clienteHttp from '@/services/api';
import useCarritoStore from '@/store/carritoStore';
import useAuthStore from '@/store/authStore';

const iconos_de_categoria = {
  'procesadores':    '⚡',
  'placas-de-video': '🎮',
  'memorias-ram':    '💾',
  'almacenamiento':  '💿',
  'placas-madre':    '🔧',
  'fuentes':         '🔌',
  'gabinetes':       '🖥️',
  'refrigeracion':   '❄️',
  'perifericos':     '🖱️',
  'monitores':       '📺',
};

export default function PaginaDeProducto() {
  const { slug } = useParams();
  const { agregar_al_carrito } = useCarritoStore();
  const { esta_logueado } = useAuthStore();

  const [producto_actual,      set_producto_actual]      = useState(null);
  const [variante_elegida,     set_variante_elegida]     = useState(null);
  const [cantidad_elegida,     set_cantidad_elegida]     = useState(1);
  const [resenas_del_producto, set_resenas_del_producto] = useState([]);
  const [cargando_producto,    set_cargando_producto]    = useState(true);
  const [mensaje_del_carrito,  set_mensaje_del_carrito]  = useState('');
  const [es_error,             set_es_error]             = useState(false);

  useEffect(() => {
    const traer_datos_del_producto = async () => {
      try {
        const [respuesta_producto, respuesta_resenas] = await Promise.all([
          clienteHttp.get(`/api/productos/${slug}/`),
          clienteHttp.get(`/api/resenas/${slug}/`),
        ]);

        set_producto_actual(respuesta_producto.data);
        set_resenas_del_producto(respuesta_resenas.data);

        const primera_variante_disponible = respuesta_producto.data.variantes_del_producto.find(
          (variante) => variante.stock > 0
        );
        if (primera_variante_disponible) {
          set_variante_elegida(primera_variante_disponible);
        }
      } catch (error_al_cargar) {
        console.error('Error al cargar el producto:', error_al_cargar);
      } finally {
        set_cargando_producto(false);
      }
    };

    if (slug) traer_datos_del_producto();
  }, [slug]);

  const manejar_agregar_al_carrito = async () => {
    if (!esta_logueado) {
      set_es_error(true);
      set_mensaje_del_carrito('Tenés que iniciar sesión para agregar al carrito');
      setTimeout(() => set_mensaje_del_carrito(''), 3000);
      return;
    }
    if (!variante_elegida) {
      set_es_error(true);
      set_mensaje_del_carrito('Elegí una variante antes de agregar al carrito');
      setTimeout(() => set_mensaje_del_carrito(''), 3000);
      return;
    }

    const resultado = await agregar_al_carrito(variante_elegida.id, cantidad_elegida);
    set_es_error(!resultado.exito);
    set_mensaje_del_carrito(resultado.mensaje);
    setTimeout(() => set_mensaje_del_carrito(''), 3000);
  };

  if (cargando_producto) {
    return <div className="text-center py-16 text-gray-400">Cargando producto...</div>;
  }

  if (!producto_actual) {
    return <div className="text-center py-16 text-gray-400">Producto no encontrado</div>;
  }

  const icono_del_producto = iconos_de_categoria[producto_actual.slug?.split('-')[0]] ||
    Object.entries(iconos_de_categoria).find(([k]) =>
      producto_actual.nombre_de_categoria?.toLowerCase().includes(k.split('-')[0])
    )?.[1] || '💻';

  return (
    <div className="pb-20">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Imagen del producto */}
          <div className="bg-gradient-to-br from-blue-50 to-slate-100 rounded-xl h-72 w-full md:w-96 flex items-center justify-center shrink-0">
            {producto_actual.imagen ? (
              <img
                src={`http://localhost:8000${producto_actual.imagen}`}
                alt={producto_actual.nombre}
                className="h-full w-full object-cover rounded-xl"
              />
            ) : (
              <span className="text-8xl">{icono_del_producto}</span>
            )}
          </div>

          {/* Info del producto */}
          <div className="flex-1">
            <p className="text-sm text-blue-600 font-medium mb-1">
              {producto_actual.nombre_de_categoria}
            </p>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">
              {producto_actual.nombre}
            </h1>
            <p className="text-gray-600 text-sm mb-6">
              {producto_actual.descripcion}
            </p>

            {/* Selector de variantes */}
            {producto_actual.variantes_del_producto.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Elegí una variante:</p>
                <div className="flex flex-wrap gap-2">
                  {producto_actual.variantes_del_producto.map((variante_de_la_lista) => (
                    <button
                      key={variante_de_la_lista.id}
                      onClick={() => set_variante_elegida(variante_de_la_lista)}
                      disabled={!variante_de_la_lista.hay_stock_disponible}
                      className={`px-4 py-2 rounded-lg text-sm border transition ${
                        variante_elegida?.id === variante_de_la_lista.id
                          ? 'bg-blue-700 text-white border-blue-700'
                          : variante_de_la_lista.hay_stock_disponible
                          ? 'border-gray-300 text-gray-700 hover:border-blue-400'
                          : 'border-gray-200 text-gray-400 cursor-not-allowed line-through'
                      }`}
                    >
                      {variante_de_la_lista.talla} {variante_de_la_lista.color}
                      {!variante_de_la_lista.hay_stock_disponible && ' (Agotado)'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Precio */}
            {variante_elegida && (
              <p className="text-3xl font-bold text-blue-700 mb-4">
                Gs. {variante_elegida.precio.toLocaleString('es-PY')}
              </p>
            )}

            {/* Selector de cantidad */}
            <div className="flex items-center gap-3 mb-6">
              <p className="text-sm font-medium text-gray-700">Cantidad:</p>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => set_cantidad_elegida(Math.max(1, cantidad_elegida - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
                >−</button>
                <span className="px-4 py-2 text-gray-800 font-medium border-x border-gray-300">
                  {cantidad_elegida}
                </span>
                <button
                  onClick={() => set_cantidad_elegida(Math.min(variante_elegida?.stock || 1, cantidad_elegida + 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
                >+</button>
              </div>
              {variante_elegida && (
                <p className="text-xs text-gray-400">{variante_elegida.stock} disponibles</p>
              )}
            </div>

            {/* Botón agregar al carrito */}
            <button
              onClick={manejar_agregar_al_carrito}
              disabled={!variante_elegida}
              className="w-full md:w-auto bg-blue-700 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-800 transition disabled:opacity-50"
            >
              🛒 Agregar al carrito
            </button>

            {mensaje_del_carrito && (
              <p className={`mt-3 text-sm font-medium ${es_error ? 'text-red-500' : 'text-green-600'}`}>
                {mensaje_del_carrito}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Reseñas */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Reseñas de clientes
          {resenas_del_producto.total_de_resenas > 0 && (
            <span className="ml-2 text-blue-600">
              ⭐ {resenas_del_producto.promedio_de_estrellas} ({resenas_del_producto.total_de_resenas} reseñas)
            </span>
          )}
        </h2>

        {resenas_del_producto.total_de_resenas === 0 ? (
          <p className="text-gray-400 text-sm">Este producto todavía no tiene reseñas. ¡Sé el primero en opinar!</p>
        ) : (
          <div className="space-y-4">
            {resenas_del_producto.resenas?.map((resena_de_la_lista) => (
              <div key={resena_de_la_lista.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-800">{resena_de_la_lista.nombre_del_autor}</p>
                  <p className="text-yellow-500">{'⭐'.repeat(resena_de_la_lista.calificacion)}</p>
                </div>
                <p className="font-medium text-gray-700 text-sm mb-1">{resena_de_la_lista.titulo_de_la_resena}</p>
                <p className="text-gray-500 text-sm">{resena_de_la_lista.cuerpo_de_la_resena}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}