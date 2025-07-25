
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { CreditCard, Lock } from "lucide-react";
import Image from "next/image";
import { createOrder } from "@/lib/firebase/orders-admin";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    mobile: '',
    address: '',
    city: '',
    zip: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setCustomerInfo(prev => ({
          ...prev,
          email: currentUser.email || '',
          firstName: currentUser.displayName?.split(' ')[0] || '',
          lastName: currentUser.displayName?.split(' ')[1] || ''
        }));
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [id]: value }));
  };

  const handlePayment = async () => {
    if (isSubmitting || !acceptedTerms) return;

    setIsSubmitting(true);
    try {
      if (cart.length === 0) {
        toast({
          variant: "destructive",
          title: "Your cart is empty",
          description: "Please add items to your cart before checking out.",
        });
        return;
      }
      
      const orderData = {
        customer: {
          name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          email: customerInfo.email,
          mobile: customerInfo.mobile,
          address: {
            street: customerInfo.address,
            city: customerInfo.city,
            zip: customerInfo.zip,
          }
        },
        items: cart,
        total: totalPrice,
        status: "Processing",
      };

      const result = await createOrder(orderData);
      
      if (result.success) {
        toast({
          title: "Order Placed!",
          description: "Thank you for your purchase.",
        });

        clearCart();
        router.push("/account");
      } else {
        throw new Error(result.error || "An unknown error occurred.");
      }

    } catch (error: any) {
      console.error("Failed to create order:", error);
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: `There was a problem placing your order: ${error.message}`,
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) {
     return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-headline font-bold mb-8 text-center">Checkout</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-8 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                </div>
                 <div>
                  <Card>
                    <CardHeader>
                       <Skeleton className="h-8 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Skeleton className="h-16 w-full" />
                       <Skeleton className="h-16 w-full" />
                    </CardContent>
                     <CardFooter>
                       <Skeleton className="h-12 w-full" />
                     </CardFooter>
                  </Card>
                </div>
            </div>
        </div>
     )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-headline font-bold mb-8 text-center">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" value={customerInfo.firstName} onChange={handleInputChange}/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" value={customerInfo.lastName} onChange={handleInputChange}/>
                  </div>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="you@example.com" value={customerInfo.email} onChange={handleInputChange} disabled={!!user} />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input id="mobile" type="tel" placeholder="+1 234 567 890" value={customerInfo.mobile} onChange={handleInputChange}/>
                    </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="123 Main St" value={customerInfo.address} onChange={handleInputChange}/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Anytown" value={customerInfo.city} onChange={handleInputChange}/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" placeholder="12345" value={customerInfo.zip} onChange={handleInputChange}/>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="font-headline">Payment Details</CardTitle>
              <CardDescription>All transactions are secure and encrypted.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <div className="relative">
                    <Input id="card-number" placeholder="**** **** **** 1234" />
                    <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry-date">Expiry Date</Label>
                    <Input id="expiry-date" placeholder="MM / YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <Image src={item.imageUrl} alt={item.name} width={64} height={64} className="rounded-md" data-ai-hint={item.data_ai_hint} />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <p>Total</p>
                  <p>₹{totalPrice.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-6">
                <Checkbox id="terms" checked={acceptedTerms} onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)} />
                <Label htmlFor="terms" className="text-sm text-muted-foreground leading-normal">
                    I agree to the <Link href="/privacy-policy" className="underline hover:text-primary">Privacy Policy</Link> and acknowledge that products are non-refundable and non-returnable.
                </Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handlePayment} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6" disabled={cart.length === 0 || isSubmitting || !acceptedTerms}>
                <Lock className="mr-2 h-5 w-5" />
                {isSubmitting ? "Placing Order..." : `Pay ₹${totalPrice.toFixed(2)}`}
              </Button>
            </CardFooter>
          </Card>
          <div className="text-center">
             <Button variant="link" asChild>
                <Link href="/cart">Return to cart</Link>
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
