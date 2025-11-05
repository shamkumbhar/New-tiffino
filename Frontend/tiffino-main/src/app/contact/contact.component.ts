import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm: FormGroup;
  isSubmitting = false;
  isSubmitted = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required,Validators.pattern(/^[A-Za-z ]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [,Validators.required,Validators.pattern(/^[A-Za-z ]+$/)]]
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) return;

    this.isSubmitting = true;
    this.isSubmitted = false;

    setTimeout(() => {
      this.isSubmitting = false;
      this.isSubmitted = true;

      // Optionally reset form
      this.contactForm.reset();
    }, 2000); // Simulate 2-second delay
  }
  close(){
    this.isSubmitted=false
  }
}
