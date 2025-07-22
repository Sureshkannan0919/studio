import Link from "next/link";
import { Twitter, Github, Instagram } from "lucide-react";
import { SkateboardIcon } from "./icons/skateboard";

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <SkateboardIcon className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">SK Skates</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SK Skates, Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Github className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Instagram className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
