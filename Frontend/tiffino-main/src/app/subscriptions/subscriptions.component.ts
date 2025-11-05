import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SubscriptionService } from '../sharingdata/services/subscription.service';
import { environment } from '../../environments/environments';
import {  Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Location } from '@angular/common'; 
@Component({
  selector: 'app-subscription-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionComponent implements OnInit,AfterViewInit {
  form: FormGroup;
  plans: any[] = [];
 isBrowser:boolean;
  selectedPlanId: number | null = null;
  userId: number = 0;
  token: string = '';
   isLoading = false;
   showpopup = false;
  showErrorPopup = false;
   userData: any = '';
  errorMessage = '';
  subscriptionid:any;
  subscriptions:any[]=[]; 
  showActiveCard: boolean = false;
  activeSubscription:any=[];
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);
  subs = inject(SubscriptionService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.form = this.fb.group({
      MealType:[null,Validators.required],
      BillingCycle:[null,Validators.required],
      SpiceLevel: [null,Validators.required],
      SubscriptionStatus:[null,Validators.required],
      /*portionSize: [''],*/
      autoRenew: [false],
      dietaryRestrictions: [null,Validators.required],
      /*additionalRequests: [''],
      totalInstallments: [null]*/
    });
  }
  plansi: any[] = [];
searchQuery: string = ''; // To bind the search input
debounceTimeout: any;


 isActive: boolean = false;
  isInactive: boolean = false;
  isBreakfast: boolean = false;
  isLunch: boolean = false;
  isDinner: boolean = false;

   filteropen=false;
  
 ngAfterViewInit(): void {
    // After the view initializes, check if there is a fragment to scroll to
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        // Scroll to the element with the corresponding fragment (e.g., terms-section)
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  ngOnInit(): void {
    this.fetchPlans();
    
  this.getAllplans();
if (this.isBrowser) {
      const raw = localStorage.getItem('user');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          
           this.userId = parsed.user?.id;
      this.token = parsed.token;
          // Optionally, trigger some logic with the userId
        } catch (error) {
          console.error('Error parsing localStorage user:', error);
        }
  
      }}
     this.subs.getusersplan(this.userId).subscribe({
      next :(data:any[])=>{
        console.log('data is',data);
       this.subscriptions = data;
      this.activeSubscription = data[0]; // Keep for other UI if needed
      this.subscriptionid = data[0].id;
      },
      error:(err)=>{
        console.log(err);
      }
     })
  }

search() {
    clearTimeout(this.debounceTimeout); // Clear previous debounce
    this.debounceTimeout = setTimeout(() => {
      this.fetchPlans(); // Fetch data after the debounce delay
    }, 500); // Debounce delay in ms
  }


 fetchPlans() {
  this.subs.searchplan(this.searchQuery.toLowerCase()).subscribe({
    next: (plans: any[]) => {
      console.log('Fetched plans:', plans);
      // Convert plan names to lowercase to compare them properly
      this.plansi = plans.filter(plan => 
        plan.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    error: (err) => {
      console.error('Error fetching plans:', err);
    }
  });
}


 applyFilters() {
    // Status filter
    this.subs.Bystatus(this.isActive, this.isInactive).subscribe({
      next: (plans: any[]) => {
        this.plansi = plans;
      },
      error: (err) => {
        console.error('Error fetching plans by status:', err);
      }
    });

    // Meal Type filter
    let selectedMealTypes = [];
    if (this.isBreakfast) selectedMealTypes.push('Breakfast');
    if (this.isLunch) selectedMealTypes.push('Lunch');
    if (this.isDinner) selectedMealTypes.push('Dinner');

    if (selectedMealTypes.length > 0) {
      this.subs.getbymealtype(selectedMealTypes).subscribe({
        next: (plans: any[]) => {
          this.plansi = plans;
        },
        error: (err) => {
          console.error('Error fetching plans by meal type:', err);
        }
      });
    }
  }

  clearFilters() {
    this.isActive = false;
    this.isInactive = false;
    this.isBreakfast = false;
    this.isLunch = false;
    this.isDinner = false;
    this.fetchPlans();  // Clear filters and reload all plans
  }
  
  
  


  getAllplans(){
this.subs.getActivePlans().subscribe({
      next: (plans: any[]) => {
        this.plans = plans;
        console.log(plans);
      },
      error: (err) => console.error('Error fetching plans:', err)
    });
  } 
 


     
private apiurl='http://localhost:8960'
  onSubmit(): void {
    this.errorMessage = '';
    this.showErrorPopup = false;
    if (this.form.invalid || !this.selectedPlanId) {
      alert('Please fill all fields and select a plan');
      this.form.markAllAsTouched();
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
   
    const url = `${this.apiurl}/subscriptions/${this.userId}/subscribe/${this.selectedPlanId}`;
    this.http.post(url, this.form.value, { headers })
    .subscribe({
      next: (res) => {
        console.log(res);
       // this.router.navigate(['/payment'])
        this.userData=res;
      
        this.isLoading = false;
        this.showpopup = true;
        alert('Subscription created successfully!');
        
        setTimeout(() => {
          this.showpopup = false;
          this.form.reset();
         
        }, 3000);
        this.selectedPlanId = null;
      },
      error: (err) => {
        console.error('Subscription failed:', err);
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'subscription Failed ';
        this.showErrorPopup = true;
        alert('Failed to create subscription.');
      }
    });
  }

pausesubscription(sub: any) {
  this.subs.pause(sub.id, this.token).subscribe({
    next: () => alert('Subscription paused successfully'),
    error: () => alert('Pause failed')
  });
}
 resumesubscription(sub: any) {
  this.subs.resume(sub.id).subscribe({
    next: () => alert('Subscription resumed successfully'),
    error: () => alert('Resume failed')
  });
}
cancelsubscription(sub: any) {
  this.subs.cancel(sub.id, this.token).subscribe({
    next: () => alert('Subscription cancelled successfully'),
    error: () => alert('Cancel failed')
  });
}
  get f(){
    return this.form.controls
  }

}