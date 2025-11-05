export interface Loyalty {
  id: number;
  userId: number;
  currentPoints: number;
  totalEarnedPoints: number;
  lastUpdated: string;
  loyaltyTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
}

// models/reward.model.ts
export interface Reward {
  id: number;
  userId: number;
  pointsChange: number;
  transactionType: 'ORDER_EARNED' | 'REFERRAL_BONUS';
  source: string;
  transactionTime: string;
  expiryDate: string;
  status: string;
  relatedOrderId?: number;
}