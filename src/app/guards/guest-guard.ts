import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token'); 

  if (token) {
    router.navigate(['/dashboard']);
    return false; 
  }

  return true; 
};