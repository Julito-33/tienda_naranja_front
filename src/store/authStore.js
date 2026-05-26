import { create } from 'zustand';
import clienteHttp from '@/services/api';

// Store global de autenticación
// Maneja el estado de sesión del usuario en toda la aplicación
const useAuthStore = create((set) => ({

  // Estado inicial
  usuario_autenticado:  null,
  esta_logueado:        false,
  cargando_sesion:      false,

  // Iniciar sesión
  iniciar_sesion: async (email_del_usuario, contrasena_del_usuario) => {
    try {
      set({ cargando_sesion: true });

      const respuesta_del_login = await clienteHttp.post('/api/usuarios/login/', {
        email:    email_del_usuario,
        password: contrasena_del_usuario,
      });

      // Guardamos los tokens en localStorage para que persistan
      // aunque el usuario cierre y vuelva a abrir el navegador
      localStorage.setItem('token_de_acceso',   respuesta_del_login.data.access);
      localStorage.setItem('token_de_refresco', respuesta_del_login.data.refresh);

      // Traemos el perfil del usuario con el token recién obtenido
      const perfil_del_usuario = await clienteHttp.get('/api/usuarios/profile/');

      set({
        usuario_autenticado: perfil_del_usuario.data,
        esta_logueado:       true,
        cargando_sesion:     false,
      });

      return { exito: true };
    } catch (error_en_login) {
      set({ cargando_sesion: false });
      return {
        exito:   false,
        mensaje: error_en_login.response?.data?.detail || 'Email o contraseña incorrectos'
      };
    }
  },

  // Cerrar sesión
  cerrar_sesion: () => {
    localStorage.removeItem('token_de_acceso');
    localStorage.removeItem('token_de_refresco');
    set({
      usuario_autenticado: null,
      esta_logueado:       false,
    });
    window.location.href = '/login';
  },

  // Verificar si hay sesión activa al cargar la app
  verificar_sesion_activa: async () => {
    const token_guardado = localStorage.getItem('token_de_acceso');

    if (!token_guardado) {
      set({ esta_logueado: false });
      return;
    }

    try {
      const perfil_del_usuario = await clienteHttp.get('/api/usuarios/profile/');
      set({
        usuario_autenticado: perfil_del_usuario.data,
        esta_logueado:       true,
      });
    } catch (error_de_sesion) {
      // Si el token no es válido, limpiamos todo
      localStorage.removeItem('token_de_acceso');
      localStorage.removeItem('token_de_refresco');
      set({ esta_logueado: false, usuario_autenticado: null });
    }
  },
}));

export default useAuthStore;