import HeroCarousel from '@/components/storefront/HeroCarousel';
import TrustBar from '@/components/storefront/TrustBar';
import CategorySection from '@/components/storefront/CategorySection';
import ProductGrid from '@/components/storefront/ProductGrid';
import PromoBanner from '@/components/storefront/PromoBanner';
import TrendingProducts from '@/components/storefront/TrendingProducts';
import Newsletter from '@/components/storefront/Newsletter';

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <TrustBar />
      <CategorySection />
      <ProductGrid />
      <PromoBanner />
      <TrendingProducts />
      <Newsletter />
    </>
  );
}
