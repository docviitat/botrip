'use client';
import ProductList from '@/app/components/ProductList';

export default function HotelsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Hoteles</h1>
        <ProductList
          type="hotel"
          endpoint="recommendations/hotel"
          title="Recomendados para ti"
        />
        <ProductList
          type="hotel"
          endpoint="hotels"
          title="Todos los hoteles"
        />
      </main>
    </div>
  );
}