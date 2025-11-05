import { Component } from '@angular/core';
import { CuisinesService } from '../sharingdata/services/cusines.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {  Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { OtpService } from '../sharingdata/services/otp.service';
import { OrderDto } from '../sharingdata/interfaces/Userregister';

@Component({
  selector: 'app-add-tocart',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './add-tocart.component.html',
  styleUrl: './add-tocart.component.css'
})
export class AddTocartComponent {
  isBrowser: boolean;
  constructor(private cs:CuisinesService,private route:Router,@Inject(PLATFORM_ID) private platformId: Object,private otpservice:OtpService){
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
cartItems: [] = [];
  mappedCartItems: any[] = [];
userId!:number ; // <-- replace with logged-in userId
cusineid:any;
ngOnInit(): void {
  if (this.isBrowser) {
      const raw = localStorage.getItem('user');
      if (raw) {
        const parsed = JSON.parse(raw);
        this.userId = parsed?.id || parsed?.user?.id; // <-- adjust according to your user object    } else {
        // fallback so it's never undefined    }
    }}
  this.loadCart();
  
}
navigate(id:any){
  this.route.navigate(['/cusineinfo',id])
}
loadCart() {
    this.cs.getCart(this.userId).subscribe((res: any) => {
      this.cartItems = res;
      this.mappedCartItems = [];
    

      res.forEach((cartItem:any) => {
        this.cs.cusinesbyid(cartItem.cuisine_id).subscribe((cuisine: any) => {
          console.log(cuisine)
          this.cusineid=cuisine.id;
          this.mappedCartItems.push({
            cartItemId: cartItem.itemId,
            cuisine: cuisine,
            quantity: cartItem.quantity,
          totalPrice: cuisine.price_per_meal * cartItem.quantity
           
          });
        });
      });
    });
  }




remove(cartItemId: number) {
    this.cs.removeItem(cartItemId).subscribe(() => {
       this.cs.updateCartLengthFromServer(this.userId);
      this.loadCart();
    });
  }

 clearCart() {
    this.cs.clearCart(this.cartItems).then(() => {
    // After clearing the cart, update the cart length
    this.cs.updateCartLengthFromServer(this.userId);
    this.loadCart();
  });
  }

updateQuantity(item: any, change: number) {
  item.quantity += change;
  if (item.quantity < 1) {
    item.quantity = 1;
  }

  item.totalPrice = item.quantity * item.cuisine.price_per_meal;

  this.cs.updateItem(item.cartItemId, item.quantity).subscribe(() => {
    
  });
}

orderItem(item: any) {
  
  // Navigate to order page with just one item (individual item order)
  this.route.navigate(['/menu', item.cuisine.id], {
    state: { orderItem: item , totalAmount: item.totalPrice}
  });
}

orderFullCart() {
  const total = this.mappedCartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  this.route.navigate(['/menu', 'cart'], {
    state: { orderItems: this.mappedCartItems , totalAmount: total}
  });
}
 
hasSelectedItems(): boolean {
  return this.mappedCartItems.some(item => item.selected);
}

orderSelectedItems() {
  const selectedItems = this.mappedCartItems.filter(item => item.selected);
  const totals=this.mappedCartItems.reduce((Sum,item)=> Sum +item.totalPrice,0)
  if (selectedItems.length > 0) {
    this.route.navigate(['/menu', 'selected'], {
      state: { orderItems: selectedItems ,totalAmount:totals}
    });
  }
}

}
