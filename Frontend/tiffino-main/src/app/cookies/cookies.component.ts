import { CommonModule, Location } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cookies',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './cookies.component.html',
  styleUrl: './cookies.component.css'
})
export class CookiesComponent implements AfterViewInit {
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
