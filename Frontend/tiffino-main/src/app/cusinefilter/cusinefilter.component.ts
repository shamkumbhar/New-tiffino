import { Component, OnInit } from '@angular/core';
import { CuisinesService } from '../sharingdata/services/cusines.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {  Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './cusinefilter.component.html',
  styleUrl: './cusinefilter.component.css'
})
export class CusinefilterComponent implements OnInit {
 isBrowser: boolean;
  constructor(private cs: CuisinesService, private route: Router,@Inject(PLATFORM_ID) private platformId: Object) {
       this.isBrowser = isPlatformBrowser(this.platformId);
  }

  regions: any[] = [];
  states: any[] = [];
  cusines: any[] = [];
  allCuisines: any[] = [];

  selectedRegionId: number | null = null;
  selectedStateId: number | null = null;

  showPopup = false;
  isFilterOpen = false;
  searchTerm: string = '';
  userId: any;

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
      }}
    this.getRegions();

    // load all cuisines (default view)
    this.cs.getAllRegions().subscribe((regionsData: any) => {
      this.regions = regionsData;

      this.cs.getAllStates().subscribe((statesData: any) => {
        this.states = statesData;
        console.log(statesData)
        this.loadCuisines();
      });
    });
  }
loadCuisines() {
    this.cs.allcusines().subscribe((data: any) => {
      // map stateName and regionName
      this.allCuisines = data.map((c: any) => {
        const state = this.states.find(s => s.id === c.stateId);
        const region = state ? this.regions.find(r => r.id === state.regionId) : null;
        return {
          ...c,
          stateName: state?.name || 'N/A',
          regionName: region?.name || 'N/A'
        };
      });
      this.cusines = this.allCuisines;
    });
  }
  getRegions() {
    this.cs.getAllRegions().subscribe((data: any) => {
      this.regions = data;
    });
  }

 onRegionChange() {
  this.states = [];
  this.selectedStateId = null;

  if (this.selectedRegionId) {
    this.cs.getStatesByRegion(this.selectedRegionId).subscribe((data: any) => {
      this.states = data;

      // also filter cuisines by region and add regionName/stateName
      const filtered = this.allCuisines.filter(c => c.regionId === this.selectedRegionId);
      this.cusines = filtered.map((c: any) => {
        const state = this.states.find(s => s.id === c.stateId);
        const region = this.regions.find(r => r.id === c.regionId);
        return {
          ...c,
          stateName: state?.name || 'N/A',
          regionName: region?.name || 'N/A'
        };
      });
    });
  }
}

  onStateChange() {
  if (this.selectedStateId) {
    this.cs.getCuisinesByState(this.selectedStateId).subscribe((data: any) => {
      console.log(data);
      this.cusines = data.map((c: any) => {
        const state = this.states.find(s => s.id === c.stateId);
        const region = this.regions.find(r => r.id === state?.regionId);
        return {
          ...c,
          stateName: state?.name || 'N/A',
          regionName: region?.name || 'N/A'
        };
      });
    });
  }
}

  applySearch() {
    const term = this.searchTerm.toLowerCase();
    this.cusines = this.allCuisines.filter(x =>
      x.name.toLowerCase().includes(term)||
      x.stateName.toLowerCase().includes(term)||
      x.meal_type.toLowerCase().includes(term)||
      x.regionName.toLowerCase().includes(term)||
      x.regionName.toLowerCase().includes(term)
    );
  }

  

 

  clearFilter() {
    this.selectedRegionId = null;
    this.selectedStateId = null;
    this.cusines = this.allCuisines;
  }

  navigate(id: number) {
    this.route.navigate(['/cusineinfo', id]);
  }

  addToCart(item: any) {
    const cuisineId = item.id;

    this.cs.addToCart(this.userId, cuisineId, 1).subscribe({
      next: () => {
        this.showPopup = true;
        this.cs.updateCartLengthFromServer(this.userId);
      },
      error: () => {
        alert('Failed to add item');
      }
    });
  }
}
