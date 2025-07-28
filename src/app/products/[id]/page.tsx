
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/lib/firebase/products";
import type { Metadata, ResolvingMetadata } from 'next';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import ProductActions from "./_components/product-actions";
import type { Product } from "@/lib/types";

// This function is optional, but recommended for performance
// It tells Next.js which product pages to pre-build at build time
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

type Props = {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id
  const product = await getProduct(id)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.imageUrl, ...previousImages],
    },
  }
}

function ProductJsonLd({ product }: { product: Product }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.imageUrl,
    description: product.description,
    sku: product.id,
    mpn: product.id,
    brand: {
      '@type': 'Brand',
      name: 'SK Skates',
    },
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5', // Placeholder value
        bestRating: '5',
      },
      author: {
        '@type': 'Person',
        name: 'SK Skates Customer',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5', // Placeholder value
      reviewCount: '123', // Placeholder value
    },
    offers: {
      '@type': 'Offer',
      url: `https://sk-skates.com/products/${product.id}`, // Replace with your actual domain
      priceCurrency: 'INR',
      price: product.price.toFixed(2),
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], // Valid for 1 year
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}


export default async function ProductDetailPage({ params: { id } }: { params: { id: string } }) {
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  // Ensure images is an array, provide a fallback if it's not
  const productImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.imageUrl];

  return (
    <>
      <ProductJsonLd product={product} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <Carousel className="w-full">
              <CarouselContent>
                {productImages.map((img, index) => (
                  <CarouselItem key={index}>
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-0">
                         <Image
                          src={img}
                          alt={`${product.name} image ${index + 1}`}
                          width={600}
                          height={600}
                          className="rounded-lg object-cover w-full h-full"
                          data-ai-hint={product.data_ai_hint}
                        />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>

          <div className="space-y-6">
            <Badge variant="secondary">{product.category}</Badge>
            <h1 className="text-4xl font-headline font-bold">{product.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-accent">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <span className="text-muted-foreground">(123 reviews)</span>
            </div>
            <p className="text-lg text-muted-foreground">{product.description}</p>
            <p className="text-4xl font-bold text-primary">₹{product.price.toFixed(2)}</p>
            
            <ProductActions product={product} />

          </div>
        </div>
      </div>
    </>
  );
}
