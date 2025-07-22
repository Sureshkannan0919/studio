
"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/hooks/use-wishlist.tsx";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, ShoppingCart, Heart } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Your Wishlist</h1>
        <p className="text-muted-foreground mt-2">Products you've saved for later.</p>
      </div>
      
      {wishlist.length === 0 ? (
        <Card className="text-center py-20 border-dashed">
          <CardContent className="flex flex-col items-center gap-4">
            <Heart className="w-16 h-16 text-primary" />
            <h2 className="text-2xl font-semibold mt-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground max-w-md">
              Looks like you haven't added anything yet. Start exploring and save your favorite skate gear!
            </p>
            <Button asChild className="mt-4">
              <Link href="/">Discover Products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] hidden md:table-cell">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wishlist.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="hidden md:table-cell">
                      <Link href={`/products/${item.id}`}>
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-md object-cover"
                          data-ai-hint={item.data_ai_hint}
                        />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/products/${item.id}`} className="font-medium hover:text-primary">
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted-foreground hidden sm:block">{item.category}</p>
                    </TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                       <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                         <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => addToCart(item)}
                            disabled={item.stock === 0}
                            aria-label="Add to cart"
                          >
                          <ShoppingCart className="h-5 w-5" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          onClick={() => removeFromWishlist(item.id)}
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
