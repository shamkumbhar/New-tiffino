import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsComponent } from './settings/settings.component';
import { CuisinesService } from './sharingdata/services/cusines.service';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink,ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
 cartLength = this.cs.cartLength;
constructor(private cs:CuisinesService,private route :ActivatedRoute,private location:Location) {}
searchTerm: string = '';
 
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
 
  onSearchChange() {
    this.cs.setSearchTerm(this.searchTerm.trim().toLowerCase());
  }
  title = 'Tiffino';
   isSidebarOpen = false;
   toggleclose = false;
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
   toggleclosin() {
    this.toggleclose = !this.toggleclose;
    this.isSidebarOpen = false;
  }
  closeSidebar() {
  this.isSidebarOpen = false;
}
}
 
 