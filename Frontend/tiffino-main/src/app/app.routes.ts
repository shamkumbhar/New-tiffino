
import { ContactComponent } from './contact/contact.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

import { SubscriptionComponent } from './subscriptions/subscriptions.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AccountRegistrationComponent } from './account-registration/account-registration.component';
import { ForgatePasswordComponent} from './forgate-password/forgate-password.component';
import { AddTocartComponent } from './add-tocart/add-tocart.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { SubscriptionsComponent } from './delivery/subscription/subscription.component'; 
import { FoodcartComponent } from './foodcart/foodcart.component';
import { MembershipPlanComponent } from './membership-plan/membership-plan.component';

import { ReactiveFormsModule } from '@angular/forms';

import  {ReviewRatingComponent} from './Rating-Review/review-list.component';
import { PaymentcheckoutpageComponent } from './paymentcheckoutpage/paymentcheckoutpage.component';
import { OffersRewardsComponent } from './offers-rewards/offers-rewards.component';
import {paymentComponent} from './payment/payment.component';
import { SettingsComponent } from './settings/settings.component';
import { authGuard } from './sharingdata/guard/auth.guard';
import { ChangePasswordComponent } from './forgotpassword/forgotpasswordlogin.component';
import {DeliveryPartnerComponent } from './delivery/delivery.component';
import { OrderitemComponent } from './orderitem/orderitem.component';
import { CookiesComponent } from './cookies/cookies.component';
import { CuisineitemComponent } from './cuisineitem/cuisineitem.component';
import { Oauth2SuccessComponentComponent } from './oauth2-success-component/oauth2-success-component.component';
import { CusinefilterComponent } from './cusinefilter/cusinefilter.component';
import { MenuaddComponent } from './menuadd/menuadd.component';
import { Component } from '@angular/core';
import { PaymentfailedComponen } from './paymentfailed/paymentfailed.component';
import { DeliveryPartnerProfileComponent } from './delivery-partner-profile/delivery-partner-profile.component';
import { OrderTrackingComponent } from './order-tracking/order-tracking.component';
export const routes: Routes = [
  {
  path: 'partner/:id',
  component: DeliveryPartnerProfileComponent  // create this component if not already
},
  {path:'menuadd',component:MenuaddComponent},
  {path:'checkpayment',component:PaymentcheckoutpageComponent},
  {path:'paymentretry',component:PaymentfailedComponen},
  {path:'review',component:ReviewRatingComponent,canActivate:[authGuard]},
{path:'subplan',component:SubscriptionsComponent},
{path:'menu/:item',component:OrderitemComponent,canActivate:[authGuard]},
  { path: 'subscriptions', component: SubscriptionComponent,canActivate:[authGuard]},
  { path: 'profile', component: ProfileComponent ,canActivate:[authGuard]},
{path:'contact',component:ContactComponent},
{path: 'Account-Registration',component: AccountRegistrationComponent},
{path: 'filterstate/:id',component :ForgatePasswordComponent,canActivate:[authGuard]},
{path: 'foodcart',component : FoodcartComponent,canActivate:[authGuard]},
{path: 'MembershipPlan',component : MembershipPlanComponent},
{path:'addtocart',component:AddTocartComponent,canActivate:[authGuard]},
{path:'wishlist',component:WishlistComponent,canActivate:[authGuard]},
{path:'offers',component:OffersRewardsComponent,canActivate:[authGuard]},
{path:'payment',component:paymentComponent,canActivate:[authGuard]},
{path:'settings',component:SettingsComponent,canActivate:[authGuard]},
{path:'changepassword',component:ChangePasswordComponent,canActivate:[authGuard]},
{path:'delivery',component:DeliveryPartnerComponent},
{path:'cusineinfo/:id',component:CuisineitemComponent},

{path:'ordertracking',component:OrderTrackingComponent},
{
    path: '',
    loadComponent: () =>
      import('./home/home.component').then(m => m.HomeComponent)
  },

  {
    path:'cusinefilter',loadComponent:()=>import('./cusinefilter/cusinefilter.component').then(m=>m.CusinefilterComponent)
  },

  {
  path: 'oauth2/success',
  component: Oauth2SuccessComponentComponent
},
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'admin-login',
    loadComponent: () =>
      import('./admin-login/admin-login.component').then(m => m.AdminLoginComponent)
  },
  //{
   // path: 'cuisines',
    //loadComponent: () =>
     // import('./cuisines/cuisines.component').then(m => m.CuisinesComponent)
  //},
  {path:'terms',
    loadComponent:()=>import('./terms-conditions/terms-conditions.component').then(m =>m.TermsAndConditionsComponent)
  },
  {
    path:'cookiesprivacy',
    loadComponent:()=>import('./privacypolicy/privacypolicy.component').then(m=>m.PrivacypolicyComponent)
  },
  {path:'cookies',component:CookiesComponent}
];
