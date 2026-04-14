import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Functional Guard to protect routes from unauthorized access.
 * Checks for the presence of an authentication token in local storage.
 */
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  
  // Retrieve the authentication token from browser storage
  const token = localStorage.getItem('token'); 

  if (token) {
    // If token exists, grant access to the requested route
    return true;
  } else {
    // If no token is found, redirect unauthorized users to the login page
    router.navigate(['/login']);
    return false;
  }
};