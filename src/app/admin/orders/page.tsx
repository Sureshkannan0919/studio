
"use client";

import { useState, useEffect } from "react";
import type { Order } from "@/lib/types";
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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import { getOrders } from "@/lib/firebase/orders";
import { updateOrderStatus } from "@/lib/firebase/orders-admin";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    const fetchedOrders = await getOrders();
    setOrders(fetchedOrders);
    setLoading(false);
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Delivered": return "default";
      case "Shipped": return "secondary";
      case "Processing": return "outline";
      case "Cancelled": return "destructive";
      default: return "outline";
    }
  };

  const handleStatusUpdate = async (orderId: string, status: Order['status']) => {
    try {
      await updateOrderStatus(orderId, status);
      toast({ title: "Success", description: "Order status updated." });
      fetchOrders(); // Refresh orders list
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update order status." });
      console.error(error);
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return 'N/A';
    }
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  }

  return (
    <div className="space-y-8">
       <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-headline font-bold">Orders</h1>
                <p className="text-muted-foreground">Manage customer orders here.</p>
            </div>
       </div>
      <Card>
        <CardContent className="mt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                   [...Array(5)].map((_, i) => (
                     <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                     </TableRow>
                  ))
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium truncate max-w-[100px]">{order.id}</TableCell>
                      <TableCell>{order.customer.name}</TableCell>
                      <TableCell>{formatDate(order.createdAt).split(',')[0]}</TableCell>
                      <TableCell>₹{order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
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
                            <DropdownMenuItem onClick={() => handleViewDetails(order)}>View Details</DropdownMenuItem>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>Update Status</DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                 <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'Processing')}>Processing</DropdownMenuItem>
                                 <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'Shipped')}>Shipped</DropdownMenuItem>
                                 <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'Delivered')}>Delivered</DropdownMenuItem>
                                 <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'Cancelled')}>Cancelled</DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
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
      
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md w-[95%] md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Summary for order #{selectedOrder?.id.substring(0,7)}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 pt-4 text-sm max-h-[70vh] overflow-y-auto pr-2">
              <div className="space-y-2">
                <h3 className="font-semibold text-base">Customer Details</h3>
                <div className="grid grid-cols-[80px_1fr] gap-x-4 gap-y-2 text-left">
                  <span className="text-muted-foreground text-right">Name</span>
                  <span className="font-medium text-foreground">{selectedOrder.customer.name}</span>
                  <span className="text-muted-foreground text-right">Email</span>
                  <span className="font-medium text-foreground truncate">{selectedOrder.customer.email}</span>
                  <span className="text-muted-foreground text-right">Mobile</span>
                  <span className="font-medium text-foreground">{selectedOrder.customer.mobile || 'N/A'}</span>
                   <span className="text-muted-foreground text-right">Address</span>
                  <span className="font-medium text-foreground">{selectedOrder.customer.address ? `${selectedOrder.customer.address.street}, ${selectedOrder.customer.address.city}, ${selectedOrder.customer.address.zip}` : 'N/A'}</span>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                 <h3 className="font-semibold text-base">Order Information</h3>
                 <div className="grid grid-cols-[80px_1fr] gap-x-4 gap-y-2 text-left">
                    <span className="text-muted-foreground text-right">Order Time</span>
                    <span className="font-medium text-foreground">{formatDate(selectedOrder.createdAt)}</span>
                    <span className="text-muted-foreground text-right">Status</span>
                    <div className="font-medium text-foreground">
                      <Badge variant={getStatusVariant(selectedOrder.status)}>{selectedOrder.status}</Badge>
                    </div>
                 </div>
              </div>
              <Separator />
               <div>
                 <h3 className="font-semibold text-base mb-2">Items Ordered</h3>
                 <div className="space-y-3">
                    {selectedOrder.items.map(item => (
                        <div key={item.id} className="flex justify-between items-start">
                            <div className="flex-1">
                              <span className="font-medium text-foreground">{item.name}</span>
                              <span className="text-muted-foreground"> (x{item.quantity})</span>
                            </div>
                            <span className="font-medium text-foreground text-right w-[80px]">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                 </div>
                 <div className="flex justify-between font-bold text-base mt-3 pt-3 border-t">
                    <span>Total</span>
                    <span>₹{selectedOrder.total.toFixed(2)}</span>
                 </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}

    