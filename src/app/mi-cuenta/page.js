'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import clienteHttp from '@/services/api';
import useAuthStore from '@/store/authStore';

export default function PaginaDeMiCuenta() {
  const parametros = useSearchParams();
  const { usuario_autenticado, esta_logueado } = useAuthStore();

  const [ordenes_del_usuario, set_ordenes_del_usuario] = useState([]);
  const [cargando_ordenes,    set_cargando_ordenes]    = useState(true);
  const [compra_exitosa,      set_compra_exitosa]      = useState(false);

  useEffect(() => {
    if (parametros.get('compra') === 'exitosa') {
      set_compra_exitosa(true);
      setTimeout(() => set_compra_exitosa(false), 5000);
    }
  }, []);

  useEffect(() => {
    const traer_mis_ordenes = async () => {
      try {
        const respuesta = await clienteHttp.get('/api/ordenes/mis-ordenes/');
        set_ordenes_del_usuario(respuesta.data);
      } catch (error_al_cargar) {
        console.error('Error al cargar órdenes:', error_al_cargar);
      } finally {
        set_cargando_ordenes(false);
      }
    };
    if (esta_logueado) traer_mis_ordenes();
  }, [esta_logueado]);

  const descargar_factura = async (id_de_la_orden) => {
    try {
      const respuesta = await clienteHttp.get(`/api/facturas/${id_de_la_orden}/`, {
        responseType: 'blob',
      });
      const url_del_archivo    = window.URL.createObjectURL(new Blob([respuesta.data]));
      const enlace_de_descarga = document.createElement('a');
      enlace_de_descarga.href  = url_del_archivo;
      enlace_de_descarga.setAttribute('download', `factura_orden_${id_de_la_orden}.pdf`);
      document.body.appendChild(enlace_de_descarga);
      enlace_de_descarga.click();
      enlace_de_descarga.remove();
    } catch (error_al_descargar) {
      console.error('Error al descargar factura:', error_al_descargar);
    }
  };

  const color_del_estado = (estado_de_la_orden) => {
    const colores_por_estado = {
      pendiente:  'bg-yellow-100 text-yellow-700',
      pagada:     'bg-green-100 text-green-700',
      preparando: 'bg-blue-100 text-blue-700',
      enviada:    'bg-indigo-100 text-indigo-700',
      entregada:  'bg-gray-100 text-gray-700',
      cancelada:  'bg-red-100 text-red-700',
    };
    return colores_por_estado[estado_de_la_orden] || 'bg-gray-100 text-gray-700';
  };

  if (!esta_logueado) {
    return (
      <div className="text-center py-16 text-gray-400">
        Tenés que iniciar sesión para ver tu cuenta
      </div>
    );
  }

  return (
    <div className="pb-20">

      {/* Mensaje de compra exitosa */}
      {compra_exitosa && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-6 py-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-bold">¡Compra realizada con éxito!</p>
            <p className="text-sm">Tu pedido fue confirmado y está siendo procesado.</p>
          </div>
        </div>
      )}

      {/* Encabezado */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold text-blue-700">
            {usuario_autenticado?.first_name?.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              {usuario_autenticado?.full_name}
            </h1>
            <p className="text-sm text-gray-500">{usuario_autenticado?.email}</p>
            <p className="text-xs text-blue-600 mt-1 capitalize">
              {usuario_autenticado?.role === 'admin' ? '👑 Administrador' : '🛍 Cliente'}
            </p>
          </div>
        </div>
      </div>

      {/* Historial de órdenes */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Mis órdenes</h2>

      {cargando_ordenes ? (
        <div className="text-center py-8 text-gray-400">Cargando órdenes...</div>
      ) : ordenes_del_usuario.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-400">
          <p className="text-4xl mb-3">📦</p>
          <p>Todavía no hiciste ninguna compra</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ordenes_del_usuario.map((orden_de_la_lista) => (
            <div
              key={orden_de_la_lista.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-800">
                    Orden #{orden_de_la_lista.id.toString().padStart(4, '0')}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(orden_de_la_lista.creada_en).toLocaleDateString('es-PY', {
                      day: '2-digit', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${color_del_estado(orden_de_la_lista.estado)}`}>
                  {orden_de_la_lista.estado.charAt(0).toUpperCase() + orden_de_la_lista.estado.slice(1)}
                </span>
              </div>

              <div className="space-y-1 mb-3">
                {orden_de_la_lista.items_de_la_orden?.map((item_de_la_orden) => (
                  <p key={item_de_la_orden.id} className="text-sm text-gray-600">
                    {item_de_la_orden.cantidad}× {item_de_la_orden.nombre_del_producto} — {item_de_la_orden.talla_comprada} {item_de_la_orden.color_comprado}
                  </p>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <p className="font-bold text-blue-700">
                  Gs. {orden_de_la_lista.total_en_gs.toLocaleString('es-PY')}
                </p>
                {['pagada', 'preparando', 'enviada', 'entregada'].includes(orden_de_la_lista.estado) && (
                  <button
                    onClick={() => descargar_factura(orden_de_la_lista.id)}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    📄 Descargar factura
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}