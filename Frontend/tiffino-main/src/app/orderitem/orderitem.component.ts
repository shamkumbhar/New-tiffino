import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SubscriptionService } from '../sharingdata/services/subscription.service';
import { OtpService } from '../sharingdata/services/otp.service';
import { CuisinesService } from '../sharingdata/services/cusines.service';
import { ToastrService } from 'ngx-toastr';
declare const google: any;

@Component({
  selector: 'app-orderitem',
  
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule,RouterLink],
  templateUrl: './orderitem.component.html',
  styleUrl: './orderitem.component.css'
})
export class OrderitemComponent implements OnInit {
  isBrowser:boolean;
  userId!: number;
  address: any;
  token!: string;

  subscriptionId!: number | null;
  subscriptionType!: string | null;

  orderForm: FormGroup;
   orderItem: any;
   orderItems: any[] = [];
isBulkOrder: boolean = false;
totalAmount: number = 0;
showpopup: boolean = false;
isLoading:boolean=false;
  constructor(
    private toastr: ToastrService,
    private route: Router,
    private otp:OtpService,
    private cs:CuisinesService,
    private subscriptionService: SubscriptionService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,private activateroute:ActivatedRoute
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.orderForm = this.fb.group({
      orderType: ['ONE_TIME', Validators.required],
   
      deliveryDate: ['', Validators.required],
      deliveryTimeSlot: ['', Validators.required],
      addressType: ['HOME', Validators.required]
    });
  }

name:any;

  ngOnInit(): void {
 
    if (this.isBrowser) {
      const raw = localStorage.getItem('user'); 
      if (raw) {
        try {
        const parsed = JSON.parse(raw);
        this.name=parsed.user
        this.token = parsed?.token;
        this.address = parsed?.user?.addresses?.[0];
        this.userId = parsed?.id || parsed?.user?.id;
       
        } catch (error) {
          console.error('Error parsing localStorage user:', error);
        }
      
    
        // fetch subscription if exists
        if (this.userId && this.token) {
          this.subscriptionService.getusersplan(this.userId).subscribe({
            next: (res: any[]) => {
              if (res && res.length > 0) {
                const active = res[0];
                this.subscriptionId = active.id;   // usersubscriptionId
                this.subscriptionType = active.subscriptionPlan?.mealFrequency || null;;
                console.log('Active subscription:', active);
              } else {
                this.subscriptionId = null;
                this.subscriptionType = null;
              }
            },
            error: (err) => {
              console.error('Failed to fetch subscription:', err);
              this.subscriptionId = null;
              this.subscriptionType = null;
            }
          });
        }
      }
    }


  const id = this.activateroute.snapshot.paramMap.get('item');
    console.log('Cuisine ID from URL:', id);

    if (history.state && history.state.orderItems) {
  this.orderItems = history.state.orderItems; // For full cart
  this.isBulkOrder = true;
  this.totalAmount = history.state.totalAmount;
} else if (history.state && history.state.orderItem) {
  this.orderItem = history.state.orderItem; // For single item
  this.isBulkOrder = false;
  this.totalAmount = history.state.totalAmount;
}







  }


   
    OrderStatus:any='PENDING';
  placeOrder() {
    this.isLoading=true;
  const formValue = this.orderForm.value;
  const items = this.isBulkOrder ? this.orderItems : [this.orderItem];

  const orderItems = items.map((item: any) => ({
    mealId: item.cuisine.id,
    quantity: item.quantity,
    customizations: item.cuisine.allergen_preferences || '',
    pricePerItem: item.cuisine.price_per_meal
  }));

  const totalAmounts = orderItems.reduce((sum: number, item: any) => sum + item.pricePerItem * item.quantity, 0);

  const payload = {
    userId: this.userId,
    orderType: formValue.orderType,
    isSubscription: formValue.orderType === 'SUBSCRIPTION',
    subscriptionType: this.subscriptionType,
    userSubscriptionId: this.subscriptionId,
    OrderStatus:this.OrderStatus,
    orderDate: new Date().toISOString(),
    deliveryDate: formValue.deliveryDate,
    deliveryTimeSlot: formValue.deliveryTimeSlot,
    totalAmount: totalAmounts,
     addresses: [
    {
    
      addressLine1: this.address?.addressLine1,
      addressLine2: this.address?.addressLine2,
      city: this.address?.city,
      state: this.address?.state,
      pincode: this.address?.pincode,
      latitude: this.address?.latitude,
      longitude: this.address?.longitude,
      isDefault: true,
      addressType:this.orderForm.value.addressType
    }
  ],

    orderItems: orderItems
  };

  
this.otp.placeOrder(payload).subscribe(
  (data:any)=>{console.log(data)
        
     this.orderForm.reset({ orderType: 'ONE_TIME' });
          this.route.navigate(['/checkpayment'],{state: { orderItem: data, totalAmount: data.totalAmount
}}
  );
      
        
       
  },
  err=>{console.log(err);
    this.isLoading=false;
   
  }
)
   
}
}

