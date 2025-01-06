'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

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

export default function ProductDetails() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const type = params.type as string;
  const id = params.id as string;

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/${type}s`);
      if (!response.ok) throw new Error('Failed to fetch product');
      const products = await response.json();
      const foundProduct = products.find((p: Product) => p.id === parseInt(id));
      if (!foundProduct) throw new Error('Product not found');
      setProduct(foundProduct);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!product) return;
    
    try {
      setActionLoading(true);
      const response = await fetch('http://localhost:5000/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id, product_type: type }),
      });

      if (!response.ok) throw new Error('Failed to process purchase');
      
      // Refetch product data to update the purchase count
      await fetchProduct();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [type, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h1>Cargandooo</h1>
        {/* <Loader2 className="w-8 h-8 animate-spin text-blue-600" /> */}
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <h3 className="font-semibold">Error</h3>
          <p>{error || 'Product not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link 
          href={`/${type}s`} 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          Back to {type}s
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-gray-600 text-lg mb-4">
                  {type === 'hotel' ? product.location : product.duration}
                </p>
                
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold mr-2">
                    ${product.price.toLocaleString()}
                  </span>
                  {type === 'hotel' && <span className="text-gray-600">/night</span>}
                </div>

                <div className="flex items-center mb-6">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="font-medium">{product.rating.toFixed(1)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold">{product.views.toLocaleString()}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">Total Purchases</p>
                  <p className="text-2xl font-bold">{product.purchases.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handlePurchase}
              disabled={actionLoading}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? (
                <h1>Cargandoooo</h1>
              ) : (
                'Purchase Now'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}