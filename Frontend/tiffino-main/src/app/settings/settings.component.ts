import { Component, HostBinding, OnDestroy, OnInit,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormArray, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RegistrationService } from '../sharingdata/services/login.service';
import { UserRegister } from '../sharingdata/interfaces/Userregister';
import { HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateLoader } from '../translate-provider';
import { TranslateLoader, } from '@ngx-translate/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateConfigModule } from '../translate-config.module';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
 
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule,ReactiveFormsModule,TranslateModule, TranslateConfigModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
 
})
export class SettingsComponent implements OnInit, OnDestroy {
   translate = inject(TranslateService);
 
  userDetails: any = {};
  token: string = '';
  userId!: number;
step=1
  // Settings toggles
  notificationsEnabled = true;
  notificationSound = false;
  pauseSubscription = false;
  zeroCostDelivery = false;
  ecoPackaging = false;
  cutleryOptOut = false;
  darkMode = false;
 
  // Language/TimeZone
  selectedLanguage = 'en';
  selectedTimeZone = 'Asia/Kolkata';
  timeZones: string[] = ['Asia/Kolkata', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney'];
 
  // UI Controls
  showPrivacyBox = false;
  showEditPopup = false;
  showpopup = false;
  showerrorpopup = false;
  isLoading = false;
 
  // Form & Profile Image
  editForm!: FormGroup;
  selectedFile: File | null = null;
  imageError = false;
 
  // Time
  currentDate = new Date();
  intervalId: any;
 
  // Audio
  private audio = new Audio();
 
  @HostBinding('class.dark-theme') get isDarkTheme() {
    return this.darkMode;
  }
 
  constructor(
    private registrationService: RegistrationService,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
   
  ) {
    // Correct path to the audio file (must be in src/assets/)
    this.audio.src = 'assets/notification.mp3';
    this.audio.load();
  }
 
  ngOnInit(): void {
 
      this.translate.addLangs(['en', 'hi']);
    this.translate.setDefaultLang('en');
    this.loadSettings();
 this.translate.addLangs(['en', 'hi']);
    const lang = localStorage.getItem('lang') || 'en';
    this.translate.use(lang);
    this.selectedLanguage = lang;
 
    const raw = localStorage.getItem('user');
    if (raw) {
      const parsed = JSON.parse(raw);
      this.userId = parsed.user?.id;
      this.token = parsed.token;
      this.userDetails = parsed.user;
    }
 
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
 
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
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
  // -----------------------------
  // Settings Logic
  // -----------------------------
 
  toggleNotifications() {
    this.notificationsEnabled = !this.notificationsEnabled;
    this.saveSettings();
  }
 
  togglePrivacyBox() {
 this.router.navigate(['/cookiesprivacy'])
  }
 
  toggleTheme() {
    this.setCookie('theme', this.darkMode ? 'dark' : 'light');
  }
 
  changeLanguage() {
    this.setCookie('lang', this.selectedLanguage);
    window.location.reload();
   this.translate.use(this.selectedLanguage);
    localStorage.setItem('lang', this.selectedLanguage); // Optional: reload to apply
  }
 
  saveSettings() {
    this.setCookie('notificationsEnabled', this.notificationsEnabled.toString());
    this.setCookie('notificationSound', this.notificationSound.toString());
    this.setCookie('pauseSubscription', this.pauseSubscription.toString());
    this.setCookie('zeroCostDelivery', this.zeroCostDelivery.toString());
    this.setCookie('ecoPackaging', this.ecoPackaging.toString());
    this.setCookie('cutleryOptOut', this.cutleryOptOut.toString());
    this.setCookie('lang', this.selectedLanguage);
    this.setCookie('theme', this.darkMode ? 'dark' : 'light');
    this.setCookie('timeZone', this.selectedTimeZone);
 
    if (this.notificationSound) {
      this.playNotificationSound();
    }
  }
 
  loadSettings() {
    this.notificationsEnabled = this.getCookie('notificationsEnabled') === 'true';
    this.notificationSound = this.getCookie('notificationSound') === 'true';
    this.pauseSubscription = this.getCookie('pauseSubscription') === 'true';
    this.zeroCostDelivery = this.getCookie('zeroCostDelivery') === 'true';
    this.ecoPackaging = this.getCookie('ecoPackaging') === 'true';
    this.cutleryOptOut = this.getCookie('cutleryOptOut') === 'true';
    this.selectedLanguage = this.getCookie('lang') ?? 'en';
    this.darkMode = this.getCookie('theme') === 'dark';
    this.selectedTimeZone = this.getCookie('timeZone') ?? 'Asia/Kolkata';
  }
 
  playNotificationSound() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.audio.play().catch(err => {
      console.error('Error playing sound:', err);
    });
  }
 
  // -----------------------------
  // Cookie Helpers
  // -----------------------------
 
  setCookie(name: string, value: string, days = 365) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  }
 
  getCookie(name: string): string | null {
    return document.cookie.split('; ').reduce((r: any, v: any) => {
      const parts = v.split('=');
      return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, null);
  }
 
  clearAllCookies() {
    document.cookie.split(';').forEach(c => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
  }
 
  // -----------------------------
  // Utility & Formatters
  // -----------------------------
 
  formatDateInTimezone(date: Date, timeZone: string): string {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
  }
  showMenu=false;
 toggleMenu() {
    this.showMenu = !this.showMenu;
  }
  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.clearAllCookies();
      window.location.href = '/login';
    }
  }
 
  goToOrders() {
    alert('Redirect to Profile');
    window.location.href = '/profile';
  }
 
  goToHelp() {
    if (confirm('Please confirm whether help is required')) {
      window.location.href = '/contact';
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
 
}
 