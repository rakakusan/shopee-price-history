import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';
import type { ProductDetail } from '@/models/Product';

interface ProductDetailProps {
  params: { id: string };
}

export default async function ProductDetailPage(props: ProductDetailProps) {
  const params = await props.params;
  const res = await fetch(
    `http://localhost:8080/api/products/${params.id}`,
    { cache: "no-store" }
  );
  if (!res.ok) notFound();

  const product: ProductDetail = await res.json();
  return <ProductDetailClient product={product} />;
}