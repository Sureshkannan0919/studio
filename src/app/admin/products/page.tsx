
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
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getProducts } from "@/lib/firebase/products";
import { addProduct, deleteProduct, editProduct } from "@/lib/firebase/products-admin";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type NewProductState = {
  name: string;
  category: string;
  price: string;
  stock: number;
  description: string;
  imageUrl: string;
  sizes: string;
}

const initialNewProductState: NewProductState = {
    name: '',
    category: '',
    price: '',
    stock: 0,
    description: '',
    imageUrl: '',
    sizes: ''
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [newProduct, setNewProduct] = useState<NewProductState>(initialNewProductState);
    const [editingProduct, setEditingProduct] = useState<Product & { sizesStr?: string } | null>(null);
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
          sizes: newProduct.sizes.split(',').map(s => s.trim()).filter(Boolean),
        });
        toast({ title: "Success", description: "Product added successfully." });
        setNewProduct(initialNewProductState);
        setIsAddDialogOpen(false);
        fetchProducts(); // Refresh product list
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to add product." });
        console.error(error);
      }
    };
    
    const handleEditClick = (product: Product) => {
        setEditingProduct({ ...product, sizesStr: product.sizes?.join(', ') || '' });
        setIsEditDialogOpen(true);
    };

    const handleUpdateProduct = async () => {
        if (!editingProduct) return;
        try {
            await editProduct(editingProduct.id, {
                ...editingProduct,
                price: parseFloat(editingProduct.price as any) || 0,
                sizes: editingProduct.sizesStr?.split(',').map(s => s.trim()).filter(Boolean) || []
            });
            toast({ title: "Success", description: "Product updated successfully." });
            setEditingProduct(null);
            setIsEditDialogOpen(false);
            fetchProducts();
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to update product." });
            console.error(error);
        }
    }

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
       <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-headline font-bold">Products</h1>
                <p className="text-muted-foreground">Manage your products here.</p>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)} className="w-full md:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Product
            </Button>
       </div>
      <Card>
        <CardContent className="mt-6">
          <div className="overflow-x-auto">
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
                      <TableCell>₹{product.price.toFixed(2)}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleEditClick(product)}>Edit</DropdownMenuItem>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full justify-start text-destructive p-2 h-auto font-normal hover:bg-destructive/10">Delete</Button>
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
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-md w-[95%]">
              <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>Fill in the details for the new product.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input id="imageUrl" value={newProduct.imageUrl} onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})} />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input id="stock" type="number" value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="sizes">Sizes (comma-separated)</Label>
                    <Input id="sizes" value={newProduct.sizes} onChange={(e) => setNewProduct({...newProduct, sizes: e.target.value})} placeholder="e.g. 8, 9, 10" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddProduct}>Save Product</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md w-[95%]">
              <DialogHeader>
                  <DialogTitle>Edit Product</DialogTitle>
                  <DialogDescription>Update the details for this product.</DialogDescription>
              </DialogHeader>
              {editingProduct && (
                <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                  <div className="grid gap-2">
                      <Label htmlFor="edit-name">Name</Label>
                      <Input id="edit-name" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct!, name: e.target.value})} />
                  </div>
                   <div className="grid gap-2">
                      <Label htmlFor="edit-category">Category</Label>
                      <Input id="edit-category" value={editingProduct.category} onChange={(e) => setEditingProduct({...editingProduct!, category: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                      <Label htmlFor="edit-description">Description</Label>
                      <Textarea id="edit-description" value={editingProduct.description} onChange={(e) => setEditingProduct({...editingProduct!, description: e.target.value})} />
                  </div>
                   <div className="grid gap-2">
                      <Label htmlFor="edit-imageUrl">Image URL</Label>
                      <Input id="edit-imageUrl" value={editingProduct.imageUrl} onChange={(e) => setEditingProduct({...editingProduct!, imageUrl: e.target.value})} />
                  </div>
                   <div className="grid gap-2">
                      <Label htmlFor="edit-price">Price</Label>
                      <Input id="edit-price" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct!, price: parseFloat(e.target.value) || 0})} />
                  </div>
                  <div className="grid gap-2">
                      <Label htmlFor="edit-stock">Stock</Label>
                      <Input id="edit-stock" type="number" value={editingProduct.stock} onChange={(e) => setEditingProduct({...editingProduct!, stock: Number(e.target.value)})} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-sizes">Sizes (comma-separated)</Label>
                    <Input id="edit-sizes" value={editingProduct.sizesStr} onChange={(e) => setEditingProduct({...editingProduct!, sizesStr: e.target.value})} placeholder="e.g. 8, 9, 10" />
                </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleUpdateProduct}>Save Changes</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </div>
  );
}
