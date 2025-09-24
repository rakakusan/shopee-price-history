export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between">
          <div className="space-y-2">
            <a href="/about" className="text-gray-600 hover:text-indigo-600">About</a>
            <a href="/blog" className="text-gray-600 hover:text-indigo-600">Blog</a>
            <a href="/features" className="text-gray-600 hover:text-indigo-600">Features</a>
            <a href="/terms" className="text-gray-600 hover:text-indigo-600">Terms</a>
            <a href="/privacy" className="text-gray-600 hover:text-indigo-600">Privacy</a>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            © 2025 Shopee Price Tracker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}