import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { RegistrationService } from '../services/login.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(RegistrationService);
  const user = userService.currentUser;
 const token=localStorage.getItem('jwt')
  

  if (user && user.token||token ) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
