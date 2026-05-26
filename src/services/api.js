import axios from 'axios';

// URL base del backend Django
const url_del_backend = 'http://localhost:8000';

// Cliente axios configurado con la URL base
const clienteHttp = axios.create({
  baseURL: url_del_backend,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor — agrega el token JWT automáticamente en cada request
// Si el usuario está logueado, no hace falta agregarlo manualmente
clienteHttp.interceptors.request.use((configuracion_del_request) => {
  const token_guardado = localStorage.getItem('token_de_acceso');

  if (token_guardado) {
    configuracion_del_request.headers.Authorization = `Bearer ${token_guardado}`;
  }

  return configuracion_del_request;
});

// Interceptor de respuesta — si el token venció, limpia la sesión
clienteHttp.interceptors.response.use(
  (respuesta_exitosa) => respuesta_exitosa,
  (error_del_servidor) => {
    if (error_del_servidor.response?.status === 401) {
      localStorage.removeItem('token_de_acceso');
      localStorage.removeItem('token_de_refresco');
      window.location.href = '/login';
    }
    return Promise.reject(error_del_servidor);
  }
);

export default clienteHttp;