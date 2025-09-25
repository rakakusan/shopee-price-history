"use client";

import type { ProductDetail } from '@/models/Product';
import Image from 'next/image';
import { useState } from 'react';
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

  // 전체 priceHistories의 기간 계산
  const allDates = detail.priceHistories.map(h => new Date(h.recordedDate));
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

  let data = detail.priceHistories.map(h => {
    const effective = applyDiscount(h.price, h.discount);
    return {
      date: new Date(h.recordedDate).toLocaleDateString(),
      price: effective,
      originalPrice: h.price,
      discount: h.discount
    };
  });

  if (data.length === 1) {
    data = [
      { date: '최초', price: data[0].price, originalPrice: data[0].originalPrice, discount: data[0].discount },
      { date: '현재', price: data[0].price, originalPrice: data[0].originalPrice, discount: data[0].discount },
    ];
  }

  const prices = data.map(d => d.price);
  const highest = Math.max(...prices);
  const lowest = Math.min(...prices);

  // Y축 width 동적 계산
  const maxPriceLength = Math.max(...prices).toLocaleString().length;
  const dynamicYAxisWidth = maxPriceLength * 10 + 20;

  // Y축 범위 계산 (10% 여유, 1000단위)
  const rawMin = lowest * 0.9;
  const rawMax = highest * 1.1;
  const minPrice = Math.floor(rawMin / 1000) * 1000;
  const maxPrice = Math.ceil(rawMax / 1000) * 1000;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1fr] gap-8 items-start">
        {/* 사진 */}
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
        {/* 설명 */}
        <div className="flex flex-col justify-start">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{detail.name}</h1>
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
            className="text-indigo-600 underline text-sm mb-2 self-start"
            onClick={() => setDescExpanded(v => !v)}
          >
            {descExpanded ? 'Hide Description' : 'View Description'}
          </button>
          <p className="mb-2">Category: {detail.category}</p>
        </div>
        {/* 가격 정보 */}
        <div
          className="flex flex-col gap-2 px-4 py-3 border border-gray-300 rounded-xl text-center w-full md:max-w-xs mx-auto md:mx-0 md:self-start"
        >
          <div className="text-2xl font-bold text-gray-900">
            Current: <span className="text-indigo-600">{prices[prices.length - 1].toLocaleString()}₫</span>
          </div>
          <div className="text-lg text-red-600 font-semibold">
            Max: {highest.toLocaleString()}₫
          </div>
          <div className="text-lg text-green-600 font-semibold">
            Min: {lowest.toLocaleString()}₫
          </div>
          <a
            href={detail.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 px-4 py-2 rounded bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
          >
            View at Shopee
          </a>
        </div>
      </div>
      <div className="mt-12">
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
              margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              {/* 왼쪽 y축: 가격 눈금 */}
              <YAxis
                yAxisId="left"
                domain={[minPrice, maxPrice]}
                tickCount={Math.floor((maxPrice - minPrice) / 1000) + 1}
                tickFormatter={v => v.toLocaleString()}
                orientation="left"
                width={dynamicYAxisWidth}
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
              <Tooltip formatter={v => v.toLocaleString()} />
              {/* 계단형(strokeDasharray) + steppedLine */}
              <Line
                type="stepAfter"
                dataKey="price"
                stroke="#4fd1c5"
                strokeWidth={3}
                dot={{ r: 4, fill: "#4fd1c5" }}
                isAnimationActive={false}
                yAxisId="left"
              />
              {/* 최고가 라인과 오른쪽 라벨 */}
              <ReferenceLine y={highest} yAxisId="right" stroke="red" strokeDasharray="6 6">
                <Label
                  value={`${highest.toLocaleString()}₫`}
                  position="right"
                  fill="red"
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