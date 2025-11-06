import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
 
@Injectable({
  providedIn: 'root'
})
export class CuisinesService {
 
  private apiurl = `${environment.apiBaseUrl}`;
 
  constructor(private http: HttpClient) { }
 
  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();
 
  setSearchTerm(term: string) {
    this.searchTermSubject.next(term);
  }
 
  private readonly _cartLength = signal(0);
  readonly cartLength = this._cartLength.asReadonly();
 
  setCartLength(length: number) {
    this._cartLength.set(length);
  }
 
  // ✅ Fixed URLs below
  allcusines(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiurl}/cuisines/getall`);
  }
 
  cusinesbyid(id: any) {
    return this.http.get<any[]>(`${this.apiurl}/cuisines/${id}`);
  }
 
  addCuisine(cuisine: any) {
    return this.http.post(`${this.apiurl}/cuisines/createCuisine`, cuisine);
  }
 
  deletecusinebyid(id: number) {
    return this.http.delete(`${this.apiurl}/cuisines/${id}`);
  }
 
  getAllRegions() {
    return this.http.get<any[]>(`${this.apiurl}/regions/getall`);
  }
 
  getStatesByRegion(regionId: number) {
    return this.http.get<any[]>(`${this.apiurl}/states/region/${regionId}`);
  }
 
  getCuisinesByState(stateId: number) {
    return this.http.get<any[]>(`${this.apiurl}/cuisines/state/${stateId}`);
  }
 
  getAllStates() {
    return this.http.get<any[]>(`${this.apiurl}/states/getall`);
  }
 
  getallcities() {
    return this.http.get(`${this.apiurl}/cities/getall`);
  }
 
  getcitybystateid(stateId: string) {
    return this.http.get(`${this.apiurl}/cities/state/${stateId}`);
  }
 
  addToCart(userId: number, cuisineId: number, quantity: number = 1) {
    return this.http.post(`${this.apiurl}/cart/add`, {
      userId: userId,
      cuisine_id: cuisineId,
      quantity: quantity,
    });
  }
 
  updateCartLengthFromServer(userId: number) {
    this.getCart(userId).subscribe((cart: any) => {
      this.setCartLength(cart.length);
    });
  }
 
  getCart(userId: number) {
    return this.http.get(`${this.apiurl}/cart/${userId}`);
  }
 
  updateItem(itemId: number, quantity: number) {
    return this.http.put(`${this.apiurl}/cart/update/${itemId}?quantity=${quantity}`, {});
  }
 
  removeItem(itemId: number) {
    return this.http.delete(`${this.apiurl}/cart/remove/${itemId}`);
  }
 
  clearCart(cartItems: any[]) {
    return Promise.all(
      cartItems.map((item: any) => this.removeItem(item.itemId).toPromise())
    ).then(() => {
      this.setCartLength(0);
    });
  }
}
