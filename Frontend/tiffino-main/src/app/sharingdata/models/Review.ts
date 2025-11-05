export interface Review {
  id?: number;
  userId: number;
  mealId: number;
  orderId: number;
  rating: number;
  comment: string;
  reviewDate: string;
  photoUrls: string[];
  likes: number;
  dislikes: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UPDATED';
}

export interface Comment {
  id?: number;
  reviewId: number;
  userId: number;
  comment: string;
  commentDate: string;
}

export interface Meal {
  id: number;
  name: string;
  description: string;
  price: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Order {
  id: number;
  mealId: number;
  userId: number;
  orderDate: string;
}