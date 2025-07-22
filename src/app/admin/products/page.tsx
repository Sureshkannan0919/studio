
"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getProducts } from "@/lib/firebase/products";
import { addProduct, deleteProduct } from "@/lib/firebase/products-admin";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', stock: 0 });
    const { toast } = useToast();

    useEffect(() => {
      fetchProducts();
    }, []);

    const fetchProducts = async () => {
      setLoading(true);
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
      setLoading(false);
    }

    const getStatusVariant = (stock: number) => {
        if (stock > 0) return "default";
        return "destructive";
    };

     const getStatusText = (stock: number) => {
        if (stock > 0) return "In Stock";
        return "Out of Stock";
    };

    const handleAddProduct = async () => {
      try {
        await addProduct({
          ...newProduct,
          price: parseFloat(newProduct.price) || 0,
        });
        toast({ title: "Success", description: "Product added successfully." });
        setNewProduct({ name: '', category: '', price: '', stock: 0 });
        setIsAddDialogOpen(false);
        fetchProducts(); // Refresh product list
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to add product." });
        console.error(error);
      }
    };

    const handleDeleteProduct = async (productId: string) => {
       try {
        await deleteProduct(productId);
        toast({ title: "Success", description: "Product deleted successfully." });
        fetchProducts(); // Refresh product list
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to delete product." });
        console.error(error);
      }
    };

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-headline font-bold">Products</h1>
                <p className="text-muted-foreground">Manage your products here.</p>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Product
            </Button>
       </div>
      <Card>
        <CardContent className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                   <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                   </TableRow>
                ))
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(product.stock)}>{getStatusText(product.stock)}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem disabled>Edit</DropdownMenuItem>
                          <DropdownMenuItem disabled>Archive</DropdownMenuItem>
                           <AlertDialog>
                              <AlertDialogTrigger asChild>
                                  <Button variant="ghost" className="w-full justify-start text-destructive p-2 h-auto font-normal hover:text-destructive">Delete</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                  <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete this
                                      product from the database.
                                  </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteProduct(product.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                              </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>Fill in the details for the new product.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="col-span-3" />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">Category</Label>
                    <Input id="category" value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} className="col-span-3" />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">Price</Label>
                    <Input id="price" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="stock" className="text-right">Stock</Label>
                    <Input id="stock" type="number" value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})} className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddProduct}>Save Product</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </div>
  );
}
