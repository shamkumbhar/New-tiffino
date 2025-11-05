import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';
import { RouterLink, Router } from '@angular/router';
import { CuisinesService } from '../sharingdata/services/cusines.service';
import { PaymentService } from '../sharingdata/services/payment.service';

@Component({
  selector: 'app-paymentcheckoutpage',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './paymentcheckoutpage.component.html',
  styleUrl: './paymentcheckoutpage.component.css'
})
export class PaymentcheckoutpageComponent implements OnInit, AfterViewInit {
  orderData: any;
  cuisines: any[] = []; // Array to hold cuisine details for all items
  selectedPaymentMethod: string = 'UPI';
  initiateresponse: any;
showerror=false
  constructor(
    private router: Router,
    private cs: CuisinesService,
    private pay: PaymentService
  ) {}

  ngOnInit(): void {
    const state = history.state;
    if (state && state.orderItem) {
      this.orderData = state.orderItem;
      localStorage.setItem('latestOrder', JSON.stringify(this.orderData));
    } else {
      const stored = localStorage.getItem('latestOrder');
      if (stored) this.orderData = JSON.parse(stored);
    }

    if (this.orderData?.orderItems?.length) {
      this.loadAllCuisines(this.orderData.orderItems);
    }
  }

  // Load cuisine details for each item
  loadAllCuisines(orderItems: any[]) {
    this.cuisines = [];
    orderItems.forEach(item => {
      this.cs.cusinesbyid(item.mealId).subscribe({
        next: (res) => {
          console.log(res);
          this.cuisines.push(res);
        },
        error: (err) => console.error('Error loading cuisine', err)
      });
    });
  }

  initiatePayment() {
    if (!this.orderData) {
      alert('No order data available!');
      return;
    }

    // ✅ Extract cuisine IDs from the cuisines array
    const cuisineIds = this.cuisines.map(c => c.id);
    console.log('Cuisine IDs being sent:', cuisineIds);

    const paymentPayload = {
      orderId: this.orderData.id,
      userId: this.orderData.userId,
      amount: this.orderData.totalAmount,
      paymentMethod: this.selectedPaymentMethod,
    
    };

    this.pay.initiate(paymentPayload).subscribe(
      (res: any) => {
        alert('Payment initiated');
        console.log(res);
        this.initiateresponse = res;
       if (this.initiateresponse.status === 'FAILED') {
          // Pass the transactionId and order data to retry page
         this.router.navigate(['/paymentretry'], {
  queryParams: { 
    transactionId: this.initiateresponse.transactionId,
    orderId: this.initiateresponse.orderId,
    status:this.initiateresponse.status
  }
});
        } else {
          // Proceed with successful payment
          alert('Payment initiated successfully!');
          this.router.navigate(['/payment'], {
            state: { orderId: res.orderId }
          });
        }
      },
      (err: any) => {
        console.error('Payment failed:', err);
        alert('Payment failed. Please try again.');
      
      }
    );
  }

  @ViewChild('indiaPieChart') chartRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Tiffino (100%)', 'Zomato (60%)', 'Swiggy (55%)'],
          datasets: [{
            label: 'India Coverage (%)',
            data: [100, 60, 55],
            backgroundColor: ['#ff345', '#FF0000', '#FFA500'],
            borderColor: ['#fff', '#fff', '#fff'],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            },
            tooltip: {
              enabled: true
            }
          }
        }
      });
    }
  }
}