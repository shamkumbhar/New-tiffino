import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-oauth2-success-component',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './oauth2-success-component.component.html',
  styleUrl: './oauth2-success-component.component.css'
})
export class Oauth2SuccessComponentComponent {
constructor(private route: ActivatedRoute, private router: Router) {}
isloading=false


  ngOnInit() {
    setTimeout(() => {
  this.isloading=true
},2000);
    
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        localStorage.setItem('jwt', token);
        this.router.navigate(['/']); // go to home after login      }
   } });
  }
}
