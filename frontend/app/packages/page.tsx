'use client';
import ProductList from '@/app/components/ProductList';

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Paquetes Turísticos</h1>
        <ProductList
          type="package"
          endpoint="recommendations/package"
          title="Recomendados para ti"
        />
        <ProductList
          type="package"
          endpoint="packages"
          title="Todos los paquetes"
        />
      </main>
    </div>
  );
}