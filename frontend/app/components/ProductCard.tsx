// components/ProductCard.tsx
'use client';
import { useState } from 'react';
// import { AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({
    view: false,
    purchase: false
  });
  const [error, setError] = useState<string | null>(null);

  const handleViewDetails = async () => {
    try {
      setLoading(prev => ({ ...prev, view: true }));
      setError(null);

      // Update views count
      const response = await fetch(`http://localhost:5000/api/update-views`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id, product_type: type }),
      });

      if (!response.ok) {
        throw new Error('Failed to update views');
      }

      // Navigate to details page
      router.push(`/${type}/${product.id}`);

      onUpdate();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(prev => ({ ...prev, view: false }));
    }
  };

  const handlePurchase = async () => {
    try {
      setLoading(prev => ({ ...prev, purchase: true }));
      setError(null);
      const response = await fetch(`http://localhost:5000/api/purchase`, {
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
      setLoading(prev => ({ ...prev, purchase: false }));
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
            {type === 'hotel' ? '/night' : ''}
          </span>
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            <span>{product.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <span>{product.views.toLocaleString()} views</span>
          <span>{product.purchases.toLocaleString()} purchases</span>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-600 rounded-md flex items-center">
            {/* <AlertCircle className="w-4 h-4 mr-2" /> */}
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="flex justify-between gap-4">
          <button
            onClick={handleViewDetails}
            disabled={loading.view || loading.purchase}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {loading.view ? (
              // <Loader2 className="w-4 h-4 animate-spin mx-auto" />
              <h1>Cargandooo</h1>
            ) : (
              'View Details'
            )}
          </button>
          <button
            onClick={handlePurchase}
            disabled={loading.view || loading.purchase}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading.purchase ? (
              // <Loader2 className="w-4 h-4 animate-spin mx-auto" />
              <h1>Cargandooo</h1>
            ) : (
              'Purchase'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}