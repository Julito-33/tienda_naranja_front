import Link from 'next/link';

export default function PaginaNoEncontrada() {
  return (
    <div className="min-h-screen flex items-center justify-center -mt-8">
      <div className="text-center">

        {/* Número 404 grande */}
        <h1 className="text-9xl font-extrabold text-blue-700 leading-none">
          404
        </h1>

        {/* Icono */}
        <p className="text-6xl mt-4">🖥️</p>

        {/* Mensaje */}
        <h2 className="text-2xl font-bold text-gray-800 mt-4">
          Página no encontrada
        </h2>
        <p className="text-gray-500 mt-2 mb-8 max-w-md mx-auto">
          La página que buscás no existe o fue movida. 
          Revisá la URL o volvé al inicio.
        </p>

        {/* Botones */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="bg-blue-700 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-800 transition"
          >
            Volver al inicio
          </Link>
          <Link
            href="/catalogo"
            className="border border-blue-700 text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition"
          >
            Ver catálogo
          </Link>
        </div>

      </div>
    </div>
  );
}