import Link from "next/link";

export default function Home() {
  return (
    <>
    <div className="min-h-screen custom-bg">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Sistema de Recomendaciones Turísticas
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/hotels" className="transform hover:scale-105 transition-transform">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Hoteles</h2>
              <p className="text-gray-600">
                Descubre los mejores hoteles recomendados para ti
              </p>
            </div>
          </Link>
          <Link href="/packages" className="transform hover:scale-105 transition-transform">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Paquetes Turísticos</h2>
              <p className="text-gray-600">
                Explora nuestros paquetes turísticos más populares
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
    </>
  );
}
