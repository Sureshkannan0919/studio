
"use client";

import { useState, useEffect, useMemo } from "react";
import type { Order } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getOrders } from "@/lib/firebase/orders";
import { updateOrderStatus } from "@/lib/firebase/orders-admin";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderTable from "@/components/admin/order-table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const searchedOrders = useMemo(() => {
    if (!searchQuery) return orders;
    return orders.filter(order => order.id.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [orders, searchQuery]);


  const getOrdersByStatus = (status: Order['status']) => {
    return searchedOrders.filter(order => order.status === status);
  }

   const formatAddress = (address: Order['customer']['address']) => {
    if (!address) return 'N/A';
    const { flat, street, landmark, city, state, zip } = address;
    let formatted = [flat, street, landmark, city, state, zip].filter(Boolean).join(', ');
    return formatted || 'N/A';
  };

  return (
    <div className="space-y-8">
       <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-headline font-bold">Orders</h1>
                <p className="text-muted-foreground">Manage customer orders here.</p>
            </div>
       </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:max-w-sm pl-9"
          />
        </div>

        {loading ? (
            <div className="space-y-4">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-48 w-full" />
            </div>
        ) : (
            <Tabs defaultValue="processing">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
                    <TabsTrigger value="processing">Processing ({getOrdersByStatus('Processing').length})</TabsTrigger>
                    <TabsTrigger value="shipped">Shipped ({getOrdersByStatus('Shipped').length})</TabsTrigger>
                    <TabsTrigger value="delivered">Delivered ({getOrdersByStatus('Delivered').length})</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled ({getOrdersByStatus('Cancelled').length})</TabsTrigger>
                </TabsList>
                <TabsContent value="processing">
                    <OrderTable 
                        orders={getOrdersByStatus('Processing')}
                        title="New Orders"
                        onStatusUpdate={handleStatusUpdate}
                        onViewDetails={handleViewDetails}
                    />
                </TabsContent>
                 <TabsContent value="shipped">
                    <OrderTable 
                        orders={getOrdersByStatus('Shipped')}
                        title="Shipped Orders"
                        onStatusUpdate={handleStatusUpdate}
                        onViewDetails={handleViewDetails}
                    />
                </TabsContent>
                 <TabsContent value="delivered">
                    <OrderTable 
                        orders={getOrdersByStatus('Delivered')}
                        title="Delivered Orders"
                        onStatusUpdate={handleStatusUpdate}
                        onViewDetails={handleViewDetails}
                    />
                </TabsContent>
                <TabsContent value="cancelled">
                    <OrderTable 
                        orders={getOrdersByStatus('Cancelled')}
                        title="Cancelled Orders"
                        onStatusUpdate={handleStatusUpdate}
                        onViewDetails={handleViewDetails}
                    />
                </TabsContent>
            </Tabs>
        )}
      
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
                   <span className="text-muted-foreground text-right align-top">Address</span>
                  <span className="font-medium text-foreground whitespace-pre-wrap">{formatAddress(selectedOrder.customer.address)}</span>
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
                                <p className="font-medium text-foreground">{item.name}</p>
                                <div className="text-sm text-muted-foreground">
                                    {item.size && <p>Size: {item.size}</p>}
                                    <p>Qty: {item.quantity}</p>
                                </div>
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
