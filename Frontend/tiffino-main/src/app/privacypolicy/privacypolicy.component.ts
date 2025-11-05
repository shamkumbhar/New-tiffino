import { CommonModule } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
 // Import ActivatedRoute to get the fragment
import { Location } from '@angular/common'; 
@Component({
  selector: 'app-privacypolicy',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './privacypolicy.component.html',
  styleUrl: './privacypolicy.component.css'
})
export class PrivacypolicyComponent implements AfterViewInit {
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
