// ==================== AUTH MODELS ====================
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
}

// ==================== USER MODELS ====================
export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  createdAt: Date;
}

export interface UpdateUserRoleRequest {
  userId: number;
  role: string;
}

// ==================== MEDICINE MODELS ====================
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
  imageUrl?: string;
  manufacturer: string;
  createdAt: Date;
}

export interface MedicineCreateRequest {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  dosage: string;
  packaging: string;
  requiresPrescription: boolean;
  categoryId: number;
  manufacturer: string;
}

export interface UpdateStockRequest {
  medicineId: number;
  quantity: number;
}

// ==================== CATEGORY MODELS ====================
export interface Category {
  id: number;
  name: string;
  description: string;
  medicinesCount: number;
}

// ==================== CART MODELS ====================
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  requiresPrescription: boolean;
  stockQuantity: number;
  imageUrl?: string;
}

// ==================== ORDER MODELS ====================
export interface OrderItemDto {
  medicineId: number;
  quantity: number;
}

export interface PlaceOrderRequest {
  userId: number;
  prescriptionId?: number;
  items: OrderItemDto[];
  shippingAddress: string;
  paymentMethod: string;
}

export interface Order {
  id: number;
  userId: number;
  userName: string;
  orderDate: string;
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
  shippingAddress: string;
  paymentMethod: string;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  medicineId: number;
  medicineName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

// ==================== PRESCRIPTION MODELS ====================
export interface Prescription {
  id: number;
  userId: number;
  userName: string;
  imageUrl: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  uploadedAt: string;
  reviewedBy?: number;
  reviewNotes?: string;
}

export interface PrescriptionUploadRequest {
  userId: number;
  file: File;
}

// ==================== DASHBOARD MODELS ====================
export interface DashboardStats {
  totalUsers: number;
  totalMedicines: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockMedicines: number;
  pendingPrescriptions: number;
  recentOrders: Order[];
}