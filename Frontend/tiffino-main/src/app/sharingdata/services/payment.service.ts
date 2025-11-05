import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
environment
HttpClient
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
private apiurl='http://localhost:8930'
  constructor(private http:HttpClient) { }

  initiate(Data:any){
    return this.http.post(`${this.apiurl}/payments/initiate`,Data);
  }
  confirm(paymentid:any){
    return this.http.put(`${this.apiurl}/payments/confirm/order/${paymentid}`,{})
  }
  cancelpay(paymentid:any){
    return this.http.put(`${this.apiurl}/payments/cancel/order/${paymentid}`,{})
  }

  getbyuser(userId:any){
      return this.http.get(`${this.apiurl}/payments/byUser/${userId}`)
  }

  retry(id:string){
    return this.http.post(`${this.apiurl}/payments/retry/${id}`,{})
  }
}
