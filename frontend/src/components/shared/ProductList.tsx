import Link from 'next/link';
import Image from 'next/image'; // Next.js의 Image 컴포넌트 추가
import getSymbolFromCurrency from 'currency-symbol-map'; // 패키지 추가
import { ProductSummary } from '@/models/Product';

interface ProductListProps {
  title: string;
  titleLink: string;
  description: string;
  products: ProductSummary[];
  currencyCode: string; // 통화 정보 추가
}

export default function ProductList({ title, titleLink, description, products, currencyCode }: ProductListProps) {
  const currencySymbol = getSymbolFromCurrency(currencyCode) || currencyCode; // 통화 기호 변환
  return (
    <section className="py-12">
      {/* 제목과 설명 */}
      <div className="mb-6 text-left">
        <h2 className="text-2xl font-bold text-gray-900">
          <Link href={titleLink} className="hover:text-indigo-600">
            {title}
          </Link>
        </h2>
        <p className="text-gray-600">{description}</p>
      </div>

      {/* 물건 리스트 */}
      <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
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
            </div>
            {/* 텍스트와 버튼 중앙 정렬 */}
            <div className="text-center flex flex-col">
              {/* 제목 영역 고정 높이 */}
              <h3 className="text-lg font-bold text-gray-900 line-clamp-2 h-12 mb-3">
                <Link href={`/product/${product.id}`} className="hover:text-indigo-600">
                  {product.name}
                </Link>
              </h3>
              {/* 금액 영역 */}
              <div className="flex flex-col items-center h-12"> {/* 높이 고정 및 여백 제거 */}
                <p className="text-gray-600 line-through text-base"> {/* 기존 text-sm → text-base */}
                  {currencySymbol}{product.price.toLocaleString()}
                </p>
                <p className="text-indigo-600 font-bold text-lg"> {/* 기존 text-base → text-lg */}
                  {currencySymbol}{product.discountedPrice.toLocaleString()}
                </p>
              </div>
              {/* 버튼 */}
              <div className="mt-3"> {/* 버튼 위쪽 여백 최소화 */}
                <Link
                  href={product.linkUrl}
                  className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  View at Shopee
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}