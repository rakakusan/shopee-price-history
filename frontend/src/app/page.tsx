import MainContent from '@/components/home/MainContent';
import PopularProducts from '@/components/home/PopularProducts';
import TopPriceDrops from '@/components/home/TopPriceDrops';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div>
      <MainContent />
      <PopularProducts />
      <TopPriceDrops />
      <Footer />
    </div>
  );
}