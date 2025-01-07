'use client';
import ProductList from '@/app/components/ProductList';

export default function ProductsPage({ params }: { params: { type: 'hotels' | 'packages' } }) {
    const isHotels = params.type === 'hotels';

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 mb-6">
                        {isHotels ? (
                            <h1>🏢</h1>
                        ) : (
                            <h1>🛬</h1>
                        )}
                        <h1 className="font-playfair text-5xl font-bold">
                            {isHotels ? 'Luxury Hotels' : 'Travel Packages'}
                        </h1>
                    </div>
                    <p className="text-xl text-blue-100 max-w-2xl">
                        {isHotels
                            ? 'Discover handpicked hotels that offer the perfect blend of comfort, luxury, and unforgettable experiences.'
                            : 'Explore our curated travel packages designed to create lasting memories and extraordinary adventures.'}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <ProductList
                    type={isHotels ? 'hotel' : 'package'}
                    endpoint={`recommendations/${isHotels ? 'hotel' : 'package'}`}
                    title="Recommended for You"
                />
                <ProductList
                    type={isHotels ? 'hotel' : 'package'}
                    endpoint={params.type}
                    title={`All ${isHotels ? 'Hotels' : 'Packages'}`}
                />
            </div>
        </div>
    );
}