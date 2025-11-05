import { Component, ElementRef, OnInit ,  Renderer2,  ViewChild,} from '@angular/core';
import { ValidationErrors } from '@angular/forms';

import { map,of ,Observable, debounceTime, catchError, take} from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RegistrationService } from '../sharingdata/services/login.service';
import { UserRegister } from '../sharingdata/interfaces/Userregister';
import { RouterLink } from '@angular/router';
import { AsyncValidatorFn,AbstractControl } from '@angular/forms';
import { AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { CuisinesService } from '../sharingdata/services/cusines.service';
declare const google: any; 
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  signupForm!: FormGroup;
  step = 1;
  isLoading = false;
  imageError = false;
  selectedFile: File | null = null;
  showpopup = false;
  showErrorPopup = false;
  errorMessage = '';
  termsAccepted = false;
  isSubmit = false;
  userData: any = '';
states:any[] = [];  // All states
  cities:any[] = [];   // Cities based on selected state
  citiesForState: any[] = [];
  
  constructor(
    private cs:CuisinesService,
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private router: Router,private http:HttpClient,private renderer: Renderer2
  ) {}
  showForm: boolean = false;

  ngOnInit(): void {
   setTimeout(() => {
      this.showForm = true;
    }, 1000);

this.getStates()
  this.stateValidator()

   // 2 seconds delay
  
    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required,Validators.pattern(/^[A-Za-z ]+$/),Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.minLength(6),Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email,Validators.maxLength(30)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      firstName: ['', [Validators.required,Validators.maxLength(20),Validators.pattern(/^[A-Za-z ]+$/)]],
      lastName: ['', [Validators.required,Validators.maxLength(20),Validators.pattern(/^[A-Za-z ]+$/)]],
      gender: ['', Validators.required],
      roles: ['', Validators.required],
      profileImageUrl: ['', Validators.required],
      isActive: [true, Validators.required],
      dietaryPreferences: ['', Validators.required],
      allergenPreferences: [''],
      /*dateJoined: ['', Validators.required],*/
      /*lastLogin: ['', Validators.required],*/
      addresses: this.fb.array([this.createAddressGroup()])
    });
    this.getCurrentLocation()
  }

  createAddressGroup(): FormGroup {
    return this.fb.group({
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      state: ['', Validators.required],
       city: ['', Validators.required,],
      pinCode: ['',[Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)]], //[Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      latitude: [0, ],//[Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)],
      longitude: [0, ],//[Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]
      isDefault: [false],
      addressType: ['Home', Validators.required]
    });
  }
 getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          const firstAddress = this.addresses.at(0);
          if (firstAddress) {
            firstAddress.patchValue({
              latitude: lat,
              longitude: lng
            });
          }

          console.log('Geolocation set:', lat, lng);
        },
        (error) => {
          console.error('Geolocation error:', error.message);
        }
      );
    } else {
      console.error('Geolocation not supported by this browser.');
    }
  } 
passwordStrength: string = '';
passwordStrengthClass: string = '';
stateValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    return this.cs.getAllStates().pipe(
      debounceTime(400),
      map(states => {
        const exists = states.some(state => state.name.toLowerCase() === control.value.toLowerCase());
        return exists ? null : { stateNotFound: 'state not found' };
      }),
      catchError(() => of(null)),
      take(1)
    );
  };
}
    getStates() {
    this.isLoading = true;
    this.cs.getAllStates().subscribe({
      next:(states) => {
        this.states = states;
        this.isLoading = false;
      },
      error:(err) => {
        console.error('Error fetching states:', err);
        this.isLoading = false;
      }
    });
  }
   

 onStateChange(event: any, index: number): void {
    const selectedStateName = event.target.value;
    const selectedState = this.states.find(state => state.name === selectedStateName);
    
    if (selectedState) {
      this.loadCitiesForState(selectedState.id, index);
    }
  }

  loadCitiesForState(stateId: any, index: number) {
    this.cs.getcitybystateid(stateId).subscribe(
      (cities:any) => {
        console.log(cities)
        this.citiesForState[index] = cities; 
        this.cities = cities;  
      },
      (error:any) => {
        console.error('Error fetching cities:', error);
      }
    );
  }

