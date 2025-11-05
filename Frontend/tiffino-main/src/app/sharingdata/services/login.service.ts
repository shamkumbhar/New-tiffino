import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/User';
import { UserLogin } from '../interfaces/Userlogin';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { UserRegister } from '../interfaces/Userregister';
 // Interface for registration form data
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { catchError,throwError } from 'rxjs';
import { AdminUser } from '../interfaces/adminlogin';
import { environment } from '../../../environments/environments';
const userKey = 'user'; // Key for local storage

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private apiurl='http://localhost:8890'
  currentiser!: User;
  private userSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());
  public userObservable: Observable<User>;

  constructor(private http: HttpClient,private router:Router) {
    this.userObservable = this.userSubject.asObservable();
  }

  

  public get currentUser():User {
    return this.userSubject.value
  }
 
  // Register a new user'http://localhost:8800/api/users/'
 register(formData:UserRegister): Observable<User> {
  return this.http.post<User>(`${this.apiurl}/users/register`, formData).pipe(
    tap({
      next: (user) => {
         user.isAdmin = user.role === 'ADMIN';
        this.setUserToLocalStorage(user);
        this.userSubject.next(user);
        console.log(`User registered successfully: ${user.id}`);
      },
     error: (error) => {
        if (error.error instanceof ProgressEvent) {
          console.error('Registration failed: Backend unreachable or network error', error);
        } else {
          console.error('Registration failed:', error.error);
        }
      },
    })
  );
}

  login(userLogin: UserLogin): Observable<User> {
    return this.http.post<User>(`${this.apiurl}/users/login`, userLogin).pipe(
      tap({
        next: (user) => {
          // Save the logged in user to local storage and trigger a notification about it
          localStorage.setItem('UserData',JSON.stringify(user))
          this.currentiser = user;
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          
         
        },
        error: (errorResponse) => {
          // Display error message if login fails
          console.log(errorResponse.error, 'Login Failed')
        }
      })
    )

  }




  // Get user data from local storage
  private getUserFromLocalStorage(): User {
    const userJson = localStorage.getItem(userKey);
    if (userJson) {
      return JSON.parse(userJson) as User;
    }
    return new User(); // Return an empty User object if no user data is found
  }

  // Set user data in local storage
  private setUserToLocalStorage(user: User): void {
    localStorage.setItem(userKey, JSON.stringify(user)); // Save user data in localStorage
  }

  // Optional: Logout method to remove user from local storage
  logout(): void {
    this.userSubject.next(new User()); // Reset the BehaviorSubject
    localStorage.removeItem(userKey); // Remove user data from local storage
    console.log('User has logged out successfully.');
  }



get currentUserValue(): User {
    if (!this.currentiser) {
      const userData = localStorage.getItem('user');
      if (userData) this.currentiser = JSON.parse(userData);
    }
    return this.currentUser;
  }
   profile(userId: number,data:UserRegister): Observable<any> {
     return this.http.put(`${this.apiurl}/users/${userId}`,data);
   }
}


