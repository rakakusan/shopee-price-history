import MainContent from '@/components/home/MainContent';
import DiscountedProducts from '@/components/home/DiscountedProducts';
import TopPriceDrops from '@/components/home/TopPriceDrops';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div>
      <MainContent />
      <DiscountedProducts />
      <TopPriceDrops />
      <Footer />
    </div>
  );
}