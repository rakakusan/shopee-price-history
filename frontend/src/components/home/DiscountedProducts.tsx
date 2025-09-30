'use client';

import { useEffect, useState } from 'react';
import ProductList from '@/components/shared/ProductList';
import { ProductSummary, ProductItemResponse, convertToProductSummary } from '@/models/Product';

export default function DiscountedProducts() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/products/deals');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ProductItemResponse[] = await response.json();
        const convertedProducts = data.map(convertToProductSummary);
        setProducts(convertedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">Loading popular products...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-red-600">Error: {error}</div>
      </section>
    );
  }

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ProductList
        title="Discounted Products"
        titleLink="/popular"
        description="Check out the most popular products on Shopee right now."
        products={products}
        currencyCode="VND"
      />
    </section>
  );
}