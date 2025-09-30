import Link from 'next/link';
import Image from 'next/image'; // Next.js의 Image 컴포넌트 추가
import getSymbolFromCurrency from 'currency-symbol-map'; // 패키지 추가
import { ProductSummary } from '@/models/Product';
import { useState, useRef } from 'react';

interface ProductListProps {
  title: string;
  titleLink: string;
  description: string;
  products: ProductSummary[];
  currencyCode: string; // 통화 정보 추가
}

export default function ProductList({ title, titleLink, description, products, currencyCode }: ProductListProps) {
  const currencySymbol = getSymbolFromCurrency(currencyCode) || currencyCode; // 통화 기호 변환
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // 스크롤 상태 확인
  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // 좌측 스크롤
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 256 + 16; // w-64 (256px) + space-x-4 (16px)
      scrollContainerRef.current.scrollBy({ left: -cardWidth * 2, behavior: 'smooth' });
      setTimeout(checkScrollButtons, 300);
    }
  };

  // 우측 스크롤
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 256 + 16; // w-64 (256px) + space-x-4 (16px)
      scrollContainerRef.current.scrollBy({ left: cardWidth * 2, behavior: 'smooth' });
      setTimeout(checkScrollButtons, 300);
    }
  };
  return (
    <section className="py-12">
      {/* 제목과 설명 */}
      <div className="mb-6 text-left">
        <h2 className="text-2xl font-bold text-gray-900">
          <Link href={titleLink} className="hover:text-[#ef4030]">
            {title}
          </Link>
        </h2>
        <p className="text-gray-600">{description}</p>
      </div>

      {/* 스크롤 컨테이너와 버튼 */}
      <div className="relative">
        {/* 좌측 버튼 */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white border border-gray-200 rounded-full p-2 shadow-lg transition-all duration-200"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* 우측 버튼 */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white border border-gray-200 rounded-full p-2 shadow-lg transition-all duration-200"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* 물건 리스트 */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-4 scrollbar-hide scroll-smooth"
          onScroll={checkScrollButtons}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
        {products.slice(0, products.length).map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-64 border border-gray-300 rounded-2xl shadow-md p-4 bg-white"
          >
            <div className="relative w-full h-40 mb-3"> {/* 이미지와 제목 사이 간격 줄임 */}
              <Link href={`/product/${product.id}`}>
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  layout="fill" // 이미지가 부모 컨테이너를 채우도록 설정
                  objectFit="contain" // 이미지 비율 유지하며 모든 이미지가 보이도록 설정
                  className="rounded-md"
                  unoptimized // 최적화 비활성화
                />
              </Link>
              {/* 태그 오버레이 */}
              {product.tag && (
                <div className="absolute top-2 left-2">
                  <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium select-none user-select-none ${
                    (product.tag as string) === 'good'
                      ? 'bg-[#1f5200] text-[#95ff54]'
                      : (product.tag as string) === 'best'
                      ? 'bg-[#95ff54] text-[#1f5200]'
                      : 'bg-red-500 text-white'
                  }`}>
                    {(product.tag as string) === 'good' ? 'Good Deal'
                     : (product.tag as string) === 'best' ? 'Best Deal'
                     : product.tag}
                  </span>
                </div>
              )}
            </div>
            {/* 텍스트와 버튼 중앙 정렬 */}
            <div className="text-center flex flex-col">
              {/* 제목 영역 고정 높이 */}
              <h3 className="text-lg font-bold text-gray-900 line-clamp-2 h-12 mb-3">
                <Link href={`/product/${product.id}`} className="hover:text-[#ef4030]">
                  {product.name}
                </Link>
              </h3>
              {/* 금액 영역 */}
              <div className="flex flex-col items-center h-12"> {/* 높이 고정 및 여백 제거 */}
                <p className="text-gray-600 line-through text-base"> {/* 기존 text-sm → text-base */}
                  {product.price.toLocaleString()}{currencySymbol}
                </p>
                <p className="text-[#ef4030] font-bold text-lg"> {/* 기존 text-base → text-lg */}
                  {Math.round(product.discountedPrice).toLocaleString()}{currencySymbol}
                </p>
              </div>
              
              {/* 버튼 */}
              <div className="mt-3"> {/* 버튼 위쪽 여백 최소화 */}
                <Link
                  href={product.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gradient-to-b from-[#ef4030] to-[#f2653a] text-white px-4 py-2 rounded-md text-sm font-medium hover:from-[#d63a2a] hover:to-[#e5592f] transition-all duration-200"
                >
                  View at Shopee
                </Link>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </section>
  );
}