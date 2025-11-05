import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SubscriptionPayload } from '../models/subscription';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environments';
@Injectable({ providedIn: 'root' })
export class SubscriptionService {
private apiurl='http://localhost:8960'
  constructor(private http: HttpClient) {}

getActivePlans(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiurl}/subscription-plans/getall`);
  }
 
searchplan(query: string): Observable<any[]> {
    const url = `${this.apiurl}/subscription-plans/search-plan?name=${query}`;
    return this.http.get<any[]>(url);
  }
Bystatus(isActive: boolean, isInactive: boolean): Observable<any[]> {
  const url = `${this.apiurl}/subscription-plans/filter-by-plan-status?active=${isActive}`;
  return this.http.get<any[]>(url);
}

getbymealtype(mealTypes: string[]): Observable<any[]> {
  let url = `${this.apiurl}/subscription-plans/filter-by-meal-type?mealType=`;
  
  if (mealTypes.length > 0) {
    url += mealTypes.join(',');  // Join the selected meal types into a comma-separated string
  }

  return this.http.get<any[]>(url);
}
  
getusersplan(userId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiurl}/subscriptions/user/${userId}`);
}

 pause(subscriptionId: number, token: string): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.put(`${this.apiurl}/${subscriptionId}/subscriptions/pause`, {}, { headers });
}

 resume(subscriptionId: number): Observable<any> {
  

  return this.http.put(`${this.apiurl}/${subscriptionId}/subscriptions/resume`, {});
}
  cancel(subscriptionId: number,token: string) {
    const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
    return this.http.put(`${this.apiurl}/${subscriptionId}/subscriptions/cancel`, {},{ headers });
  }

  getSubscriptionsByUser(userId: number,token: string) {
    return this.http.get(`${this.apiurl}/subscriptions/user/${userId}`,{});
  }


  createsubscriptions(payload:any){
    return this.http.post(`${this.apiurl}/subscription-plans/create`,payload);
  }
  deactivatesubscription(planId:any){
    return this.http.put(`${this.apiurl}/subscription-plans/deactivate/${planId}`,{}).subscribe({
      next:(data)=>{alert('subscription deactivated')},
      error:(err)=>{alert('subscription deactivation failed')}
    });
  }
  deleteplan(planId:any){
     return this.http.delete(`${this.apiurl}/subscription-plans/delete/${planId}`,{})
  }

  
}