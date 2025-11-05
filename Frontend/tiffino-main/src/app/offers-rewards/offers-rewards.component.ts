
import { Component, OnInit } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CashbackService } from '../sharingdata/services/cashback.service';
import { RouterLink } from '@angular/router';
import { VoucherService } from '../sharingdata/services/voucher.service';
import { environment } from '../../environments/environments.prod';
@Component({
  selector: 'app-offers-rewards',
  standalone:true,
  imports:[ReactiveFormsModule,FormsModule,CommonModule,RouterLink],
  templateUrl: './offers-rewards.component.html',
  styleUrls: ['./offers-rewards.component.css']
})
export class OffersRewardsComponent implements OnInit {
  userId = 3;
  userdata:any={};
rewards: any[] = [];
vouchers: any[] = [];
cashbackpoints:any;
  constructor(private cashback: CashbackService,private http:HttpClient,private voucher:VoucherService) {}

  ngOnInit(): void {
    this.getpoints()
    this.fetchpoints()
    this.loadVouchers();
    this.getallvouchers();
  }
userid:any;
token:any;


loadVouchers(): void {
  const raw = localStorage.getItem('user');

  if (raw) {
    const parsed = JSON.parse(raw);
    this.userid = parsed?.user?.id;
    this.token = parsed?.token;
  }
    //this.voucher. getVoucherByCodes(code).subscribe({
      //next: (data:any) => {console.log(data);this.vouchers = data},
      //error: (e:any) => console.error('Error loading vouchers', e)
   // });
 }
 getallvouchers(){
  this.voucher.getallvouchers().subscribe({
   next:(data:any)=>{
    this.vouchers=data;
    console.log(data);
   },
   error:(err)=>{console.log(err)}
  })
 }
private apiurl=environment.apiBaseUrl

getpoints(): void {
  const raw = localStorage.getItem('user');

  if (raw) {
    const parsed = JSON.parse(raw);
    this.userid = parsed?.user?.id;
    this.token = parsed?.token;

    if (this.userid && this.token) {
      const headers = {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };

      this.http.get(`
      ${this.apiurl}/loyalty/${this.userid}` ).subscribe({
        next: (response: any) => {
          this.userdata=response;
          console.log("Giftcard Points:", response);
         // if you want to use it in UI
        },
        error: (err: any) => {
          console.error("Error fetching giftcard points:", err);
        }
      });
    } 
  } 
}


    fetchpoints(){
      const raw = localStorage.getItem('user');
      if(raw){
      const parsed = JSON.parse(raw);
    this.userid = parsed?.user?.id;
    this.token = parsed?.token;
      }
    this.cashback.getRewardsByUserId(this.userid).subscribe({
      next: (data:any) => {
        this.rewards = data;
        this.cashbackpoints=data.pointschange;
      },
      error: (err:any) => {
        console.error('Error fetching rewards:', err);
      }
    }); 
}
shareReferral() {
  const raw = localStorage.getItem('user');
      if(raw){
      const parsed = JSON.parse(raw);
    this.userid = parsed?.user?.id;
    this.token = parsed?.token;
      }
  const shareData = {
    title: 'Join me on AwesomePay!',
    text: 'Earn cashback on every payment. Use my referral link to sign up!',
    url: 'https://yourapp.com/referral?code=ABCD1234'
  };

  if (navigator.share) {
    navigator.share(shareData)
      .then(() => console.log('Referral shared successfully'))
      .catch((error) => console.error('Sharing failed:', error));

      this.http.post(`${this.apiurl}/reward/referral/${this.userid}`,{})
  } else {
    alert('Sharing is not supported on this browser. Please copy the link manually.');
  }
}




}