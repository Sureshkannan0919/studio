
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, ShoppingCart, Users, Settings, Menu } from "lucide-react";
import { SkateboardIcon } from "@/components/icons/skateboard";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", label: "Overview", icon: Home },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/users", label: "Customers", icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full">
      <aside className="hidden w-64 flex-col border-r bg-muted/40 p-4 md:flex">
        <div className="flex h-16 items-center gap-2 mb-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <SkateboardIcon className="h-6 w-6 text-primary" />
            <span>SK Skates Admin</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname === item.href && "bg-muted text-primary"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Settings className="h-4 w-4" />
              Back to Store
            </Link>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center gap-4 border-b bg-muted/40 px-6 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <div className="flex h-16 items-center gap-2 mb-4">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <SkateboardIcon className="h-6 w-6 text-primary" />
                        <span>SK Skates Admin</span>
                    </Link>
                </div>
                <nav className="grid gap-2 text-lg font-medium">
                    {navItems.map((item) => (
                      <SheetClose key={item.href} asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                             pathname === item.href && "bg-muted text-foreground"
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.label}
                        </Link>
                      </SheetClose>
                    ))}
                </nav>
            </SheetContent>
          </Sheet>
           <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-muted/20">
            {children}
        </main>
      </div>
    </div>
  );
}
