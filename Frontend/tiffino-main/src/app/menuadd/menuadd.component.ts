import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CuisinesService } from '../sharingdata/services/cusines.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {  Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Location } from '@angular/common';
@Component({
  selector: 'app-menuadd',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './menuadd.component.html',
  styleUrl: './menuadd.component.css'
})
export class MenuaddComponent {
  isBrowser:boolean;
  step=1;
 cuisineForm!: FormGroup;
   showEditPopup=false;
  submitting = false;
  successMessage = '';
  errorMessage = '';
  selectedImageFile: File | null = null;

  MealType = ['BREAKFAST', 'LUNCH', 'DINNER'];
  SpiceLevel = ['MILD', 'MEDIUM','HOT','EXTRA_HOT'];
   AvailableDay= ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  AllergenPreference = ['DAIRY_FREE', 'NUT_FREE', 'GLUTEN_FREE']; 
  DietaryPreference = ['VEGAN', 'VEGETARIAN', 'KETO', 'HIGH_PROTEIN','LOW_CARB']; 
  previewUrl: string | ArrayBuffer | null = null;
tooltips = {
  protein: 'Optional: Enter protein content (e.g., 20g)',
  carbs: 'Optional: Enter carbohydrate content',
  fats: 'Optional: Enter fat content',
  fiber: 'Optional: Enter fiber content',
  preparation_time: 'Enter estimated preparation time'

};
statesi: any[] = [];

  constructor(private location:Location,private fb: FormBuilder, private cs: CuisinesService, private router: Router,@Inject(PLATFORM_ID) private platformId: Object) {
    this.initForm();this.isBrowser = isPlatformBrowser(this.platformId);
     this.loadStates();
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
       const raw = localStorage.getItem('adminUser');
       if (raw) {
         const parsed = JSON.parse(raw);
         this.userId = parsed?.id || parsed?.user?.id; // <-- adjust according to your user object    } else {
         // fallback so it's never undefined    }
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
    this.router.navigate(['/cusineinfo', id]);
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
deletecusine(id: number) {
  if (confirm('Are you sure you want to delete this cuisine?')) {
    this.cs.deletecusinebyid(id).subscribe(
      (response) => {
        // After successful deletion, remove the item from the UI
        this.cusines = this.cusines.filter(cuisine => cuisine.id !== id);
        alert('Cuisine deleted successfully!');
      },
      (error) => {
        alert('Error deleting cuisine. Please try again.');
      }
    );
  }
}





loadStates() {
  this.cs.getAllStates().subscribe({
    next: (data) => {
      this.statesi = data;
    },
    error: () => {
      console.error('Failed to load states');
    }
  });
}
  initForm() {
    this.cuisineForm = this.fb.group({
      name: ['', Validators.required],
      imageUrl: [''],
      stateId: [null, Validators.required],
      meal_type: ['', Validators.required],
      price_per_meal: [0, [Validators.required, Validators.min(1)]],
      price_per_week: [0, Validators.required],
      price_per_month: [0, Validators.required],
      currency: ['INR', Validators.required],
      is_offer_active: [false],
      is_available: [true],
      available_days: [[], Validators.required],
      calories: [0, Validators.required],
      protein: [''],
      carbs: [''],
      fats: [''],
      fiber: [''],
      allergen_preferences: [null],
      dietary_preferences: [null],
      preparation_time: [''],
      spice_level: ['', Validators.required]
    });
  }

 /* onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedImageFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
      this.cuisineForm.patchValue({ imageUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  }
}*/
  goToStep(step: number) {
    this.step = step;
  } 
  onSubmit() {
    if (this.cuisineForm.invalid) return;
    this.submitting = true;

    const formData = this.cuisineForm.value;

    this.cs.addCuisine(formData).subscribe({
      next: () => {
        this.successMessage = 'Cuisine added successfully!';
        this.cuisineForm.reset();
        this.submitting = false;
          this.showEditPopup = false; 
      },
      error: () => {
        this.errorMessage = 'Failed to add cuisine.';
        this.submitting = false;
      }
    });
  }
 
  openEditPopup(): void {
    this.showEditPopup = true;
    }

    closeEditPopup(): void {
    this.showEditPopup = false;
  }
  
 
}
