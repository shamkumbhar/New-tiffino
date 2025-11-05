import { Component } from '@angular/core';
import { RouterLink   } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AdminAuthService } from '../sharingdata/services/admin.service';
import { RegistrationService } from '../sharingdata/services/login.service';
import { UserLogin } from '../sharingdata/interfaces/Userlogin';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule, RouterModule,CommonModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent implements OnInit{
  adminform!:FormGroup;
  isloading=false;
  showpopup=false;
  errorMessage ='';
  showErrorPopup=false;
  constructor(private adminservice:AdminAuthService,private route:Router,
     private fb: FormBuilder,
        private registerservice: RegistrationService,
        private router: Router,
        private activated: ActivatedRoute,
  ){}
 ngOnInit(): void {
    this.adminform=this.fb.group({
      Email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,]]
    })
 }
 
 get f(){
  return this.adminform.controls
  console.log(this.adminform.controls);
 }
 onSubmit() {
 this.errorMessage ='';
 this.showErrorPopup = false;
     if (this.adminform.valid) {
       const lv = this.adminform.value;
       const adminlogindata: UserLogin = {
         email: lv.Email,
         password: lv.password
       };
       this.isloading=true;
       this.adminservice.adminLogin(adminlogindata).subscribe({
              next: (res) => {
                      this.isloading = false;
                     this.showpopup = true;
                     setTimeout(() => {
                            this.showpopup = false;
                             this.router.navigate(['/delivery']);
                                      }, 3000);
                        },
                        error: (err) => {
                           this.isloading = false;
                           this.errorMessage = err?.error?.message || 'Invalid Email Or Password';
                           this.showErrorPopup = true;
                             console.log(err);
                              }
                              });
                    }
                      this.adminform.reset();
                }
 
 
           }
 