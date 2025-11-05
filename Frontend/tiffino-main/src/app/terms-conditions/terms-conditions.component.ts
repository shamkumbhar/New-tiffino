import { Component,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router'; // Import the Router for navigation
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';  // Import ActivatedRoute to get the fragment
import { Location } from '@angular/common'; 
@Component({
  selector: 'app-terms-and-conditions',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,CommonModule],
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.css'],
})
export class TermsAndConditionsComponent implements AfterViewInit {
constructor(private route: ActivatedRoute, private location: Location) {}
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

 
}