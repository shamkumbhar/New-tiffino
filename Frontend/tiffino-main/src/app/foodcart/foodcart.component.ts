import { Component, OnDestroy, OnInit } from '@angular/core';
import { CuisinesService } from '../sharingdata/services/cusines.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject,debounceTime } from 'rxjs';
import {  Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Notificationserivce } from '../cashback.service';
@Component({
  selector: 'app-foodcart',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './foodcart.component.html',
  styleUrl: './foodcart.component.css'
})
export class FoodcartComponent implements OnInit,OnDestroy {
  isBrowser: boolean;
  showPopup=false
  userId!: number; 
  cuisines: any[] = [];
  filteredCuisines: any[] = [];
  searchText: string = '';
  private searchSubject = new Subject<string>();
  constructor(private cusineservice:CuisinesService,private route:Router,@Inject(PLATFORM_ID) private platformId: Object){
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  ngOnInit(): void {
     if (this.isBrowser) {
       const raw = localStorage.getItem('user');
       if (raw) {
         const parsed = JSON.parse(raw);
         this.userId = parsed?.id || parsed?.user?.id;
     
     }
      this.delivery()
       this.searchSubject.pipe(
      debounceTime(300) 
    ).subscribe(searchTerm => {
      this.applyFilter(searchTerm);
    });
  }
  }
   ngOnDestroy(): void {
    this.searchSubject.unsubscribe();
  }
delivery() {
this.cusineservice.allcusines().subscribe({
    next: (res: any[]) => {
      // Slice first 10 items from the full array
      this.cuisines = res.slice(10,177);
      this.filteredCuisines = [...this.cuisines];

      console.log(this.cuisines); // Optional: Check in console
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
   // <-- replace with real logged-in user id (from localstorage / JWT)
    const cuisineId = item.id;  // <-- or item.cuisine_id depending on field name

    this.cusineservice.addToCart(this.userId, cuisineId, 1).subscribe({
      next: (item) => {
        alert('Item added to cart');
        console.log(item)
         this.showPopup = true;
         this.cusineservice.updateCartLengthFromServer(this.userId);
      },
      error: () => {
        alert('Failed to add item');
      }
    });
  }

   onSearchChange(search: string) {
    this.searchSubject.next(search);
  }

  applyFilter(search: string) {
  const query = search.toLowerCase().trim();

  if (!query) {
    this.filteredCuisines = [...this.cuisines];
    return;
  }

  this.filteredCuisines = this.cuisines.filter(item => {
    const name = item.name?.toLowerCase() || '';
    const price = item.price_per_meal?.toString() || '';
    const mealType = item.meal_type?.toLowerCase() || '';

    return (
      name.includes(query) ||
      price.includes(query) ||
      mealType.includes(query)
    );
  });
}
}
