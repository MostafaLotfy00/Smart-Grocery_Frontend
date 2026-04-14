import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';

/**
 * Functional Guard to handle role-based access control (RBAC).
 * Compares the user's stored role with the required role for a specific route.
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  
  // Retrieve the assigned user role from local storage
  const userRole = localStorage.getItem('role'); 
  
  // Extract the expected role defined in the route data configuration
  const expectedRole = route.data['expectedRole']; 

  if (userRole === expectedRole) {
    // Authorized: Grant access to the route
    return true; 
  } else {
    // Unauthorized: Redirect user based on their specific role to prevent access denial loops
    if (userRole === 'ADMIN') {
      router.navigate(['/dashboard']);
    } else {
      router.navigate(['/user-home']);
    }
    
    return false;
  }
};