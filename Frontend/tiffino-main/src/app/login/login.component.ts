

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { RegistrationService } from '../sharingdata/services/login.service';
import { UserLogin } from '../sharingdata/interfaces/Userlogin';
import { AsyncValidatorFn,AbstractControl,ValidationErrors } from '@angular/forms';
import { map,of } from 'rxjs';
import { catchError,Observable } from 'rxjs';
import { OtpService } from '../sharingdata/services/otp.service';
import { environment } from '../../environments/environments';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  returnurl = '';
  errorMessage ='';
 showErrorPopup = false;
 isLoading = false;
 showpopup = false;
 data:any;

 
  constructor(
    private fb: FormBuilder,
    private registerservice: RegistrationService,
    private router: Router,
    private activated: ActivatedRoute,
    private otpService:OtpService

  ) {}

  ngOnInit(): void {
     
    this.loginForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email,Validators.maxLength(30)],],
      password: ['', [Validators.required,Validators.maxLength(20)]]
    });

    this.returnurl = this.activated.snapshot.queryParams['returnUrl'] || '/';
  }


  get f() {
    return this.loginForm.controls;
  }
showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  onSubmit() {
    this.errorMessage = '';
    this.showErrorPopup = false;
    if (this.loginForm.valid) {
      const lv = this.loginForm.value;
      const logindata: UserLogin = {
        email: lv.Email,
        password: lv.password
      };
       this.isLoading = true;
       const startTime = Date.now();
      this.registerservice.login(logindata).subscribe({
       next: (res) => {
        const elapsed = Date.now() - startTime;
    const delay = Math.max(9000 - elapsed, 0);
        this.data=res
       
        setTimeout(() => {
      this.data = res;
      localStorage.setItem('profile', JSON.stringify(res));
      this.isLoading = false;
      this.showpopup = true;
      setTimeout(() => {
        this.showpopup = false; 
        this.router.navigate(['/']);
      }, 3000);
    }, delay);
  },
      error: (err) => {
      
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Login failed Please Try Again';
        this.showErrorPopup = true;
        
      }
        
      });
    }
    
    
      
   }
  // private apiurl='http://localhost:8890'
    private apiurl=environment.apiBaseUrl
  continueWithGoogle(): void {
 window.location.href = `${this.apiurl}/users/oauth2/authorize`;
}
}
  