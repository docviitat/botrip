'use client';
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard'; // Corregido: importación directa del componente
// import { Loader2 } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  location?: string;
  duration?: string;
  price: number;
  rating: number;
  views: number;
  purchases: number;
}

interface ProductListProps {
  type: 'hotel' | 'package';
  endpoint: string;
  title: string;
}

export default function ProductList({ type, endpoint, title }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/${endpoint}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [endpoint]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        {/* <Loader2 className="w-8 h-8 animate-spin text-blue-600" /> */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        <h3 className="font-semibold">Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            type={type}
            onUpdate={fetchProducts}
          />
        ))}
      </div>
    </section>
  );
}