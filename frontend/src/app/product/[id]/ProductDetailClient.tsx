"use client";

import type { ProductDetail } from '@/models/Product';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { CartesianGrid, Label, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Props {
  product: ProductDetail;
}

const PERIODS = [
  { key: '1M', label: '1 Month', months: 1 },
  { key: '3M', label: '3 Months', months: 3 },
  { key: '6M', label: '6 Months', months: 6 },
  { key: '1Y', label: '1 Year', months: 12 },
  { key: 'ALL', label: 'All', months: null },
];

const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Helper function to format month labels
function formatMonthLabel(date: Date): string {
  const month = date.getMonth();
  if (month === 0) { // January = show year as '25', '24', etc
    return String(date.getFullYear()).slice(-2);
  }
  return MONTH_ABBR[month];
}

// Helper function to format X-axis labels
function formatXAxisLabel(value: string, period: string): string {
  const date = new Date(value);

  if (period === '1M') {
    // For 1 month view, show M/D format
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }

  // For other periods, use month abbreviation or year
  return formatMonthLabel(date);
}

function getFromDate(months: number | null) {
  if (!months) return null;
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function ProductDetailClient({ product }: Props) {
  const [selected, setSelected] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<ProductDetail>(product);
  const [descExpanded, setDescExpanded] = useState(false);

  // 페이지 진입 시 스크롤을 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 전체 priceHistories의 기간 계산
  const allDates = detail.priceHistories.map(h => new Date(h.recordDate));
  const minDate = allDates.length ? new Date(Math.min(...allDates.map(d => d.getTime()))) : null;
  const now = new Date();

  // 버튼 활성화 여부 계산
  const availablePeriods = PERIODS.map(p => {
    if (p.key === 'ALL') return true;
    if (!minDate) return false;
    const from = getFromDate(p.months);
    return from && minDate <= from;
  });

  // 버튼 클릭 핸들러
  const handlePeriodClick = async (period: typeof PERIODS[number]) => {
    if (selected === period.key || loading) return;
    setSelected(period.key);
    setLoading(true);

    let fromDate: string | undefined = undefined;
    let toDate: string | undefined = undefined;
    if (period.key !== 'ALL' && period.months) {
      const from = getFromDate(period.months);
      fromDate = from?.toISOString().slice(0, 10);
      toDate = now.toISOString().slice(0, 10);
    }

    // API 호출
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    const res = await fetch(`http://localhost:8080/api/products/${detail.id}?${params.toString()}`);
    if (res.ok) {
      const newDetail = await res.json();
      setDetail(newDetail);
    }
    setLoading(false);
  };

  const applyDiscount = (price: number, discount?: number) =>
    Math.round(price * (100 - (discount ?? 0)) / 100);

  // Backend delivers histories in descending date order; sort ascending for chart (oldest -> newest)
  const priceHistories = [...detail.priceHistories]
    .sort((a, b) => new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime());

  // 오늘 날짜 확인 및 마지막 데이터 복사
  const today = new Date().toISOString().slice(0, 10);
  const hasToday = priceHistories.some(h => h.recordDate === today);

  if (!hasToday && priceHistories.length > 0) {
    const lastHistory = priceHistories[priceHistories.length - 1];
    priceHistories.push({
      ...lastHistory,
      recordDate: today
    });
  }

  let data = priceHistories.map(h => {
    const effective = applyDiscount(h.price, h.discount);
    const isoDate = new Date(h.recordDate).toISOString().slice(0, 10);
    return {
      date: isoDate,
      price: effective,
      originalPrice: h.price,
      discount: h.discount
    };
  });

  if (data.length === 1) {
    const singleData = data[0];
    data = [
      singleData,
      { ...singleData, date: singleData.date }
    ];
  }

  const prices = data.map(d => d.price);
  const highest = Math.max(...prices);
  const lowest = Math.min(...prices);

  // Y축 width 동적 계산
  const maxPriceLength = Math.max(...prices).toLocaleString().length;
  const dynamicYAxisWidth = maxPriceLength * 10 + 20;

  // Calculate dynamic right margin so right-side labels (ReferenceLine) are not clipped
  const maxRightLabelLength = Math.max(
    highest.toLocaleString().length,
    lowest.toLocaleString().length
  );
  const rightMargin = maxRightLabelLength * 10 + 30;

  // Y축 범위 계산 (10% 여유, 1000단위)
  const rawMin = lowest * 0.9;
  const rawMax = highest * 1.1;
  const minPrice = Math.floor(rawMin / 1000) * 1000;
  const maxPrice = Math.ceil(rawMax / 1000) * 1000;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* 첫 번째 섹션: 이미지(40%) + 제품 정보(60%) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex gap-8">
            {/* 이미지 (40% width) */}
            <div className="w-2/5">
              <div className="relative w-full h-96">
                <Image
                  src={detail.imageUrl}
                  alt={detail.name}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-md"
                  unoptimized
                />
              </div>
            </div>

            {/* 제품 정보 (60% width) */}
            <div className="w-3/5 flex flex-col">
          {/* 제품 이름 */}
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{detail.name}</h1>

          {/* 가격 정보 - 한 줄로 배치 */}
          <div className="mb-6 flex items-center gap-4">
            {/* 할인된 가격 */}
            <span className="text-3xl font-bold text-indigo-600">
              {prices[prices.length - 1].toLocaleString()}₫
            </span>

            {/* 원래 가격 (취소선) */}
            <span className="text-xl font-semibold text-gray-500 line-through">
              {data[data.length - 1]?.originalPrice.toLocaleString()}₫
            </span>

            {/* 할인율 */}
            {data[data.length - 1]?.discount > 0 && (
              <span className="text-lg font-semibold text-red-600">
                -{data[data.length - 1]?.discount}%
              </span>
            )}

            {/* 태그 배지 */}
            {detail.tag && (
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${detail.tag === 'best'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
                }`}>
                {detail.tag === 'best' ? 'Best Deal' : 'Good Deal'}
              </span>
            )}
          </div>

          {/* MAX/MIN 가격 */}
          <div className="flex gap-8">
            <div>
              <p className="text-sm text-gray-600">MAX</p>
              <p className="text-lg font-semibold text-red-600">{highest.toLocaleString()}₫</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">MIN</p>
              <p className="text-lg font-semibold text-green-600">{lowest.toLocaleString()}₫</p>
            </div>
          </div>

          {/* Shopee 링크 버튼 */}
          <div className="mt-6">
            <a
              href={detail.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
            >
              View at Shopee
            </a>
          </div>
        </div>
        </div>
        </div>

        {/* 두 번째 섹션: Description */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
        <p
          className={`text-gray-700 mb-2 transition-all duration-200`}
          style={
            descExpanded
              ? { whiteSpace: 'pre-line' }
              : {
                whiteSpace: 'pre-line',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }
          }
        >
          {detail.description}
        </p>
        <button
          type="button"
          className="text-indigo-600 underline text-sm hover:text-indigo-800 transition"
          onClick={() => setDescExpanded(v => !v)}
        >
          {descExpanded ? 'Hide Description' : 'View Description'}
        </button>
        </div>

        {/* 세 번째 섹션: 차트 (100% width) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Price History</h2>
        {/* 기간 선택 버튼 */}
        <div className="flex gap-2 mb-6">
          {PERIODS.map((p, i) => (
            <button
              key={p.key}
              className={`px-4 py-2 rounded border text-sm font-semibold transition
                ${selected === p.key ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-800 border-gray-300'}
                ${!availablePeriods[i] ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              disabled={!availablePeriods[i] || loading}
              onClick={() => handlePeriodClick(p)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <LineChart
              data={data}
              margin={{ top: 20, right: rightMargin, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => formatXAxisLabel(value, selected)}
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
              />
              {/* 왼쪽 y축: 가격 눈금 */}
              <YAxis
                yAxisId="left"
                domain={[minPrice, maxPrice]}
                tickCount={Math.floor((maxPrice - minPrice) / 1000) + 1}
                tickFormatter={v => v.toLocaleString()}
                orientation="left"
                width={dynamicYAxisWidth}
                tick={{ fontSize: 10 }}
              />
              {/* 오른쪽 y축: 눈금 숨기고, 최고가/최저가 라벨만 */}
              <YAxis
                yAxisId="right"
                domain={[minPrice, maxPrice]}
                orientation="right"
                width={80}
                tick={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(value) => [
                  `${Number(value).toLocaleString()}₫`,
                  'Price'
                ]}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  });
                }}
                contentStyle={{
                  fontSize: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                cursor={{ stroke: '#4fd1c5', strokeWidth: 1, strokeDasharray: '5 5' }}
              />
              {/* 계단형 라인, 점 제거 */}
              <Line
                type="stepAfter"
                dataKey="price"
                stroke="#4fd1c5"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: "#4fd1c5", stroke: "#fff", strokeWidth: 2 }}
                isAnimationActive={false}
                yAxisId="left"
              />
              {/* 최고가 라인과 오른쪽 라벨 */}
              <ReferenceLine y={highest} yAxisId="right" stroke="red" strokeDasharray="6 6">
                <Label
                  value={`${highest.toLocaleString()}₫`}
                  position="right"
                  fill="red"
                  fontSize={10}
                  fontWeight="bold"
                  offset={10}
                />
              </ReferenceLine>
              {/* 최저가 라인과 오른쪽 라벨 */}
              <ReferenceLine y={lowest} yAxisId="right" stroke="green" strokeDasharray="6 6">
                <Label
                  value={`${lowest.toLocaleString()}₫`}
                  position="right"
                  fill="green"
                  fontSize={10}
                  fontWeight="bold"
                  offset={10}
                />
              </ReferenceLine>
            </LineChart>
          </ResponsiveContainer>
        </div>
        </div>
      </section>
  );
}