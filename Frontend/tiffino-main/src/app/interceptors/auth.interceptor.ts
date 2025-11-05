import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { RegistrationService } from '../sharingdata/services/login.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(RegistrationService);
  const user = userService.currentUser;

  if (user?.token) {
    const authReq = req.clone({
      setHeaders: {
        access_token: user.token
      }
    });
    return next(authReq);
  }

  return next(req);
};

