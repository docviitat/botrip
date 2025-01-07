'use client';
import { useState } from 'react';
import Image from 'next/image';
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
  image: string;
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

      const response = await fetch(`http://localhost:5000/api/update-views`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id, product_type: type }),
      });

      if (!response.ok) {
        throw new Error('Failed to update views');
      }

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
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-2xl hover:translate-y-[-4px] duration-300">
      <div className="relative">
        <div className="relative w-full pb-[56.25%]">
          <Image
            className="absolute inset-0 w-full h-full object-cover"
            width={400}  
            height={192} 
            src={product.image}
            alt={product.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
          <p className="text-blue-50">
            {type === 'hotel' ? product.location : product.duration}
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-2xl font-bold text-blue-900">
              ${product.price.toLocaleString()}
            </span>
            <span className="text-gray-600 text-sm ml-1">
              {type === 'hotel' ? '/night' : ' total'}
            </span>
          </div>
          <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
            <span className="text-yellow-500 mr-1">★</span>
            <span className="font-medium text-blue-900">{product.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-1">
            <span>{product.views.toLocaleString()} views</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{product.purchases.toLocaleString()} bookings</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center">
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleViewDetails}
            disabled={loading.view || loading.purchase}
            className="flex-1 bg-blue-50 text-blue-700 py-3 px-4 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 font-medium"
          >
            {loading.view ? 'Loading...' : 'View Details'}
          </button>
          <button
            onClick={handlePurchase}
            disabled={loading.view || loading.purchase}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
          >
            {loading.purchase ? 'Processing...' : 'Book Now'}
          </button>
        </div>
      </div>
    </div>
  );
}