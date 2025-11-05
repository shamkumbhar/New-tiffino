import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
@Injectable({ providedIn: 'root' })
export class CashbackService {
  private apiurl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getRewardsByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiurl}/reward/user/${userId}`);
  }
}