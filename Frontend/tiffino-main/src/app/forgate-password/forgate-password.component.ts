import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CuisinesService } from '../sharingdata/services/cusines.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {  Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-forgate-password',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './forgate-password.component.html',
  styleUrl: './forgate-password.component.css'
})
export class  ForgatePasswordComponent implements OnInit{
   userId!: number; 
 cuisines: any[] = [];
  states: any[] = [];
  regions: any[] = [];
  stateId!: number;
  constructor(
    private route: ActivatedRoute,
    private cs: CuisinesService
  ,@Inject(PLATFORM_ID) private platformId: Object ) {
    
  }

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
        const raw = localStorage.getItem('user');
        if (raw) {
          const parsed = JSON.parse(raw);
          this.userId = parsed?.id || parsed?.user?.id; // <-- adjust according to your user object    } else {
          // fallback so it's never undefined    }
      }
    }
    
    this.stateId = +this.route.snapshot.paramMap.get('id')!;
    
    // Load regions and states first
    this.cs.getAllRegions().subscribe((regionData: any[]) => {
      this.regions = regionData;

      this.cs.getAllStates().subscribe((stateData: any[]) => {
        this.states = stateData;

        // Now fetch cuisines
        this.loadCuisinesByState(this.stateId);
      });
    });
  }

  loadCuisinesByState(stateId: number) {
    this.cs.getCuisinesByState(stateId).subscribe((data: any[]) => {
      console.log(data);
      this.cuisines = data.map(c => {
        const state = this.states.find(s => s.id === c.stateId);
        const region = state ? this.regions.find(r => r.id === state.regionId) : null;

        return {
          ...c,
          stateName: state?.name || 'Unknown',
          regionName: region?.name || 'Unknown'
        };
      });
    });
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
  }

