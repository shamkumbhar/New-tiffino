import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OtpService } from '../sharingdata/services/otp.service';
import { CuisinesService } from '../sharingdata/services/cusines.service';
import { Notificationserivce } from '../cashback.service';

@Component({
  selector: 'app-delivery-partner-profile',
  templateUrl: './delivery-partner-profile.component.html',
  styleUrls: ['./delivery-partner-profile.component.css'],  // fixed to styleUrls
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class DeliveryPartnerProfileComponent implements OnInit {
  partnerId!: number;
  partnerData: any;
  orderId!: number;
  orderData: any;
  cuisines: any[] = [];

  constructor(
    private readonly route: ActivatedRoute, 
    private readonly deliver: Notificationserivce,
    private readonly order: OtpService,
    private readonly cs: CuisinesService
  ) {}

  ngOnInit(): void {
    this.partnerId = Number(this.route.snapshot.paramMap.get('id'));

    this.route.queryParams.subscribe(params => {
      this.orderId = Number(params['orderId']);
      if (this.orderId) {
        this.fetchOrderDetails(this.orderId);
      }
    });

    this.deliver.getPartnerById(this.partnerId).subscribe({
      next: (data:any) => {
        this.partnerData = data;
        console.log('Partner Data:', data);
      },
      error: (err:any) => {
        console.error('Error loading partner:', err);
      }
    });
  }

  fetchOrderDetails(orderId: number) {
    this.order.getorderbyid(orderId).subscribe({
      next: (res: any) => {
        this.orderData = res;
        console.log('Order Data:', res);
        if (this.orderData?.orderItems?.length) {
          this.loadAllCuisines(this.orderData.orderItems);
        }
      },
      error: (err: any) => {
        console.error('Error fetching order data:', err);
      }
    });
  }

  loadAllCuisines(orderItems: any[]) {
    this.cuisines = [];
    orderItems.forEach(item => {
      this.cs.cusinesbyid(item.mealId).subscribe({
        next: (res: any) => {
          this.cuisines.push(res);
          console.log('Cuisine Item:', res);
        },
        error: (err: any) => console.error('Error loading cuisine', err)
      });
    });
  }
}