'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import clienteHttp from '@/services/api';
import useCarritoStore from '@/store/carritoStore';
import useAuthStore from '@/store/authStore';

export default function PaginaDeCheckout() {
  const router = useRouter();
  const { esta_logueado } = useAuthStore();
  const { articulos_en_el_carrito, precio_total_en_gs, traer_carrito_del_servidor } = useCarritoStore();

  const [datos_de_envio, set_datos_de_envio] = useState({
    direccion_de_envio: '',
    ciudad_de_envio:    'Asuncion',
    telefono_de_envio:  '',
  });

  const [metodo_de_pago_elegido, set_metodo_de_pago_elegido] = useState('tarjeta');

  const [datos_de_tarjeta, set_datos_de_tarjeta] = useState({
    numero_de_tarjeta:    '',
    nombre_en_la_tarjeta: '',
    mes_de_vencimiento:   '',
    anio_de_vencimiento:  '',
    codigo_cvv:           '',
  });

  const [procesando_pago,  set_procesando_pago]  = useState(false);
  const [mensaje_de_error, set_mensaje_de_error] = useState('');
  const [paso_actual,      set_paso_actual]       = useState(1);

  const actualizar_dato_de_envio = (campo, valor) => {
    set_datos_de_envio((anterior) => ({ ...anterior, [campo]: valor }));
  };

  const actualizar_dato_de_tarjeta = (campo, valor) => {
    set_datos_de_tarjeta((anterior) => ({ ...anterior, [campo]: valor }));
  };

  const confirmar_y_pagar = async () => {
    try {
      set_procesando_pago(true);
      set_mensaje_de_error('');

      const respuesta_de_orden = await clienteHttp.post('/api/ordenes/crear/', {
        ...datos_de_envio,
        metodo_de_pago: metodo_de_pago_elegido,
      });

      const id_de_la_orden_nueva = respuesta_de_orden.data.id;

      if (metodo_de_pago_elegido === 'tarjeta') {
        await clienteHttp.post(`/api/pagos/tarjeta/${id_de_la_orden_nueva}/`, {
          numero_de_tarjeta:    datos_de_tarjeta.numero_de_tarjeta,
          nombre_en_la_tarjeta: datos_de_tarjeta.nombre_en_la_tarjeta,
          mes_de_vencimiento:   parseInt(datos_de_tarjeta.mes_de_vencimiento),
          anio_de_vencimiento:  parseInt(datos_de_tarjeta.anio_de_vencimiento),
          codigo_cvv:           datos_de_tarjeta.codigo_cvv,
        });
      } else if (metodo_de_pago_elegido === 'efectivo') {
        await clienteHttp.post(`/api/pagos/efectivo/${id_de_la_orden_nueva}/`, {
          punto_de_pago: 'farmacia_catedral',
        });
      }

      await traer_carrito_del_servidor();
      router.push('/mi-cuenta?compra=exitosa');

    } catch (error_en_el_pago) {
      set_mensaje_de_error(
        error_en_el_pago.response?.data?.error || 'Ocurrió un error al procesar el pago'
      );
    } finally {
      set_procesando_pago(false);
    }
  };

  if (!esta_logueado) {
    return (
      <div className="text-center py-16 text-gray-400">
        Tenés que iniciar sesión para continuar
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Confirmar pedido</h1>

      {/* Indicador de pasos */}
      <div className="flex items-center gap-3 mb-8">
        <div className={`flex items-center gap-2 text-sm font-medium ${paso_actual === 1 ? 'text-blue-700' : 'text-gray-400'}`}>
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${paso_actual === 1 ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-500'}`}>
            1
          </span>
          Datos de envío
        </div>
        <div className="flex-1 h-px bg-gray-200" />
        <div className={`flex items-center gap-2 text-sm font-medium ${paso_actual === 2 ? 'text-blue-700' : 'text-gray-400'}`}>
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${paso_actual === 2 ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-500'}`}>
            2
          </span>
          Pago
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">

        {/* PASO 1 */}
        {paso_actual === 1 && (
          <div>
            <h2 className="font-bold text-gray-800 text-lg mb-4">¿A dónde enviamos tu pedido?</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  value={datos_de_envio.direccion_de_envio}
                  onChange={(e) => actualizar_dato_de_envio('direccion_de_envio', e.target.value)}
                  placeholder="Av. Mariscal Lopez 1234"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                <select
                  value={datos_de_envio.ciudad_de_envio}
                  onChange={(e) => actualizar_dato_de_envio('ciudad_de_envio', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Asuncion">Asunción</option>
                  <option value="San Lorenzo">San Lorenzo</option>
                  <option value="Luque">Luque</option>
                  <option value="Capiata">Capiatá</option>
                  <option value="Lambare">Lambaré</option>
                  <option value="Fernando de la Mora">Fernando de la Mora</option>
                  <option value="Encarnacion">Encarnación</option>
                  <option value="Ciudad del Este">Ciudad del Este</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="text"
                  value={datos_de_envio.telefono_de_envio}
                  onChange={(e) => actualizar_dato_de_envio('telefono_de_envio', e.target.value)}
                  placeholder="0981123456"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <button
              onClick={() => set_paso_actual(2)}
              disabled={!datos_de_envio.direccion_de_envio || !datos_de_envio.telefono_de_envio}
              className="w-full mt-6 bg-blue-700 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition disabled:opacity-50"
            >
              Continuar al pago →
            </button>
          </div>
        )}

        {/* PASO 2 */}
        {paso_actual === 2 && (
          <div>
            <h2 className="font-bold text-gray-800 text-lg mb-4">¿Cómo querés pagar?</h2>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { valor: 'tarjeta',       icono: '💳', label: 'Tarjeta' },
                { valor: 'transferencia', icono: '🏦', label: 'Transferencia' },
                { valor: 'efectivo',      icono: '💵', label: 'Efectivo' },
              ].map((opcion_de_pago) => (
                <button
                  key={opcion_de_pago.valor}
                  onClick={() => set_metodo_de_pago_elegido(opcion_de_pago.valor)}
                  className={`p-4 rounded-xl border-2 text-center transition ${
                    metodo_de_pago_elegido === opcion_de_pago.valor
                      ? 'border-blue-700 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <p className="text-2xl mb-1">{opcion_de_pago.icono}</p>
                  <p className="text-sm font-medium text-gray-700">{opcion_de_pago.label}</p>
                </button>
              ))}
            </div>

            {/* Tarjeta */}
            {metodo_de_pago_elegido === 'tarjeta' && (
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700">
                  💡 Tarjetas de prueba: <strong>4111111111111111</strong> (aprobada) — <strong>4000000000000002</strong> (rechazada)
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de tarjeta</label>
                  <input type="text" maxLength={16}
                    value={datos_de_tarjeta.numero_de_tarjeta}
                    onChange={(e) => actualizar_dato_de_tarjeta('numero_de_tarjeta', e.target.value)}
                    placeholder="4111111111111111"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre en la tarjeta</label>
                  <input type="text"
                    value={datos_de_tarjeta.nombre_en_la_tarjeta}
                    onChange={(e) => actualizar_dato_de_tarjeta('nombre_en_la_tarjeta', e.target.value)}
                    placeholder="JULIO GONZALEZ"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mes</label>
                    <input type="number" min={1} max={12}
                      value={datos_de_tarjeta.mes_de_vencimiento}
                      onChange={(e) => actualizar_dato_de_tarjeta('mes_de_vencimiento', e.target.value)}
                      placeholder="12"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                    <input type="number"
                      value={datos_de_tarjeta.anio_de_vencimiento}
                      onChange={(e) => actualizar_dato_de_tarjeta('anio_de_vencimiento', e.target.value)}
                      placeholder="2027"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input type="text" maxLength={4}
                      value={datos_de_tarjeta.codigo_cvv}
                      onChange={(e) => actualizar_dato_de_tarjeta('codigo_cvv', e.target.value)}
                      placeholder="123"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Transferencia */}
            {metodo_de_pago_elegido === 'transferencia' && (
              <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
                <p className="font-bold mb-2">Datos para transferir:</p>
                <p>Banco: Banco Nacional de Fomento</p>
                <p>Cuenta: 123-456789-0</p>
                <p>Titular: TechStore Paraguay S.A.</p>
                <p className="mt-2 text-xs text-blue-500">
                  El pedido se confirmará una vez que verifiquemos tu transferencia.
                </p>
              </div>
            )}

            {/* Efectivo */}
            {metodo_de_pago_elegido === 'efectivo' && (
              <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
                <p className="font-bold mb-2">Podés pagar en efectivo en:</p>
                <p>📍 Farmacia Catedral</p>
                <p>📍 ANDE</p>
                <p>📍 COPACO</p>
                <p>📍 Seven Eleven</p>
              </div>
            )}

            {mensaje_de_error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-lg mt-4">
                {mensaje_de_error}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => set_paso_actual(1)}
                className="flex-1 border border-gray-300 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition"
              >
                ← Volver
              </button>
              <button
                onClick={confirmar_y_pagar}
                disabled={procesando_pago}
                className="flex-2 w-full bg-blue-700 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition disabled:opacity-50"
              >
                {procesando_pago ? 'Procesando...' : `Pagar Gs. ${precio_total_en_gs.toLocaleString('es-PY')}`}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Resumen */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-gray-800 mb-3">Tu pedido</h2>
        {articulos_en_el_carrito.map((articulo) => (
          <div key={articulo.id_variante} className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{articulo.nombre_producto} x{articulo.cantidad}</span>
            <span>Gs. {articulo.subtotal.toLocaleString('es-PY')}</span>
          </div>
        ))}
        <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between font-bold text-gray-800">
          <span>Total</span>
          <span className="text-blue-700">Gs. {precio_total_en_gs.toLocaleString('es-PY')}</span>
        </div>
      </div>
    </div>
  );
}