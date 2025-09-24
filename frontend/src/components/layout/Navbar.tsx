"use client";

import { useState } from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* 왼쪽 섹션: 로고 */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600">PriceTracker</span>
            </Link>
          </div>

          {/* 중앙 섹션: 검색 */}
          <div className="flex-1 mx-4">
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                className="block w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search products..."
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* 오른쪽 섹션: 메뉴 아이콘 (모바일) */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* 오른쪽 섹션: 네비게이션 링크 (데스크탑) */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              href="/popular"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              Popular Products
            </Link>
            <Link
              href="/top-drops"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              Top Price Drops
            </Link>
            <Link
              href="/signup"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              Sign Up
            </Link>
            <Link
              href="/signin"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 배경 */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* 모바일 메뉴 창 */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-30 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center px-4 py-4 border-b">
          <span className="text-lg font-bold text-indigo-600">Menu</span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-700 hover:text-indigo-600 focus:outline-none"
          >
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="flex flex-col space-y-4 px-4 py-6">
          <Link
            href="/popular"
            className="text-gray-700 hover:text-indigo-600 text-sm font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Popular Products
          </Link>
          <Link
            href="/top-drops"
            className="text-gray-700 hover:text-indigo-600 text-sm font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Top Price Drops
          </Link>
          <Link
            href="/signup"
            className="text-gray-700 hover:text-indigo-600 text-sm font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Sign Up
          </Link>
          <Link
            href="/signin"
            className="text-gray-700 hover:text-indigo-600 text-sm font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}