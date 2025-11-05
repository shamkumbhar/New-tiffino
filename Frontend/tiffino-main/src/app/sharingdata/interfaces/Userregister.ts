export interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
  addressType: string; // e.g., 'Home', 'Work'
}

export interface UserRegister {
  firstName: string;
  lastName: string;
  fullName: string;
  gender: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string[]; // form has roles as an array
  isActive: boolean;
  dietaryPreferences: string[]; // dropdown is multi-select
  allergenPreferences: string[]; // dropdown is multi-select
  profileImageUrl: string; // filename or URL string
  /*dateJoined: string; // ISO date string (e.g. '2024-07-07')
  lastLogin: string; */ // ISO date string
  addresses: Address[];
}

export interface OrderDto {
  userId: number;
  orderType: string;
  orderDate: string;
  deliveryTimeSlot: string;
  totalAmount: number;
  status: string;
  deliveryAddress?: AddressDto;
  orderItems: OrderItemDto[];
  mealTypes?: string[];
  isSubscription?: boolean;
  subscriptionType?: string;
  notes?: string;
}
export interface OrderItemDto {
  mealId: number;
  quantity: number;
  pricePerItem: number;
}
export interface AddressDto {
  id?: number;
  userId?: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
  addressType?: string;
}