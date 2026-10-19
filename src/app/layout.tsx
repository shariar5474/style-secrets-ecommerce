import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'Style Secrets — Ladies Clothing Online Shop',
  description: 'Your favourite online store for trendy and premium ladies fashion. Shop sarees, salwar kameez, tops, hijab, western wear and more with Style Secrets.',
  keywords: ['ladies clothing', 'online shop', 'Bangladesh', 'saree', 'salwar kameez', 'fashion'],
  icons: {
    icon: '/images/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-brand-ivory text-brand-charcoal">
        {children}
      </body>
    </html>
  );
}
