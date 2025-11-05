export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  mealFrequency: string;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
  durationInWeeks: number;
  price: number;
  isActive: boolean;
}

export interface Address {
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
  addressType: 'HOME' | 'WORK';
}

export interface Customizations {
  spiceLevel?: string;
  additionalRequests?: string;
  portionSize?: string;
  billingCycle: string;
  autoRenew: boolean;
  totalInstallments: number;
}

export interface SubscriptionPayload {
  userId: number;
  planId: number;
  startDate: string;
  endDate: string;
  nextRenewalDate: string;
  nextInstallmentDate: string;
  currentInstallment: number;
  totalInstallments: number;
  installmentAmount: number;
  billingCycle: string;
  autoRenew: boolean;
  isInstallmentActive: boolean;
  status: string;
  customizations: Customizations;
  new_address: Address;
}