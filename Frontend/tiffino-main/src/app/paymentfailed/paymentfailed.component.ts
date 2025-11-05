import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentService } from '../sharingdata/services/payment.service';  // Assuming you have a PaymentService to retry the payment.
import { CuisinesService } from '../sharingdata/services/cusines.service';
import { OtpService } from '../sharingdata/services/otp.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-paymentretry',
  standalone:true,
  imports:[CommonModule,FormsModule],
  templateUrl: './paymentfailed.component.html',
  styleUrls: ['./paymentfailed.component.css']
})
export class PaymentfailedComponen  {
  orderData: any;
  cuisines: any[] = [];
  transactionId: any;
  orderId: any;
  showError = false;
 status:any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private pay: PaymentService,
    private cs: CuisinesService,
    private order: OtpService  
  ) {}

ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    this.transactionId = params['transactionId'];
    this.orderId = params['orderId'];
    this.status=params['status']
    console.log(this.status)
    if (this.orderId) {
      this.order.getorderbyid(this.orderId).subscribe(
        (data: any) => {
          console.log('Order:', data);
          this.orderData = data;

          
          const mealIds = this.orderData.orderItems.map((item: any) => item.mealId);

         
          mealIds.forEach((mealId: number) => {
            this.cs.cusinesbyid(mealId).subscribe(
              (res: any) => {
                console.log('Cuisine by ID:', res);
                this.cuisines.push(res);
              },
              (err) => console.error('Error fetching cuisine:', err)
            );
          });
        },
        (error) => {
          console.error('Error fetching order:', error);
        }
      );
    }
  });
}
  retryPayment(): void {
    if (!this.transactionId ) {
      this.showError = true;
      return;
    }

   
  

    this.pay.retry(this.transactionId).subscribe(
      (response: any) => {
        if (response.status === 'PENDING') {
          alert('Payment successful!');
          this.router.navigate(['/payment'], { state: { orderId: this.orderId } });
        } else {
          this.showError = true;
          alert('Payment retry failed. Please try again.');
        }
      },
      (error: any) => {
        console.error('Payment retry failed:', error);
        this.showError = true;
      }
    );
  }
}