import {
  Component,
  inject,
  OnInit,
  signal,
  Signal,
  effect,
  computed,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { ReviewService } from '../sharingdata/services/reviews.service';
 
@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css'],
  // Use OnPush to reduce change detection overhead
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewRatingComponent implements OnInit {
  private rating = inject(ReviewService);
  private fb = inject(FormBuilder);
  private platformId = inject(PLATFORM_ID);
 
  // Signals for state
  comments = signal<any[]>([]);
  isLoadingComments = signal(false);
  isSubmitting = signal(false);
  hoveredRating = signal(0);
  imageError = signal(false);
  likeClicked = signal(false);
  dislikeClicked = signal(false);
   showSuccessPopup = signal(false);
 showDeletePopup=signal(false)
  // Form
  reviewForm: FormGroup;
 
  // Other data
  isBrowser: boolean;
  userDetails: any = {};
  token = '';
  userId!: number;
  orderid: any;
  mealid: number[] = [];
 
  selectedFile: File | null = null;
  stars = [1, 2, 3, 4, 5];
 
  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.reviewForm = this.fb.group({
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.required],
      photoUrls: [''],
      likes: [0],
      dislikes: [0]
    });
  }
 
  ngOnInit(): void {
    if (this.isBrowser) {
      const raw = localStorage.getItem('user');
      if (raw) {
        const parsed = JSON.parse(raw);
        this.userId = parsed.user?.id;
        this.token = parsed.token;
        this.userDetails = parsed.user;
      }
 
      const orderDataString = localStorage.getItem('latestOrder');
      if (orderDataString) {
        const parsedOrder = JSON.parse(orderDataString);
        this.orderid = parsedOrder.id;
        this.mealid = parsedOrder.orderItems.map((item: any) => item.mealId);
      }
    }
 
    // Initially load comments
    this.loadComments();
  }
 
  // Template interaction methods
  setRating(value: number): void {
    this.reviewForm.get('rating')?.setValue(value);
  }
 
  hoverRating(value: number): void {
    this.hoveredRating.set(value);
  }
 
  onFileChange(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') {
        this.selectedFile = file;
        this.imageError.set(false);
        this.reviewForm.get('photoUrls')?.setValue(file.name);
      } else {
        this.selectedFile = null;
        this.imageError.set(true);
      }
    } else {
      this.selectedFile = null;
      this.imageError.set(false);
    }
  }
 
  onLikeClick(): void {
    const likesCtrl = this.reviewForm.get('likes');
    const dislikesCtrl = this.reviewForm.get('dislikes');
    const currLikes = likesCtrl?.value || 0;
    likesCtrl?.setValue(currLikes + 1);
    this.likeClicked.set(true);
    setTimeout(() => this.likeClicked.set(false), 500);
 
    if (this.dislikeClicked()) {
      const currDislikes = dislikesCtrl?.value || 0;
      dislikesCtrl?.setValue(Math.max(0, currDislikes - 1));
      this.dislikeClicked.set(false);
    }
  }
 
  onDislikeClick(): void {
    const dislikesCtrl = this.reviewForm.get('dislikes');
    const currDislikes = dislikesCtrl?.value || 0;
    dislikesCtrl?.setValue(currDislikes + 1);
    this.dislikeClicked.set(true);
    setTimeout(() => this.dislikeClicked.set(false), 500);
  }
 
  submitReview(): void {
    if (!this.reviewForm.valid) {
      alert('Please fill all required fields.');
      return;
    }
    if (!this.userId || !this.orderid || this.mealid.length === 0) {
      alert('Missing user/order/meal information.');
      return;
    }
 
    this.isSubmitting.set(true);
 
    const formValue = this.reviewForm.value;
 
    const requests = this.mealid.map(mealId => {
      const payload = {
        rating: formValue.rating,
        comment: formValue.comment,
        photoUrls: formValue.photoUrls || [],
        likes: formValue.likes,
        dislikes: formValue.dislikes,
        userId: this.userId,
        orderId: this.orderid,
        mealId
      };
      return this.rating.addReview(payload);
    });
 
    // If many requests, you could use forkJoin or Promise.all pattern
    let doneCount = 0;
    requests.forEach(obs => {
      obs.subscribe({
        next: res => {
          doneCount++;
          if (doneCount === requests.length) {
            // all done
            this.isSubmitting.set(false);
            this.reviewForm.reset();
            // Optional: reset photoUrls, likes, dislikes
            this.loadComments();
             this.showSuccessPopup.set(true);
          }
        },
        error: err => {
          console.error('Error in submitting review', err);
         
          this.isSubmitting.set(false);
        }
      });
    });
  }
 
  loadComments(): void {
    this.isLoadingComments.set(true);
    this.rating.getCommentsByReview().subscribe({
      next: (res: any[]) => {
        this.comments.set(res);
        this.isLoadingComments.set(false);
      },
      error: err => {
        console.error('Error fetching comments', err);
        this.isLoadingComments.set(false);
      }
    });
  }
 
  deleteComment(id: number): void {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    this.isLoadingComments.set(true);
    this.rating.deleteComment(id).subscribe({
      next: () => {
        // remove from local state for fast UI update
        this.comments.update(cs => cs.filter(c => c.id !== id));
        this.isLoadingComments.set(false);
         this.showDeletePopup.set(false);
        
      },
      error: err => {
        console.error('Error deleting comment', err);
        this.isLoadingComments.set(false);
      }
    });
  }
}
 