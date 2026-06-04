'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useCarritoStore from '@/store/carritoStore';
import useAuthStore from '@/store/authStore';

export default function PaginaDelCarrito() {
  const router = useRouter();
  const { esta_logueado } = useAuthStore();
  const {
    articulos_en_el_carrito,
    precio_total_en_gs,
    cargando_carrito,
    traer_carrito_del_servidor,
    quitar_del_carrito,
    vaciar_carrito_completo,
  } = useCarritoStore();

  useEffect(() => {
    if (esta_logueado) traer_carrito_del_servidor();
  }, [esta_logueado]);

  if (!esta_logueado) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-gray-500 mb-4">
          Tenés que iniciar sesión para ver tu carrito
        </p>
        <Link
          href="/login"
          className="bg-blue-700 text-white font-bold px-6 py-2 rounded-xl hover:bg-blue-800 transition"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  if (cargando_carrito) {
    return <div className="text-center py-16 text-gray-400">Cargando carrito...</div>;
  }

  return (
    <div className="pb-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tu carrito</h1>

      {articulos_en_el_carrito.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-6xl mb-4">🛒</p>
          <p className="text-xl text-gray-500 mb-4">Tu carrito está vacío</p>
          <Link
            href="/catalogo"
            className="bg-blue-700 text-white font-bold px-6 py-2 rounded-xl hover:bg-blue-800 transition"
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Lista de items */}
          <div className="flex-1 space-y-4">
            {articulos_en_el_carrito.map((articulo_del_carrito) => (
              <div
                key={articulo_del_carrito.id_variante}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4"
              >
                <div className="bg-blue-50 rounded-lg w-16 h-16 flex items-center justify-center shrink-0">
                  <span className="text-3xl">🖥️</span>
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    {articulo_del_carrito.nombre_producto}
                  </p>
                  <p className="text-sm text-gray-500">
                    Talla: {articulo_del_carrito.talla} — Color: {articulo_del_carrito.color}
                  </p>
                  <p className="text-sm text-gray-500">
                    SKU: {articulo_del_carrito.sku}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-bold text-blue-700">
                    Gs. {articulo_del_carrito.subtotal.toLocaleString('es-PY')}
                  </p>
                  <p className="text-sm text-gray-400">
                    {articulo_del_carrito.cantidad} × Gs. {articulo_del_carrito.precio_unitario.toLocaleString('es-PY')}
                  </p>
                </div>

                <button
                  onClick={() => quitar_del_carrito(articulo_del_carrito.id_variante)}
                  className="text-red-400 hover:text-red-600 transition text-sm ml-2"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              onClick={vaciar_carrito_completo}
              className="text-sm text-red-400 hover:text-red-600 hover:underline transition"
            >
              Vaciar carrito
            </button>
          </div>

          {/* Resumen del pedido */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-800 text-lg mb-4">Resumen del pedido</h2>

              <div className="space-y-2 mb-4">
                {articulos_en_el_carrito.map((articulo_del_resumen) => (
                  <div
                    key={articulo_del_resumen.id_variante}
                    className="flex justify-between text-sm text-gray-600"
                  >
                    <span>{articulo_del_resumen.nombre_producto} x{articulo_del_resumen.cantidad}</span>
                    <span>Gs. {articulo_del_resumen.subtotal.toLocaleString('es-PY')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between font-bold text-gray-800">
                  <span>Total</span>
                  <span className="text-blue-700">
                    Gs. {precio_total_en_gs.toLocaleString('es-PY')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-blue-700 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition"
              >
                Confirmar pedido →
              </button>

              <Link
                href="/catalogo"
                className="block text-center text-sm text-gray-400 hover:text-gray-600 mt-3"
              >
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}