import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

export interface LoyaltyPoint {
  id: number;
  userId: number;
  currentPoints: number;
  totalEarnedPoints: number;
  lastUpdated: string;
  loyaltyTier: string;
}

export interface RewardTransaction {
  id: number;
  userId: number;
  pointsChange: number;
  transactionType: string;
  source?: string;
  transactionTime: string;
  expiryDate?: string;
  status: string;
  relatedOrderId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class RewardsService {
 // Adjust if needed
  private apiurl=environment.apiBaseUrl
  constructor(private http: HttpClient) {}

  getLoyaltyPoints(userId: number): Observable<LoyaltyPoint> {
    return this.http.get<LoyaltyPoint>(`${this.apiurl}/payments/giftcards/user/${userId}`);
  }

  getRewardTransactions(userId: number): Observable<RewardTransaction[]> {
    return this.http.get<RewardTransaction[]>(`${this.apiurl}/reward/api/reward-transactions/user/${userId}`);
  }

  redeemPoints(userId: number, amount: number): Observable<any> {
    return this.http.post(`${this.apiurl}/reward/api/redeem/${userId}`, { amount });
  }

  awardReferral(userId: number): Observable<RewardTransaction> {
    return this.http.post<RewardTransaction>(`${this.apiurl}/reward/api/referral-bonus/${userId}`, {});
  }

  reverseOrder(orderId: number): Observable<any> {
    return this.http.post(`${this.apiurl}/reward/api/reverse-reward/${orderId}`, {});
  }
}
