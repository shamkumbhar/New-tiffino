import { Component, OnInit } from '@angular/core';
import { CommonModule, ɵnormalizeQueryParams } from '@angular/common';
import { PaymentService } from '../sharingdata/services/payment.service';
import { CuisinesService } from '../sharingdata/services/cusines.service';
import { OtpService } from '../sharingdata/services/otp.service';
import { Notificationserivce } from '../cashback.service';
import { Router ,RouterModule} from '@angular/router';
export interface DeliveryPartner {
  id: number;
  name: string;
  phoneNumber: string;
  vehicleDetails: string;
  status: string;
  currentLatitude: number;
  currentLongitude: number;
}

export interface Delivery {
  id: number;
  orderId: number;
  deliveryPartner: DeliveryPartner;
  pickupTime: string;
  status: string;
  currentLatitude: number;
  currentLongitude: number;
}
@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class paymentComponent implements OnInit {
  orderData: any;
  cuisines: any[] = [];
  loading: boolean = false;
  showpopup: boolean = false;
  showErrorPopup: boolean = false;
  showpopups=false;
  showerror=false;
ordersucessdata:any;
ordercacel:any;

deliverpartnerData: Delivery | null = null;
deliverypartnername: string = '';
partnerid: any | null = null;
  constructor(
    private   paymentService: PaymentService,
    private  cs: CuisinesService,
    private  order: OtpService,
    private  deliver:Notificationserivce,
   private  route:Router,
  ) {}

  ngOnInit(): void {
    const state = history.state;
    if (state && state.orderId) {
      this.fetchOrderDetails(state.orderId);
    } else {
      const stored = localStorage.getItem('latestOrder');
      if (stored) {
        this.orderData = JSON.parse(stored);
        this.loadAllCuisines(this.orderData.orderItems);
      }
    }
  }
storeOrderAndPartner(orderId: number, partnerId: number) {
  const existing = localStorage.getItem('orderHistory');
  let history: { orderId: number; partnerId: number }[] = [];

  if (existing) {
    try {
      history = JSON.parse(existing);
    } catch (e) {
      console.error('Error parsing order history', e);
    }
  }

  // Avoid duplicates (optional)
  const alreadyExists = history.some(item => item.orderId === orderId);
  if (!alreadyExists) {
    history.push({ orderId, partnerId });
    localStorage.setItem('orderHistory', JSON.stringify(history));
  }
}
  fetchOrderDetails(orderId: number) {
    this.order.getorderbyid(orderId).subscribe({
      next: (res: any) => {
        this.orderData = res;
        localStorage.setItem('latestOrder', JSON.stringify(this.orderData));
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
        next: (res) => this.cuisines.push(res),
        error: (err) => console.error('Error loading cuisine', err)
      });
    });
  }

confirmOrder() {
  const orderId = this.orderData?.id;
  if (!orderId) return;

  this.loading = true;

  // Method 1: Confirm the order
  this.paymentService.confirm(orderId).subscribe({
    next: (res) => {
      this.loading = false;
      this.ordersucessdata = res;
      this.orderData.status = 'CONFIRMED';
      this.showpopup = true;
      this.order.setOrderId(this.ordersucessdata.orderId);
    console.log('orderid',this.ordersucessdata.orderId)

      this.deliver.assigndelivery(this.ordersucessdata.orderId).subscribe({
        next: (data:any) => {
          this.deliverpartnerData = data;
          this.deliverypartnername = data.deliveryPartner?.name || 'Not Assigned';
          this.partnerid = data.deliveryPartner?.id || null;
          this.order.setpartnerId(this.partnerid);
         this.storeOrderAndPartner(this.ordersucessdata.orderId, this.partnerid);
        },
        error: (err:any) => {
          console.error('Delivery assignment failed', err);
          this.deliverypartnername = 'Not Assigned';
        }
      });

      setTimeout(() => {
        this.showpopup = false;
      }, 4000);
    },
    error: (err) => {
      this.loading = false;
      console.error('Order confirmation failed', err);
      this.showErrorPopup = true;

      setTimeout(() => {
        this.showErrorPopup = false;
      }, 4000);
    }
  });
}
  cancelOrder() {
    const orderId = this.orderData?.id;
    if (!orderId) return;

    this.loading = true;

    this.paymentService.cancelpay(orderId).subscribe({
      next: (res) => {
        this.loading = false;
        this.orderData.status = 'CANCELED';
        this.showpopups = true;
        this.ordercacel=res
        setTimeout(() => {
          this.showpopups = false;
        }, 4000);


      },
      error: (err) => {
        this.loading = false;
        console.error('Cancel failed:', err);
        this.showerror = true;

        setTimeout(() => {
          this.showerror = false;
        }, 4000);
      }
    });
  }
navigateToPartner() {
    if (this.partnerid) {
      this.route.navigate(['/partner', this.partnerid],{queryParams: { orderId: this.ordersucessdata.orderId }} );
    }
  }

  bACK(){
    this.route.navigate(['/']);

  }
}





