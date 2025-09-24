import Link from 'next/link';
import Image from 'next/image';

export default function MainContent() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 왼쪽 섹션 */}
      <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start space-y-6">
        {/* 모바일: 텍스트 */}
        <h1 className="text-4xl font-bold text-gray-900 leading-tight lg:hidden text-center">
          <span className="text-indigo-600">Save money</span> <br />
          on your next <br />
          Shopee purchase.
        </h1>

        {/* 모바일: 이미지 */}
        <div className="w-full flex justify-center lg:hidden">
          <Image
            src="/images/pngegg.png"
            alt="Sad Frog"
            width={500} // 이미지의 너비를 설정
            height={500} // 이미지의 높이를 설정
            className="object-contain"
          />
        </div>

        {/* 모바일: 텍스트와 버튼 */}
        <div className="flex flex-col items-center space-y-4 lg:hidden">
          <p className="text-gray-600 text-lg text-center">
            camelcamelcamel is a free Shopee price history, alerting you to good deals on products you love.
          </p>
          <Link href="/signup">
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-indigo-700">
              Sign up for free
            </button>
          </Link>
        </div>

        {/* 데스크탑: 텍스트와 버튼 */}
        <div className="hidden lg:block">
          <h1 className="text-6xl font-bold text-gray-900 leading-tight">
            <span className="text-indigo-600">Save money</span> <br />
            on your next <br />
            Shopee purchase.
          </h1>
          <p className="text-gray-600 text-lg">
            camelcamelcamel is a free Shopee price history, alerting you to good deals on products you love.
          </p>
          <Link href="/signup">
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-indigo-700">
              Sign up for free
            </button>
          </Link>
        </div>
      </div>

      {/* 오른쪽 섹션 (데스크탑 전용) */}
      <div className="hidden lg:flex w-full lg:w-1/2 justify-center">
        <Image
          src="/images/pngegg.png"
          alt="Sad Frog"
          width={500} // 이미지의 너비를 설정
          height={500} // 이미지의 높이를 설정
          className="object-contain"
        />
      </div>
    </div>
  );
}