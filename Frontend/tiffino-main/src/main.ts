

import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { importProvidersFrom } from '@angular/core';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { admininterInterceptor } from './app/interceptors/admininter.interceptor';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http'; 
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideTranslateLoader } from './app/translate-provider';


bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideToastr(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor, admininterInterceptor])), 

    // 🔽 Add translation provider
   
    importProvidersFrom(SocialLoginModule),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: []
      } as SocialAuthServiceConfig
    }
  ]
});
