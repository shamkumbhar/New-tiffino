import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({ providedIn: 'root' })
export class VoucherService {
 
private apiurl=environment.apiBaseUrl
  constructor(private http: HttpClient) {}

  

  getVoucherByCodes(code: string): Observable<any> {
    return this.http.get<any>(`${this.apiurl}/vouchers/byCode/${code}`);
  }
  getallvouchers(){
    return this.http.get<any>(`${this.apiurl}/vouchers/getall`);
  }
}

