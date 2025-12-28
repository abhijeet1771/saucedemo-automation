// BREAKING: New core types that change fundamental data structures
export interface User {
    uuid: string; // BREAKING: Changed from id (number) to uuid (string)
    email: string;
    profile: UserProfile; // BREAKING: Added required nested object
    permissions: Permission[]; // BREAKING: Changed from roles (string[]) to permissions (Permission[])
    metadata: Record<string, any>; // BREAKING: Added required metadata
}

export interface UserProfile {
    firstName: string;
    lastName: string;
    avatar?: string;
    preferences: UserPreferences; // BREAKING: Added nested preferences
}

export interface UserPreferences {
    theme: 'light' | 'dark';
    language: string;
    notifications: boolean;
}

export interface Permission {
    resource: string;
    actions: string[];
    conditions?: Record<string, any>;
}

export interface Product {
    sku: string; // BREAKING: Changed from id (number) to sku (string)
    name: string;
    price: Money; // BREAKING: Changed from number to Money object
    category: Category; // BREAKING: Changed from string to Category object
    inventory: InventoryStatus; // BREAKING: Changed from number to InventoryStatus object
    attributes: ProductAttributes; // BREAKING: Added required attributes
}

export interface Money {
    amount: number;
    currency: string;
    formatted: string;
}

export interface Category {
    id: string;
    name: string;
    parent?: string;
    metadata: Record<string, any>;
}

export interface InventoryStatus {
    available: number;
    reserved: number;
    total: number;
    status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface ProductAttributes {
    brand: string;
    model: string;
    specifications: Record<string, any>;
    tags: string[];
}

// BREAKING: Changed from class to interface
export interface CartItem {
    product: Product; // BREAKING: Changed from productId (number) to product (Product)
    quantity: number;
    addedAt: Date; // BREAKING: Added timestamp
    metadata: Record<string, any>; // BREAKING: Added metadata
}

// BREAKING: Completely redesigned Order interface
export interface Order {
    orderNumber: string; // BREAKING: Changed from id (number) to orderNumber (string)
    customer: User; // BREAKING: Changed from customerId (number) to customer (User)
    items: OrderItem[]; // BREAKING: Changed structure
    status: OrderStatus; // BREAKING: Changed from string to OrderStatus
    totals: OrderTotals; // BREAKING: Added totals object
    shipping: ShippingInfo; // BREAKING: Added shipping info
    payment: PaymentInfo; // BREAKING: Added payment info
    timestamps: OrderTimestamps; // BREAKING: Added timestamps
}

export interface OrderItem {
    product: Product;
    quantity: number;
    unitPrice: Money;
    totalPrice: Money;
    discounts: Discount[];
}

export interface OrderStatus {
    current: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    history: StatusHistory[];
}

export interface StatusHistory {
    status: string;
    timestamp: Date;
    user?: string;
    notes?: string;
}

export interface OrderTotals {
    subtotal: Money;
    tax: Money;
    shipping: Money;
    discounts: Money;
    total: Money;
}

export interface ShippingInfo {
    method: string;
    cost: Money;
    address: Address;
    tracking?: TrackingInfo;
}

export interface PaymentInfo {
    method: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
    transactionId?: string;
    amount: Money;
}

export interface OrderTimestamps {
    created: Date;
    confirmed?: Date;
    processed?: Date;
    shipped?: Date;
    delivered?: Date;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface TrackingInfo {
    carrier: string;
    trackingNumber: string;
    estimatedDelivery?: Date;
    updates: TrackingUpdate[];
}

export interface TrackingUpdate {
    status: string;
    timestamp: Date;
    location?: string;
    description: string;
}

export interface Discount {
    code: string;
    type: 'percentage' | 'fixed' | 'free_shipping';
    value: number;
    description: string;
}

// BREAKING: New error handling types
export class AppError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode: number,
        public details?: any
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export class ValidationError extends AppError {
    constructor(field: string, message: string) {
        super(`Validation failed for ${field}: ${message}`, 'VALIDATION_ERROR', 400, { field });
        this.name = 'ValidationError';
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string = 'Authentication failed') {
        super(message, 'AUTHENTICATION_ERROR', 401);
        this.name = 'AuthenticationError';
    }
}

export class AuthorizationError extends AppError {
    constructor(message: string = 'Access denied') {
        super(message, 'AUTHORIZATION_ERROR', 403);
        this.name = 'AuthorizationError';
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string, id: string) {
        super(`${resource} with id ${id} not found`, 'NOT_FOUND', 404, { resource, id });
        this.name = 'NotFoundError';
    }
}
