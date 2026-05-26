import { create } from 'zustand';
import clienteHttp from '@/services/api';

// Store global del carrito
// Zustand mantiene este estado disponible en toda la aplicación
// sin necesidad de pasar props entre componentes
const useCarritoStore = create((set, get) => ({

  // Estado inicial del carrito
  articulos_en_el_carrito: [],
  total_de_articulos:      0,
  precio_total_en_gs:      0,
  cargando_carrito:        false,

  // Traer el carrito actual desde el backend
  traer_carrito_del_servidor: async () => {
    try {
      set({ cargando_carrito: true });
      const respuesta_del_servidor = await clienteHttp.get('/api/carrito/');

      set({
        articulos_en_el_carrito: respuesta_del_servidor.data.items,
        total_de_articulos:      respuesta_del_servidor.data.total_items,
        precio_total_en_gs:      respuesta_del_servidor.data.total_en_gs,
        cargando_carrito:        false,
      });
    } catch (error_al_cargar) {
      set({ cargando_carrito: false });
    }
  },

  // Agregar un producto al carrito
  agregar_al_carrito: async (id_de_la_variante, cantidad_elegida = 1) => {
    try {
      const respuesta_del_servidor = await clienteHttp.post('/api/carrito/agregar/', {
        id_variante: id_de_la_variante,
        cantidad:    cantidad_elegida,
      });

      set({
        articulos_en_el_carrito: respuesta_del_servidor.data.carrito,
        precio_total_en_gs:      respuesta_del_servidor.data.total_en_gs,
        total_de_articulos:      respuesta_del_servidor.data.carrito.length,
      });

      return { exito: true, mensaje: respuesta_del_servidor.data.mensaje };
    } catch (error_al_agregar) {
      return {
        exito:   false,
        mensaje: error_al_agregar.response?.data?.error || 'No se pudo agregar el producto'
      };
    }
  },

  // Quitar un producto del carrito
  quitar_del_carrito: async (id_de_la_variante) => {
    try {
      const respuesta_del_servidor = await clienteHttp.delete('/api/carrito/quitar/', {
        data: { id_variante: id_de_la_variante }
      });

      set({
        articulos_en_el_carrito: respuesta_del_servidor.data.carrito,
        precio_total_en_gs:      respuesta_del_servidor.data.total_en_gs,
        total_de_articulos:      respuesta_del_servidor.data.carrito.length,
      });
    } catch (error_al_quitar) {
      console.error('Error al quitar del carrito:', error_al_quitar);
    }
  },

  // Vaciar todo el carrito
  vaciar_carrito_completo: async () => {
    try {
      await clienteHttp.delete('/api/carrito/vaciar/');
      set({
        articulos_en_el_carrito: [],
        total_de_articulos:      0,
        precio_total_en_gs:      0,
      });
    } catch (error_al_vaciar) {
      console.error('Error al vaciar el carrito:', error_al_vaciar);
    }
  },
}));

export default useCarritoStore;