import { Component } from '@angular/core';
import { SubscriptionService } from '../../sharingdata/services/subscription.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.css'
})
export class SubscriptionsComponent {
  planForm!: FormGroup;
planid:any;
  constructor(private fb: FormBuilder, private http: HttpClient,private subsc:SubscriptionService) {}

  ngOnInit(): void {
    this.planForm = this.fb.group({
      name: ['',[Validators.required,Validators.pattern(/^[A-Za-z]+$/),Validators.maxLength(30)] ],
      description: [''],
      mealType: ['', Validators.required],
      mealFrequency: ['', Validators.required],
      durationInWeeks: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      isActive: [true]
    });
    this.getactiveplan();
  }
    get f(){
      return this.planForm.controls
    }
  onSubmit(): void {
    if (this.planForm.valid) {
      const payload = this.planForm.value;
      console.log('Payload:', payload);

    this.subsc.createsubscriptions(payload).subscribe({
        next: (res) => alert('Subscription plan created successfully!'),
        error: (err) => console.error('Error:', err)
      });
    }
  }
  
plans: any[] = [];

getactiveplan() {
  this.subsc.getActivePlans().subscribe({
    next: (data) => {
      console.log(data);
      this.plans = data; // Store all plans
    },
    error: (err) => {
      console.log(err);
    }
  });
}

deactivate(planId: number) {
  this.subsc.deactivatesubscription(planId)
    
  
}

deletePlan(planId: number) {
  this.subsc.deleteplan(planId).subscribe({
    next: () => {
      alert('Plan deleted successfully');
      this.getactiveplan(); // Refresh the list after deletion
    },
    error: () => alert('Failed to delete plan')
  });
}
}
