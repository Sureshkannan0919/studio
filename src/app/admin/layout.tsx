
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, type User as FirebaseAuthUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUser } from "@/lib/firebase/users";
import { Home, Package, ShoppingCart, Users, Settings, Menu, ShieldCheck, Lock, ArrowLeft } from "lucide-react";
import { SkateboardIcon } from "@/components/icons/skateboard";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, SheetDescription } from "@/components/ui/sheet";
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
  const router = useRouter();
  const [user, setUser] = useState<FirebaseAuthUser | null>(null);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const appUser = await getUser(currentUser.uid);
        if (appUser && appUser.role === 'superuser') {
          setIsSuperuser(true);
        } else {
          setIsSuperuser(false);
          router.push('/'); // Redirect non-superusers
        }
      } else {
        router.push('/login'); // Redirect unauthenticated users
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <ShieldCheck className="h-12 w-12 text-primary animate-pulse" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isSuperuser) {
    // This part should ideally not be reached due to the redirect, but it's a good fallback.
     return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center p-4">
          <Lock className="h-12 w-12 text-destructive" />
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">You do not have permission to view this page.</p>
          <Button asChild>
            <Link href="/">Return to Homepage</Link>
          </Button>
        </div>
      </div>
    );
  }


  return (
    <div className="flex h-screen w-full bg-muted/40">
      <aside className="hidden w-64 flex-col border-r bg-background md:flex">
        <div className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <SkateboardIcon className="h-6 w-6 text-primary" />
            <span>SK Skates Admin</span>
          </Link>
        </div>
        <nav className="flex-1 flex flex-col gap-2 p-4">
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
          <div className="mt-auto">
              <Button asChild variant="ghost" className="w-full justify-start text-muted-foreground px-3">
                  <Link href="/">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Store
                  </Link>
              </Button>
          </div>
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6">
          <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
                <SheetTitle className="sr-only">Admin Menu</SheetTitle>
                <SheetDescription className="sr-only">Main navigation for the admin dashboard.</SheetDescription>
                 <div className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <SkateboardIcon className="h-6 w-6 text-primary" />
                        <span>SK Skates Admin</span>
                    </Link>
                </div>
                <nav className="grid gap-2 p-4 text-lg font-medium">
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
                <div className="absolute bottom-4 left-4 right-4">
                    <SheetClose asChild>
                       <Button asChild variant="outline" className="w-full">
                         <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Store
                         </Link>
                       </Button>
                    </SheetClose>
                </div>
            </SheetContent>
          </Sheet>
          </div>
           <h1 className="text-lg font-semibold flex-1 md:flex-grow-0">Admin Dashboard</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
        </main>
        <footer className="sticky bottom-0 z-10 border-t bg-background py-4 px-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} SK Skates Admin Panel
        </footer>
      </div>
    </div>
  );
}
