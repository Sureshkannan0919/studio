
"use client";

import { useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
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
  X,
  Heart,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { SkateboardIcon } from "./icons/skateboard";

export default function Header() {
  const { totalItems } = useCart();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#products", label: "Products" },
    { href: "/cart", label: "Cart", icon: ShoppingCart },
    { href: "/favorites", label: "Favorites", icon: Heart },
  ];
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get('search') as string;
    router.push(`/search?q=${searchQuery}`);
    setIsSearchOpen(false);
  }

  const handleLinkClick = (href: string) => {
    router.push(href);
    setIsSheetOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2 mr-auto">
          <Link href="/" className="flex items-center gap-2">
            <SkateboardIcon className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">SK Skates</span>
          </Link>
        </div>
        
        <div className={`absolute left-0 right-0 px-4 transition-all duration-300 ${isSearchOpen ? 'top-16 opacity-100' : 'top-0 opacity-0 pointer-events-none'}`}>
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                name="search"
                type="search"
                placeholder="Search products..."
                className="pl-8 w-full"
              />
              <Button variant="ghost" size="icon" className="absolute right-0 top-0" onClick={() => setIsSearchOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>
        
        <div className="flex items-center justify-end flex-1 space-x-2">
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
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
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
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="p-4">
                    <Link href="/" className="flex items-center gap-2 mb-8" onClick={() => setIsSheetOpen(false)}>
                        <SkateboardIcon className="h-6 w-6 text-primary" />
                        <span className="font-bold font-headline text-lg">SK Skates</span>
                    </Link>
                    <nav className="flex flex-col gap-1">
                      {navLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Button
                            key={link.href}
                            variant="ghost"
                            className="w-full justify-start text-lg font-medium text-muted-foreground hover:text-foreground -ml-1"
                            onClick={() => handleLinkClick(link.href)}
                          >
                            {Icon && <Icon className="mr-2 h-5 w-5" />}
                            {link.label}
                          </Button>
                        )
                      })}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="w-full justify-start px-0 text-lg font-medium text-muted-foreground hover:text-foreground -ml-1">
                            <User className="mr-2 h-5 w-5" /> Account
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                           <DropdownMenuItem asChild>
                              <Link href="/login" onClick={() => setIsSheetOpen(false)}>Login</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href="/register" onClick={() => setIsSheetOpen(false)}>Register</Link>
                            </DropdownMenuItem>
                             <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setIsSheetOpen(false)}>My Account</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
