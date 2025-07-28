import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import Header from '@/components/header';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://shopwave.com'), // Replace with your actual domain
  title: {
    default: 'ShopWave | Your One-Stop E-commerce Destination',
    template: '%s | ShopWave',
  },
  description: 'Your one-stop shop for the best products, from electronics to fashion. Great deals, fast shipping!',
  openGraph: {
    title: 'ShopWave | Your One-Stop E-commerce Destination',
    description: 'Your one-stop for the best products.',
    url: 'https://shopwave.com', // Replace with your actual domain
    siteName: 'ShopWave',
    images: [
      {
        url: '/og-image.png', // Replace with a link to your open graph image
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShopWave | Your One-Stop E-commerce Destination',
    description: 'Your one-stop for the best products.',
    // images: ['/og-image.png'], // Replace with a link to your open graph image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/icons/logo.png" sizes="any" />
      </head>
      <body className="font-body antialiased">
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
