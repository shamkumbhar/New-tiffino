import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SubscriptionService } from '../sharingdata/services/subscription.service';
import { Notificationserivce } from '../cashback.service';


@Component({
  selector: 'app-delivery-partner',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule]
})
export class DeliveryPartnerComponent implements OnInit {
  data: any[] = [];
  showForm = false;
  partnerForm:FormGroup;
  planid:any;
 datas: any[] = [];
  filteredPartners: any[] = [];
  searchQuery = '';
  orders:any[]=[];
  constructor(private fb:FormBuilder,private http:HttpClient,private route:Router,private subs:SubscriptionService,private partner:Notificationserivce) {
    this.partnerForm = this.fb.group({
      name: ['',[Validators.required,Validators.pattern(/^[A-Za-z ]+$/),Validators.maxLength(30)]],
      phoneNumber: ['',[Validators.required, Validators.pattern(/^[0-9]{10}$/),Validators.maxLength(20)]],
      vehicleDetails: ['',Validators.maxLength(30)],
      status: ['AVAILABLE'],
      currentLatitude: [null],
      currentLongitude: [null],
    });
   
  }

  ngOnInit(): void {
    this.getAllPartners();
    
  }
    gotoplans(){
      this.route.navigate(['/subplan'])
    }
    navigate(){
      this.route.navigate(['/menuadd'])
    }
  getAllPartners() {
    this.partner.getallpartners().subscribe(
      (res:any) => {
        console.log(res)
        this.data = res;
         this.filteredPartners = res
      },
       (err) => {
        console.error('Error fetching delivery partners:', err);
      }
    );
  }
    
  
   get f() {
    return this.partnerForm.controls;
  }
  postdeliverypartners(){
    const payload=this.partnerForm.value
 this.partner.postdeliverypartner(payload).subscribe({
      next: (res) => {
        alert('Partner added successfully!');
        this.partnerForm.reset({ status: 'AVAILABLE' });
        this.showForm = false;
      },
      error: (err) => {
        console.error(err);
        alert('Error adding partner.');
      }
    });
}

Back(){
  this.showForm=!this.showForm
}


  filterPartners() {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredPartners = this.data.filter(partner =>
      partner.name.toLowerCase().includes(query) ||
      partner.vehicleDetails.toLowerCase().includes(query)
    );
  }


}