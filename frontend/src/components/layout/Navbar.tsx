"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showMinLengthMessage, setShowMinLengthMessage] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // 검색 버튼 활성화 여부
  const isSearchEnabled = searchValue.trim().length >= 3;

  // Debounced 검색 함수
  const debouncedSearch = useCallback(async (keyword: string) => {
    if (keyword.length < 3) return;

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/products/suggestions?keyword=${encodeURIComponent(keyword)}`);
      if (response.ok) {
        const data: string[] = await response.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
        setSelectedIndex(-1);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setShowMinLengthMessage(false);

    // 기존 debounce 클리어
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // 3글자 미만이면 suggestions 숨기기
    if (value.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // 500ms 후 검색 요청
    debounceRef.current = setTimeout(() => {
      debouncedSearch(value);
    }, 500);
  };

  // 키보드 이벤트 핸들러
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectSuggestion(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // 제안 선택 핸들러
  const selectSuggestion = (suggestion: string) => {
    setSearchValue(suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    setSuggestions([]);
  };

  // 검색 실행
  const handleSearch = () => {
    if (searchValue.trim().length < 3) {
      setShowMinLengthMessage(true);
      return;
    }

    // 실제 검색 로직 (페이지 이동 등)
    console.log('Searching for:', searchValue);
    setShowSuggestions(false);
    // TODO: 검색 결과 페이지로 이동하는 로직 추가
  };

  // 외부 클릭 시 suggestions 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // cleanup debounce
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

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
          <div className="flex-1 mx-4 relative">
            <div className="relative rounded-md shadow-sm">
              <input
                ref={searchInputRef}
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                className="block w-full pl-4 pr-20 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search products... (min 3 characters)"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                {/* 로딩 스피너 또는 검색 버튼 */}
                {isLoading ? (
                  <div className="pr-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                  </div>
                ) : (
                  <button
                    onClick={handleSearch}
                    disabled={!isSearchEnabled}
                    className={`mr-1 p-2 rounded-md transition-colors ${isSearchEnabled
                        ? 'text-indigo-600 hover:bg-indigo-50 cursor-pointer'
                        : 'text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            {/* 최소 길이 메시지 */}
            {showMinLengthMessage && (
              <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm z-50">
                Please enter at least 3 characters to search.
              </div>
            )}

            {/* 자동완성 제안 목록 */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-50"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => selectSuggestion(suggestion)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${index === selectedIndex ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                      }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
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
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-30 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
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