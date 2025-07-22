
export const salesData = [
  { name: 'Jan', sales: Math.floor(Math.random() * 2000) + 1000 },
  { name: 'Feb', sales: Math.floor(Math.random() * 2000) + 1000 },
  { name: 'Mar', sales: Math.floor(Math.random() * 2000) + 1000 },
  { name: 'Apr', sales: Math.floor(Math.random() * 2000) + 1000 },
  { name: 'May', sales: Math.floor(Math.random() * 2000) + 1000 },
  { name: 'Jun', sales: Math.floor(Math.random() * 2000) + 1000 },
];

export const recentOrders = [
  { id: "ORD001", customer: "John Doe", date: "2023-07-22", total: "$150.00", status: "Shipped" },
  { id: "ORD002", customer: "Jane Smith", date: "2023-07-22", total: "$75.50", status: "Processing" },
  { id: "ORD003", customer: "Bob Johnson", date: "2023-07-21", total: "$220.00", status: "Delivered" },
  { id: "ORD004", customer: "Alice Williams", date: "2023-07-21", total: "$45.00", status: "Shipped" },
  { id: "ORD005", customer: "Charlie Brown", date: "2023-07-20", total: "$199.99", status: "Delivered" },
];

export const allProducts = [
  { id: "PROD001", name: "Astronaut Tee", category: "Apparel", price: "$29.99", stock: 50, status: "Active" },
  { id: "PROD002", name: "Galaxy Hoodie", category: "Apparel", price: "$59.99", stock: 30, status: "Active" },
  { id: "PROD003", name: "Smart Watch X1", category: "Electronics", price: "$249.99", stock: 0, status: "OutOfStock" },
  { id: "PROD004", name: "Wireless Earbuds Pro", category: "Electronics", price: "$179.99", stock: 45, status: "Active" },
  { id: "PROD005", name: "Modern Desk Lamp", category: "Home Goods", price: "$79.99", stock: 25, status: "Archived" },
];

export const allOrders = [
    ...recentOrders,
    { id: "ORD006", customer: "David Miller", date: "2023-07-20", total: "$88.00", status: "Processing" },
    { id: "ORD007", customer: "Eva Garcia", date: "2023-07-19", total: "$310.50", status: "Delivered" },
    { id: "ORD008", customer: "Frank Harris", date: "2023-07-19", total: "$12.00", status: "Cancelled" },
];

export const allUsers = [
    { id: "USR001", name: "John Doe", email: "john.doe@example.com", joinDate: "2023-01-15", orders: 5 },
    { id: "USR002", name: "Jane Smith", email: "jane.smith@example.com", joinDate: "2023-02-20", orders: 3 },
    { id: "USR003", name: "Bob Johnson", email: "bob.j@example.com", joinDate: "2023-03-10", orders: 8 },
    { id: "USR004", name: "Alice Williams", email: "alice.w@example.com", joinDate: "2023-04-05", orders: 2 },
    { id: "USR005", name: "Charlie Brown", email: "charlie@example.com", joinDate: "2023-05-21", orders: 12 },
    { id: "USR006", name: "David Miller", email: "david.m@example.com", joinDate: "2023-06-18", orders: 1 },
];
