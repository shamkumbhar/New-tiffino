
import { Injectable, signal } from '@angular/core';
import {BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AnyARecord } from 'node:dns';
import { environment } from '../environments/environments';

export interface DeliveryPartner {
  id: number;
  name: string;
  phoneNumber: string;
  vehicleDetails: string;
  status: string;
  currentLatitude: number;
  currentLongitude: number;
}

export interface Delivery {
  id: number;
  orderId: number;
  deliveryPartner: DeliveryPartner;
  pickupTime: string;
  status: string;
  currentLatitude: number;
  currentLongitude: number;
}
@Injectable({
  providedIn: 'root'
})
export class Notificationserivce {
private apiurl='http://localhost:8970'
constructor(private http:HttpClient){

}


getallpartners(){
  return this.http.get(`${this.apiurl}/delivery-partners/getall`);
}
getPartnerById(id:any){
  return this.http.get<DeliveryPartner>(`${this.apiurl}/delivery-partners/${id}`)
}
postdeliverypartner(payloads:any){
  return this.http.post(`${this.apiurl}/delivery-partners/createDeliveryPartner`,payloads)
}

assigndelivery(orderId: any) {
  return this.http.post<Delivery>(`${this.apiurl}/delivery/assign`, {
    orderId: orderId
  });
}
getorderbyid(orderid:any){
  return this.http.get(`${this.apiurl}/delivery/order/${orderid}`)
}
}