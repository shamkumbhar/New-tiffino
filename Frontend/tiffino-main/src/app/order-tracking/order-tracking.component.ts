import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OtpService } from '../sharingdata/services/otp.service';
import { CuisinesService } from '../sharingdata/services/cusines.service';
import { Notificationserivce } from '../cashback.service';
import { CookieService } from 'ngx-cookie-service';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './order-tracking.component.html',
  styleUrl: './order-tracking.component.css'
})
export class OrderTrackingComponent implements OnInit{
  userId:any
orderId: number | null = null;
 partnerId!: number;
  partnerData: any;
showCuisines: boolean = false;
  orderData: any;
  cuisines: any[] = [];
   userDetails: any = {};  
   isBrowser!:boolean;
  constructor(private orderTracking: OtpService,   private readonly route: ActivatedRoute, 
      private readonly deliver: Notificationserivce,
      private readonly order: OtpService,
      private readonly cs: CuisinesService,@Inject(PLATFORM_ID) private platformId: Object) { this.isBrowser = isPlatformBrowser(this.platformId);}
toggleCuisines() {
  this.showCuisines = !this.showCuisines;
}
   ngOnInit(): void {
    this.loadLatestOrderFromStorage();

    if (this.orderId) {
      this.fetchOrderDetails(this.orderId);
    }

    if (this.partnerId) {
      this.deliver.getPartnerById(this.partnerId).subscribe({
        next: (data: any) => {
          this.partnerData = data;
        },
        error: (err) => {
          console.error('Error loading partner:', err);
        }
      });
    }
//      if (this.isBrowser) {
//     const raw = localStorage.getItem('user');
    
//     if (raw) {
//       const parsed = JSON.parse(raw);
//       this.userId = parsed.user?.id;  
       
//       this.userDetails = parsed.user; 
// if (this.userDetails?.gender) {
       
//       }
        
     
//     } 
//   }  
      // this.http.get<any[]>(`${environment.apiBaseUrl}/order/user/${this.userId}/history`)
  // .subscribe({
  //   next: (data) => {
  //     this.orders = Array.isArray(data) ? data : [data]; // always make it an array
  //     console.log("Orders loaded:", this.orders);
  //   },
  //   error: (err) => console.error(err)
  // });

  }

  loadLatestOrderFromStorage() {
    const stored = localStorage.getItem('orderHistory');
    if (stored) {
      try {
        const orders = JSON.parse(stored);
        const latest = orders[orders.length - 1]; // Get latest one
        this.orderId = latest.orderId;
        this.partnerId = latest.partnerId;
      } catch (e) {
        console.error('Error parsing stored orders:', e);
      }
    }
  }

  fetchOrderDetails(orderId: number) {
    this.order.getorderbyid(orderId).subscribe({
      next: (res: any) => {
        this.orderData = res;
        if (this.orderData?.orderItems?.length) {
          this.loadAllCuisines(this.orderData.orderItems);
        }
      },
      error: (err) => {
        console.error('Error fetching order data:', err);
      }
    });
  }

  loadAllCuisines(orderItems: any[]) {
    this.cuisines = [];
    orderItems.forEach(item => {
      this.cs.cusinesbyid(item.mealId).subscribe({
        next: (res: any) => this.cuisines.push(res),
        error: (err: any) => console.error('Error loading cuisine', err)
      });
    });
  }
}

