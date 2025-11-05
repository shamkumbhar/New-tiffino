import { HttpClient } from '@angular/common/http';
import { Component,inject,Injector,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CuisinesService } from '../sharingdata/services/cusines.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import {  Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-cuisineitem',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './cuisineitem.component.html',
  styleUrl: './cuisineitem.component.css'
})
export class CuisineitemComponent {
  isBrowser: boolean;
product:any;
constructor(private http:HttpClient,private route:ActivatedRoute,private cs:CuisinesService,private location:Location ,@Inject(PLATFORM_ID) private platformId: Object ){
 this.isBrowser = isPlatformBrowser(this.platformId);
}
 userId!: number; 
ngOnInit(): void {
if (this.isBrowser) {
 const raw = localStorage.getItem('user');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          this.userId = parsed?.id || parsed?.user?.id;
          // Optionally, trigger some logic with the userId
        } catch (error) {
          console.error('Error parsing localStorage user:', error);
        }
      }
}

    const id=this.route.snapshot.paramMap.get('id')
   this.cs.cusinesbyid(id).subscribe(
    (data)=>{this.product=data}
   )
    
}
addToCart(item: any) {
   // <-- replace with real logged-in user id (from localstorage / JWT)
    const cuisineId = item.id;  // <-- or item.cuisine_id depending on field name

    this.cs.addToCart(this.userId, cuisineId, 1).subscribe({
      next: () => {
        alert('Item added to cart');
      },
      error: () => {
        alert('Failed to add item');
      }
    });
  }
  navigate(){
   this.location.back()
  }
  
}