checkPasswordStrength() {
  const password = this.signupForm.get('password')?.value || '';

  if (password.length < 6) {
    this.passwordStrength = 'Weak password ';
    this.passwordStrengthClass = 'weak';
  } else if (password.length <= 9) {
    this.passwordStrength = 'Medium password';
    this.passwordStrengthClass = 'medium';
  } else {
    this.passwordStrength = 'Strong password';
    this.passwordStrengthClass = 'strong';
  }
}



  get f() {
    return this.signupForm.controls;
  }
      
  get addresses(): FormArray {
    return this.signupForm.get('addresses') as FormArray;
  }

  addAddress() {
  if (this.addresses.length < 3) {
    this.addresses.push(this.createAddressGroup());
  }
}

  removeAddress(index: number) {
    if (this.addresses.length > 1) {
      this.addresses.removeAt(index);
    }
  }

  nextStep() {
    if (this.validateCurrentStep() && this.step < 4) {
      this.step++;
    }
  }

  prevStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

 validateCurrentStep(): boolean {
  const controlsToCheck: Record<number, string[]> = {
    1: ['fullName', 'password', 'email', 'phoneNumber', 'gender'],
      2: ['roles', 'profileImageUrl', 'isActive', 'dietaryPreferences', 'allergenPreferences',],
      3: []
  };
// 'firstName', 'lastName'
  const controls = controlsToCheck[this.step] || [];

  controls.forEach(name => this.signupForm.get(name)?.markAsTouched());

  const isValid = controls.every(name => this.signupForm.get(name)?.valid);

  if (this.step === 4 && this.addresses.invalid) {
    this.addresses.markAllAsTouched();
    return false;
  }

  return this.step === 4 ? this.addresses.valid : isValid;
}

  onFileChange(event: any) {
  const file = event.target.files[0];
  
  // Check if a file was selected
  if (file) {
    // Get the file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    // Check if the file is a JPG or JPEG
    if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension=='png') {
      this.selectedFile = file;
      this.imageError = false; // Hide validation message if the file is valid

      // Update the profileImageUrl form control with the file name
      this.signupForm.get('profileImageUrl')?.setValue(file.name);
    } else {
      this.imageError = true; // Show validation message if the file is not valid
    }
  } else {
    this.imageError = false; // Hide validation if no file is selected
  }
}

  onSubmit() {
    this.isSubmit = true;
    this.errorMessage = '';
    this.showErrorPopup = false;

    if (this.signupForm.invalid || !this.termsAccepted || !this.selectedFile) {
      if (!this.selectedFile) this.imageError = true;
      this.validateCurrentStep();
      return;
    }

    const formValue = this.signupForm.value;

    const userData: UserRegister = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      fullName: formValue.fullName,
      gender: formValue.gender,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber,
      password: formValue.password,
      role: formValue.roles,
      isActive: formValue.isActive,
      dietaryPreferences: formValue.dietaryPreferences,
      allergenPreferences: formValue.allergenPreferences,
      profileImageUrl: formValue.profileImageUrl,
      /*dateJoined: formValue.dateJoined,
      lastLogin: formValue.lastLogin,*/
      addresses: formValue.addresses
    };

    this.isLoading = true;

    this.registrationService.register(userData).subscribe({
      next: (res) => {
        this.userData = res;
        this.isLoading = false;
        this.showpopup = true;
        setTimeout(() => {
          this.showpopup = false;
          this.resetForm();
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.userData = err;
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Registration failed';
        this.showErrorPopup = true;
        
      }
    });
  }

  resetForm() {
    this.signupForm.reset();
    this.addresses.clear();
    this.addresses.push(this.createAddressGroup());
    this.step = 1;
    this.isSubmit = false;
    this.selectedFile = null;
    this.termsAccepted = false;
  }

 
private apiurl='http://localhost:8890'
// private  apiurl=environment.apiBaseUrl
continueWithGoogle(): void {
  window.location.href = `${this.apiurl}/users/oauth2/authorize`;
}
 
}



