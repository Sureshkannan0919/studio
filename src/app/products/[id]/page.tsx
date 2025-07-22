
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/lib/firebase/products";
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

// This function is optional, but recommended for performance
// It tells Next.js which product pages to pre-build at build time
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  // Ensure images is an array, provide a fallback if it's not
  const productImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.imageUrl];

  return (
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
          <p className="text-4xl font-bold text-primary">${product.price.toFixed(2)}</p>
          
          <ProductActions product={product} />

        </div>
      </div>
    </div>
  );
}
