'use client';
import { useState } from 'react';
// import { AlertCircle } from 'lucide-react';

type Product = {
  id: number;
  name: string;
  location?: string;
  duration?: string;
  price: number;
  rating: number;
  views: number;
  purchases: number;
};

interface ProductCardProps {
  product: Product;
  type: 'hotel' | 'package';
  onUpdate: () => void;
}

export default function ProductCard({ product, type, onUpdate }: ProductCardProps) {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({
    view: false,
    purchase: false
  });
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (endpoint: string) => {
    try {
      setLoading(prev => ({ ...prev, [endpoint]: true }));
      setError(null);
      const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id, product_type: type }),
      });

      if (!response.ok) {
        throw new Error('Failed to update');
      }

      onUpdate();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(prev => ({ ...prev, [endpoint]: false }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-102">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4">
          {type === 'hotel' ? product.location : product.duration}
        </p>

        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold">
            ${product.price.toLocaleString()}
            {type === 'hotel' ? '/noche' : ''}
          </span>
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            <span>{product.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <span>{product.views.toLocaleString()} vistas</span>
          <span>{product.purchases.toLocaleString()} compras</span>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-600 rounded-md flex items-center">
            {/* <AlertCircle className="w-4 h-4 mr-2" /> */}
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="flex justify-between gap-4">
          <button
            onClick={() => handleAction('update-views')}
            disabled={loading.view || loading.purchase}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {loading.view ? (
              <h1>Cargandooo</h1>
              // <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              'Ver detalles'
            )}
          </button>
          <button
            onClick={() => handleAction('purchase')}
            disabled={loading.view || loading.purchase}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading.purchase ? (
              <h1>Cargandooo</h1>
              // <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              'Comprar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}