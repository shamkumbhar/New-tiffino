import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegistrationService } from '../sharingdata/services/login.service';// Adjust path if needed
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-change-password',
  standalone:true,
  imports:[ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './forgotpasswordlogin.component.html',
  styleUrls: ['./forgotpasswordlogin.component.css']
})
export class ChangePasswordComponent {



}
