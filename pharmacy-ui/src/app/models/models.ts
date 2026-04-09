// Member 1 & Member 2 - Shared Models
export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
}

export interface Medicine {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  dosage: string;
  packaging: string;
  requiresPrescription: boolean;
  categoryId: number;
  categoryName: string;
}

export interface Category {
  id: number;
  name: string;
  medicinesCount: number;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  requiresPrescription: boolean;
}

export interface Order {
  id: number;
  orderDate: Date;
  totalAmount: number;
  status: string;
  items: OrderItem[];
}

export interface OrderItem {
  medicineId: number;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}