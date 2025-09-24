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
  id: number;
  productId: number;
  price: number;
  discount: number;
  recordedDate: Date;
}

export interface ProductSummary {
  id: string;
  name: string;
  price: number;
  discountedPrice: number;
  currency: string;
  imageUrl: string;
  linkUrl: string;
  tag: ProductTag | null; // Flutter의 nullable(? )과 동일
}

export enum ProductTag {
  GoodDeal = 'Good Deal',
  BestPrice = 'Best Price',
}

