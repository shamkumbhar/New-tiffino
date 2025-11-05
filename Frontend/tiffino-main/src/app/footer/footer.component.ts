import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CuisinesService } from '../sharingdata/services/cusines.service';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink,CommonModule,FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
firstColumn: any[] = [];
secondColumn: any[] = [];
thirdColumn: any[] = [];
 states: any[] = [];
constructor(private cs:CuisinesService){}
ngOnInit(): void {
  this.cs.getAllStates().subscribe({
    next: (data:any) => {
      this.states = data;
      const third = Math.ceil(this.states.length / 3);
      this.firstColumn = this.states.slice(0, third);
      this.secondColumn = this.states.slice(third,third*2);
      this.thirdColumn=this.states.slice(third*2)
    },
    error: (err:any) => {
      console.error('Failed to load states:', err);
    }
  });
}
}
