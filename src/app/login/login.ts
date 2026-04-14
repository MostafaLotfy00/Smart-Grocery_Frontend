import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule], // Essential modules for forms and common directives
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  // Model for binding login credentials
  loginData = { username: '', password: '' }; 
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Handles the login submission process
   * Persists user session data and navigates based on assigned role
   */
  onLogin() {
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        if (response.success) {
          // 1. Session Persistence: Storing authentication data in LocalStorage
          localStorage.setItem('token', response.data.accessToken);
          localStorage.setItem('role', response.data.role); // Crucial for Authorization Guards
          localStorage.setItem('username', response.data.username);

          // 2. Role-based Navigation: Routing based on Backend authority
          if (response.data.role === 'ADMIN') {
            this.router.navigate(['/dashboard']);
          } else if (response.data.role === 'USER') {
            this.router.navigate(['/user-home']);
          }
        }
      },
      error: (err) => {
        // Error feedback using SweetAlert2
        Swal.fire('Error', 'Invalid credentials', 'error');
      }
    });
  }
}