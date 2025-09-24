export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-96">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 border-b-4 border-gray-200 mb-4"></div>
      <div className="text-lg text-gray-600">상품 정보를 불러오는 중...</div>
    </div>
  );
}