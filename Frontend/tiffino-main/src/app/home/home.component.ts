import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterEvent, RouterLink, RouterLinkActive} from '@angular/router';

import { FooterComponent } from '../footer/footer.component';
import { CuisinesService } from '../sharingdata/services/cusines.service';
import {  Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Notificationserivce } from '../cashback.service';
import { Location } from '@angular/common';
interface FoodItem {
  foodItemName: string;
  foodItemPrice: number;
  foodLocation: string;
  foodCategory: string;
  foodstate:string;
  foodImage: string;
  quantity:number; 
}



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FooterComponent,CommonModule,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit{

   isBrowser: boolean;
  private route=inject(Router)
  constructor(private notify:Notificationserivce,private cusineservice:CuisinesService,@Inject(PLATFORM_ID) private platformId: Object,private routes:ActivatedRoute){
    this.isBrowser = isPlatformBrowser(this.platformId);
  }


   ngAfterViewInit(): void {
    // After the view initializes, check if there is a fragment to scroll to
    this.routes.fragment.subscribe(fragment => {
      if (fragment) {
        // Scroll to the element with the corresponding fragment (e.g., terms-section)
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }
 userId!: number; 
 filteredCuisines: any[] = [];
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
        this.delivery();
  this.cusineservice.searchTerm$.subscribe((term) => {
    this.applyFilter(term);
  });
    }
 
  
}
cuisines: any[] = [];
showPopup = false;
delivery() {
this.cusineservice.allcusines().subscribe({
    next: (res: any[]) => {
      // Slice first 10 items from the full array
      this.cuisines = res
      this.filteredCuisines = res.slice(0, 8);

     // Optional: Check in console
    },
    error: (err: any) => {
      console.error('Error fetching data:', err);
    }
  });
}
navigate(id:number){
    this.route.navigate(['/cusineinfo',id])
  }
  addToCart(item: any) {
    const cuisineId = item.id; 
    this.cusineservice.addToCart(this.userId, cuisineId, 1).subscribe({
      next: (item) => {  
         this.showPopup = true;
         this.cusineservice.updateCartLengthFromServer(this.userId);
      },
      error: () => {
        alert('Failed to add item');
      }
    });
  }
   applyFilter(term: string) {
    if (!term) {
      this.filteredCuisines = this.cuisines.slice(0, 9); // show 9 initially
    } else {
      const filtered = this.cuisines.filter((item) =>
        item.name?.toLowerCase().includes(term)
      );
      this.filteredCuisines = filtered;
    }
  }
}



