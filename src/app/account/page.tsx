
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getOrders } from "@/lib/firebase/orders";
import type { Order } from "@/lib/types";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Package } from "lucide-react";

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const allOrders = await getOrders();
        const userOrders = allOrders.filter(
          (order) => order.customer.email === currentUser.email
        );
        setOrders(userOrders);
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch (e) {
      return "N/A";
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Delivered": return "default";
      case "Shipped": return "secondary";
      case "Processing": return "outline";
      case "Cancelled": return "destructive";
      default: return "outline";
    }
  };

  const formatAddress = (address: Order['customer']['address']) => {
    if (!address) return 'N/A';
    const { flat, street, landmark, city, state, zip } = address;
    let formatted = [flat, street, landmark, city, state, zip].filter(Boolean).join(', ');
    return formatted || 'N/A';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-headline font-bold mb-8">My Account</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <Card>
                    <CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-2/3" />
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2 space-y-4">
                 <Skeleton className="h-8 w-1/3" />
                 <Skeleton className="h-20 w-full" />
                 <Skeleton className="h-20 w-full" />
                 <Skeleton className="h-20 w-full" />
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-headline font-bold mb-8">My Account</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <aside className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">{user?.displayName}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </CardContent>
          </Card>
        </aside>

        <main className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Order History</h2>
          {orders.length > 0 ? (
             <Accordion type="single" collapsible className="w-full">
              {orders.map((order) => (
                <AccordionItem value={order.id} key={order.id}>
                  <AccordionTrigger>
                     <div className="flex justify-between w-full pr-4">
                        <div>
                            <p className="font-medium">Order #{order.id.substring(0, 7)}</p>
                            <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="text-right">
                           <p className="font-semibold">₹{order.total.toFixed(2)}</p>
                           <Badge variant={getStatusVariant(order.status)} className="mt-1">{order.status}</Badge>
                        </div>
                     </div>
                  </AccordionTrigger>
                  <AccordionContent>
                     <div className="p-4 bg-muted/20 rounded-md">
                        <h4 className="font-semibold mb-3">Order Summary</h4>
                        <div className="space-y-2">
                            {order.items.map(item => (
                                <div key={item.id} className="flex justify-between items-start text-sm">
                                    <div>
                                        <p className="font-medium text-foreground">{item.name}</p>
                                        <div className="text-muted-foreground text-xs">
                                            {item.size && <p>Size: {item.size}</p>}
                                            <p>Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <span className="font-medium text-foreground">₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <Separator className="my-3" />
                        <div className="flex justify-between font-bold text-base">
                            <span>Total</span>
                            <span>₹{order.total.toFixed(2)}</span>
                        </div>
                         {order.customer.address && (
                            <>
                                <Separator className="my-3" />
                                <h4 className="font-semibold mb-2">Shipping Address</h4>
                                <p className="text-sm text-muted-foreground">
                                    {formatAddress(order.customer.address)}
                                </p>
                           </>
                        )}
                     </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <Card className="text-center py-20">
                <CardContent className="flex flex-col items-center gap-4">
                    <Package className="w-16 h-16 text-muted-foreground" />
                    <h2 className="text-2xl font-semibold">No Orders Yet</h2>
                    <p className="text-muted-foreground">You haven't placed any orders yet. Let's change that!</p>
                    <Button asChild>
                    <Link href="/">Continue Shopping</Link>
                    </Button>
                </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
