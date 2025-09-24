import ProductList from '@/components/shared/ProductList';
import { ProductSummary, ProductTag } from '@/models/Product';

// 테스트 데이터를 생성하는 함수
function generateTestProducts(): ProductSummary[] {
  return [
    {
      id: '1',
      name: 'Apple iPhone 13',
      price: 999.99,
      discountedPrice: 899.99,
      currency: 'USD',
      imageUrl: 'https://cdn.viettelstore.vn/Images/Product/ProductImage/401676858.jpeg',
      linkUrl: 'https://example.com/iphone13',
      tag: ProductTag.BestPrice,
    },
    {
      id: '2',
      name: 'Samsung Galaxy S21',
      price: 799.99,
      discountedPrice: 699.99,
      currency: 'USD',
      imageUrl: 'https://cdn.tgdd.vn/Products/Images/42/220833/samsung-galaxy-s21-tim-600x600.jpg',
      linkUrl: 'https://example.com/galaxy_s21',
      tag: ProductTag.BestPrice,
    },
    {
      id: '3',
      name: 'Sony WH-1000XM4 Headphones with Noise Cancelling',
      price: 349.99,
      discountedPrice: 299.99,
      currency: 'USD',
      imageUrl: 'https://www.sony.com.vn/image/5d02da5df552836db894cead8a68f5f3?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF',
      linkUrl: 'https://example.com/sony_headphones',
      tag: ProductTag.GoodDeal,
    },
    {
      id: '4',
      name: 'Dell XPS 13 Laptop',
      price: 1299.99,
      discountedPrice: 1199.99,
      currency: 'USD',
      imageUrl: 'https://bizweb.dktcdn.net/thumb/grande/100/512/769/products/dell-xps-13-9340.webp?v=1716793972937',
      linkUrl: 'https://example.com/dell_xps13',
      tag: null,
    },
    {
      id: '5',
      name: 'Nike Air Max 270',
      price: 150.0,
      discountedPrice: 120.0,
      currency: 'USD',
      imageUrl: 'https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/covmdnim1rkbkbxtm23v/NIKE+AIR+MAX+270+%28GS%29.png',
      linkUrl: 'https://example.com/nike_airmax270',
      tag: ProductTag.GoodDeal,
    },
    {
      id: '6',
      name: 'Instant Pot Duo 7-in-1',
      price: 89.99,
      discountedPrice: 69.99,
      currency: 'USD',
      imageUrl: 'https://pos.nvncdn.com/a3f390-68/ps/20180401_qaT06uW39bCmmGoatoK14rOf.jpg',
      linkUrl: 'https://example.com/instant_pot',
      tag: ProductTag.GoodDeal,
    },
    {
      id: '7',
      name: 'Apple Watch Series 7',
      price: 399.99,
      discountedPrice: 349.99,
      currency: 'USD',
      imageUrl: 'https://techland.com.vn/wp-content/uploads/2021/11/Apple_Watch_Series_7_Cell_41mm_Blue_Aluminum_Abyss_Blue_Sport_Band_PDP_Image_Position-1__VN-scaled.jpg',
      linkUrl: 'https://example.com/apple_watch',
      tag: ProductTag.GoodDeal,
    },
    {
      id: '8',
      name: 'Kindle Paperwhite',
      price: 139.99,
      discountedPrice: 109.99,
      currency: 'USD',
      imageUrl: 'https://www.maydocsach.vn/images/detailed/10/kindle-paperwhite-6-Signature-Edition.jpg',
      linkUrl: 'https://example.com/kindle_paperwhite',
      tag: ProductTag.BestPrice,
    },
  ];
}

export default function PopularProducts() {
  const products = generateTestProducts(); // 테스트 데이터 생성

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ProductList
        title="Popular Products"
        titleLink="/popular"
        description="Check out the most popular products on Shopee right now."
        products={products}
        currencyCode="VND"
      />
    </section>
  );
}