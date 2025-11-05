import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../sharingdata/services/subscription.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-membership-plan',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './membership-plan.component.html',
  styleUrl: './membership-plan.component.css'
})
export class MembershipPlanComponent implements OnInit {  
  plans:any;
constructor(
  private subs:SubscriptionService,private route:Router)
  {}

ngOnInit(): void {
    this.getAllplans()
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
  subsc(){
    this.route.navigate(['/subscriptions'])
  }
}
