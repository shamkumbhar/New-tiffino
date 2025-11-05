
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

export interface ReviewDTO {
  userId: number;
  mealId: number;
  orderId: number;
  rating: number;
  comment: string;
  photoUrls: string[];
  status: string;
}

export interface Review {
  id: number;
  userId: number;
  mealId: number;
  orderId: number;
  rating: number;
  comment: string;
  photoUrls: string[];
  likes: number;
  dislikes: number;
  status: string;
  comments: ReviewComment[];
}

export interface ReviewComment {
  id: number;
  userId: number;
  reviewId: number;
  comment: string;
  status: string;
}

export interface ReviewCommentDTO {
  userId: number;
  reviewId: number;
  comment: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
private apiurl= 'http://localhost:8950'

  constructor(private http: HttpClient) {}

  getReviewsByMeal(mealId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiurl}/reviews/meal/${mealId}`);
  }

  addReview(reviewDTO: any): Observable<Review> {
    return this.http.post<Review>(`${this.apiurl}/reviews/reviewsSave`, reviewDTO);
  }

  addComment(commentDTO: ReviewCommentDTO): Observable<ReviewComment> {
    return this.http.post<ReviewComment>(`${this.apiurl}/reviews/commentsSave`, commentDTO);
  }

  getCommentsByReview(): Observable<ReviewComment[]> {
    return this.http.get<ReviewComment[]>(`${this.apiurl}/reviews/all`);
  }
deleteComment(reviewId: number): Observable<any> {
return this.http.delete(`${this.apiurl}/reviews/delete/${reviewId}`);
}
}

