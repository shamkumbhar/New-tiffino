import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class OtpService {
 
private apiurl='http://localhost:8910'
  constructor(private http: HttpClient) {}

  placeOrder(order:any ){
    return this.http.post(`${this.apiurl}/orders/create`, order);
  }
getorderbyid(orderId:any){
  return this.http.get(`${this.apiurl}/orders/${orderId}`)
}

  private orderId: number | null = null;

  setOrderId(id: number) {
    this.orderId = id;
  }

  getOrderId(): number | null {
    return this.orderId;
  }

  clear() {
    this.orderId = null;
  }
  private patnerId!: any ;

  setpartnerId(id: any) {
    this.patnerId = id;
  }

  getpartnerId() {
    return this.patnerId;
  }

  clearp() {
    this.patnerId = null;
  }
}