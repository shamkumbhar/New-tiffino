import { HttpInterceptorFn } from '@angular/common/http';

export const admininterInterceptor: HttpInterceptorFn = (req, next) => {
  const adminToken = localStorage.getItem('adminUser');

  // Optional: Only apply to /admin URLs
  const isAdminRequest = req.url.includes('/admin');

  if (adminToken && isAdminRequest) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${adminToken}`)
    });
    return next(authReq);
  }

  return next(req);
};

