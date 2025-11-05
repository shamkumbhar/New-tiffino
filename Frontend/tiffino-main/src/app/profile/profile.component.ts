import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../sharingdata/services/login.service'; 
import { AdminAuthService } from '../sharingdata/services/admin.service'; 
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule ,Validators,FormArray} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

import { UserRegister } from '../sharingdata/interfaces/Userregister';
import { PaymentService } from '../sharingdata/services/payment.service';

@Component({
  selector: 'app-profile',
  standalone:true,
  imports:[CommonModule,FormsModule,ReactiveFormsModule,DatePipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
   providers: [DatePipe]
})
export class ProfileComponent implements OnInit {
  isBrowser:boolean;
   userDetails: any = {};  
  token: string = '';      
  userId!: number; 
  isLoading = false;
  errorMessage = '';
  showpopup = false;
  showerrorpopup=false
  showEditPopup=false;
    editForm!: FormGroup;
    imageError = false;
  selectedFile: File | null = null;
  orders: any[] = [];
paymenthistory:any;
 step = 1;
  constructor(private datePipe: DatePipe,private registrationService: RegistrationService,  private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,private payment:PaymentService,@Inject(PLATFORM_ID) private platformId: Object) {
       this.isBrowser = isPlatformBrowser(this.platformId);
    }

  ngOnInit(): void {
   
 

    this.isLoading = true;

    if (this.isBrowser) {
    const raw = localStorage.getItem('user');
    
    if (raw) {
      const parsed = JSON.parse(raw);
      this.userId = parsed.user?.id;  
      this.token = parsed.token;      
      this.userDetails = parsed.user; 
if (this.userDetails?.gender) {
        this.userDetails.gender = this.capitalizeFirstLetter(this.userDetails.gender);
      }
         this.paymentData(this.userId)
      this.isLoading = false;
    } else {
      this.errorMessage = 'No user data found in localStorage.';
      this.isLoading = false;
    }
  }    
  // this.http.get<any[]>(`${environment.apiBaseUrl}/order/user/${this.userId}/history`)
  // .subscribe({
  //   next: (data) => {
  //     this.orders = Array.isArray(data) ? data : [data]; // always make it an array
  //     console.log("Orders loaded:", this.orders);
  //   },
  //   error: (err) => console.error(err)
  // });

      
  
    this.editForm = this.fb.group({
        fullName: ['',[,Validators.pattern(/^[A-Za-z ]+$/),Validators.maxLength(30)]],
        password: ['',[, Validators.minLength(6),Validators.maxLength(30)]],
        email: ['',[, Validators.email,Validators.maxLength(30)]],
        phoneNumber: ['',Validators.pattern(/^[0-9]{10}$/)],
        firstName: ['',[Validators.maxLength(20),Validators.pattern(/^[A-Za-z]+$/)]],
        lastName: ['',[Validators.maxLength(20),Validators.pattern(/^[A-Za-z]+$/)]],
        gender: ['',Validators.required],
        role: [''],
        profileImageUrl: ['', Validators.required],
        isActive: [true],
        dietaryPreferences: ['',Validators.required],
        allergenPreferences: ['',Validators.required],
        addresses: this.fb.array([this.createAddressGroup()])
      });


      
  }
 createAddressGroup(): FormGroup {
    return this.fb.group({
      addressLine1: ['',Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pinCode: ['',[Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)]],
      latitude: [0],
      longitude: [0],
      isDefault: [false],
      addressType: ['Home']
    });

  }
    validateCurrentStep(): boolean {
    const controlsToCheck: Record<number, string[]> = {
      1: ['fullName', 'password', 'email', 'phoneNumber'],
      2: ['firstName', 'lastName', 'gender', 'role'],
      3: ['profileImageUrl', 'isActive'],
      4: ['addresses']
    };

    const controls = controlsToCheck[this.step] || [];
    controls.forEach(name => this.editForm.get(name)?.markAsTouched());
    const isValid = controls.every(name => this.editForm.get(name)?.valid);

    return isValid;
  }
    goToNextStep() {
    if (this.validateCurrentStep()) {
      this.step++;
    }
  }

  goToPreviousStep() {
    if (this.step > 1) {
      this.step--;
    }
  }
  get addresses(): FormArray {
    return this.editForm.get('addresses') as FormArray;
  }
  get f(){
    return this.editForm.controls
  }
  openEditPopup(): void {
    this.editForm.patchValue({
      ...this.userDetails,
    });

    const addressArray = this.editForm.get('addresses') as FormArray;
    addressArray.clear();

    this.userDetails.addresses.forEach((addr: any) => {
      addressArray.push(this.fb.group(addr));
    });

    this.showEditPopup = true;
  }

  closeEditPopup(): void {
    this.showEditPopup = false;
  }
     onFileChange(event: any) {
  const file = event.target.files[0];
  
  
  if (file) {
    
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    
    if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
      this.selectedFile = file;
      this.imageError = false; 

      
      this.editForm.get('profileImageUrl')?.setValue(file.name);
    } else {
      this.imageError = true; 
    }
  } else {
    this.imageError = false; 
  }
}
  onUpdateUser(): void {

    this.isLoading=true;
    this.showEditPopup=false;
    if (this.editForm.invalid) return;
    const formValue = this.editForm.value;
     const userData:UserRegister = {
               firstName: formValue.firstName,
               lastName: formValue.lastName,
               fullName: formValue.fullName,
               gender: formValue.gender,
               email: formValue.email,
               phoneNumber: formValue.phoneNumber,
               password: formValue.password,
               role: formValue.role,
               isActive: formValue.isActive,
               dietaryPreferences: formValue.dietaryPreferences,
               allergenPreferences: formValue.allergenPreferences,
               profileImageUrl: formValue.profileImageUrl,
              
               addresses: formValue.addresses
             };
   this.registrationService.profile(this.userId,userData).subscribe({
      next: (res) => {
        this.isLoading=false
        this.showpopup=true;
        console.log(res);
        this.userDetails = res;
        this.closeEditPopup();
      },
      error: (err) => {
        this.isLoading=false
        console.error('Update error:', err);
        this.showerrorpopup=true;
      }
    });
  }

  formatDate(date: string): string {
   const [day, month, year] = date.split('-');
    const formattedDate = new Date(+year, +month - 1, +day);

    // Return the formatted date using DatePipe
    return this.datePipe.transform(formattedDate, 'MMMM d, yyyy')!;
  }

  // Logout logic
  logout(): void {
    this.registrationService.logout(); 
    this.router.navigate(['/login']); 
  }
  capitalizeFirstLetter(str: string): string {
    if (!str) return str;  
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }


  getProgressPercent(status: string) {
    const steps = ['PENDING', 'CONFIRMED', 'PREPARING', 'EN_ROUTE', 'DELIVERED'];
    const index = steps.indexOf(status);
    return index >= 0 ? ((index + 1) / steps.length) * 100 : 0;
  }
  getStatusClass(status: string) {
    return status.toLowerCase();
  }



  paymentData(userid:any){
    this.payment.getbyuser(userid).subscribe(
      (data)=>{console.log(data);this.paymenthistory=data}
    )
  }
}




