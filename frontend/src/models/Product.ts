export interface ProductDetail {
  id: number;
  sku: string;
  name: string;
  url: string;
  imageUrl: string;
  description: string;
  category: string;
  priceHistories: PriceHistory[];
}

export interface PriceHistory {
  id: number
  price: number
  discount: number
  // Backend sends `recordDate` (LocalDate). Keep as string and parse when needed.
  recordDate: string
}


export interface PriceHistoryResponse {
  id: number;
  price: number;
  discount: number;
  recordDate: string; // LocalDate as string
}

export interface ProductItemResponse {
  id: number;
  name: string;
  url: string;
  imageUrl: string;
  description: string;
  category: string;
  tag: string | null;
  latestPriceHistory: PriceHistoryResponse;
}

export interface ProductSummary {
  id: string;
  name: string;
  price: number;
  discountedPrice: number;
  currency: string;
  imageUrl: string;
  linkUrl: string;
  tag: ProductTag | null;
}

export enum ProductTag {
  GoodDeal = 'Good Deal',
  BestPrice = 'Best Price',
}

// Helper function to calculate discounted price
export function calculateDiscountedPrice(price: number, discountRate: number): number {
  // discountRate는 정수 퍼센트 (24 = 24%)이므로 100으로 나눠야 함
  return Math.round(price * (1 - discountRate / 100) * 100) / 100;
}

// Helper function to convert ProductItemResponse to ProductSummary
export function convertToProductSummary(item: ProductItemResponse): ProductSummary {
  const originalPrice = item.latestPriceHistory.price;
  const discountRate = item.latestPriceHistory.discount.valueOf(); // 24 (24%를 의미)
  const discountedPrice = calculateDiscountedPrice(originalPrice, discountRate);

  return {
    id: item.id.toString(),
    name: item.name,
    price: originalPrice,
    discountedPrice: discountedPrice,
    currency: 'VND',
    imageUrl: item.imageUrl,
    linkUrl: item.url,
    tag: item.tag as ProductTag | null,
  };
}

