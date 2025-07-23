
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import OverviewChart from "@/components/admin/overview-chart";
import { DollarSign, Users, Package, ShoppingCart } from "lucide-react";
import { getProducts } from "@/lib/firebase/products";
import { getOrders } from "@/lib/firebase/orders";
import { getUsers } from "@/lib/firebase/users";
import type { Order, Product, User as AppUser } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [users, setUsers] = useState<AppUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const [productsData, ordersData, usersData] = await Promise.all([
                getProducts(),
                getOrders(),
                getUsers()
            ]);
            setProducts(productsData);
            setOrders(ordersData);
            setUsers(usersData);
            setLoading(false);
        }
        fetchData();
    }, []);

    const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const outOfStockProducts = products.filter(p => p.stock === 0).length;
    const recentOrders = orders.slice(0, 5);
    const totalCustomers = users.length; 

    // Placeholder for sales data for the chart
    const salesData = [
      { name: 'Jan', sales: 0 },
      { name: 'Feb', sales: 0 },
      { name: 'Mar', sales: 0 },
      { name: 'Apr', sales: 0 },
      { name: 'May', sales: 0 },
      { name: 'Jun', sales: 0 },
    ];


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold">Dashboard Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>}
            <p className="text-xs text-muted-foreground">Calculated from all orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {loading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{totalCustomers}</div>}
            <p className="text-xs text-muted-foreground">Total registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">+{totalOrders}</div>}
             <p className="text-xs text-muted-foreground">All-time order count</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {loading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{totalProducts}</div>}
            <p className="text-xs text-muted-foreground">{outOfStockProducts} products out of stock</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <OverviewChart salesData={salesData} />
        <Card>
            <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>A list of the most recent orders.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                         [...Array(5)].map((_, i) => (
                           <TableRow key={i}>
                              <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                              <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                              <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                              <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                           </TableRow>
                        ))
                      ) : (
                        recentOrders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell className="font-medium truncate max-w-[100px]">{order.id}</TableCell>
                            <TableCell>{order.customer.name}</TableCell>
                            <TableCell>${order.total.toFixed(2)}</TableCell>
                            <TableCell>
                               <Badge variant={order.status === 'Delivered' ? 'default' : order.status === 'Shipped' ? 'secondary' : 'outline'}>{order.status}</Badge>
                            </TableCell>
                        </TableRow>
                        ))
                      )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
