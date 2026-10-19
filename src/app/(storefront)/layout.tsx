import Header from '@/components/storefront/Header';
import Navigation from '@/components/storefront/Navigation';
import Footer from '@/components/storefront/Footer';
import WelcomePopup from '@/components/storefront/WelcomePopup';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Navigation />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WelcomePopup />
    </>
  );
}
