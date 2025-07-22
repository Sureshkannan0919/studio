
"use client";

import { useState } from 'react';
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  ShoppingCart,
  User,
  Search,
  Menu,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { SkateboardIcon } from "./icons/skateboard";

export default function Header() {
  const { totalItems } = useCart();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#products", label: "Products" },
    { href: "/cart", label: "Cart" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2 mr-auto">
          <Link href="/" className="flex items-center gap-2">
            <SkateboardIcon className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">SK Skates</span>
          </Link>
        </div>
        
        <div className="flex items-center justify-end space-x-2">
          <div className="hidden md:block">
            <form>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8 sm:w-64"
                />
              </div>
            </form>
          </div>

          <nav className="hidden md:flex gap-2">
             <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart />
                    {totalItems > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-primary-foreground transform translate-x-1/2 -translate-y-1/2 bg-accent rounded-full">
                        {totalItems}
                    </span>
                    )}
                    <span className="sr-only">Cart</span>
                </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User />
                  <span className="sr-only">User Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/login">Login</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/register">Register</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>My Account</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
          
          <div className="flex items-center md:hidden">
              <Button variant="ghost" size="icon">
                  <Search className="h-6 w-6" />
                  <span className="sr-only">Search</span>
                </Button>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="text-left mb-8">
                   <SheetTitle>
                      <Link href="/" className="flex items-center gap-2" onClick={() => setIsSheetOpen(false)}>
                          <SkateboardIcon className="h-6 w-6 text-primary" />
                          <span className="font-bold font-headline text-lg">SK Skates</span>
                      </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsSheetOpen(false)}
                        className="text-lg font-medium text-muted-foreground hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                  ))}
                  <Link href="/login" onClick={() => setIsSheetOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-foreground">Login</Link>
                  <Link href="/register" onClick={() => setIsSheetOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-foreground">Register</Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
