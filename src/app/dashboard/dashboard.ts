import { Component, ChangeDetectorRef } from '@angular/core';
import { ProductService } from '../services/product'; // Product service for API communication
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Meal } from '../meal.model'; // Meal data interface/model
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Essential modules for structural directives and data binding
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})

export class DashboardComponent {
  searchLetter: string = 'a'; // Initial search query parameter
  meals: Meal[] = []; // Array to store fetched meal results
  selectedMeals: any[] = []; // Tracking user-selected items for bulk actions
  pagedMeals: any[] = []; 
  currentPage: number = 0;
  pageSize: number = 6; 
  totalPages: number = 0;

// بعد

  // SweetAlert2 Toast configuration for feedback notifications
  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  // UI view state management
  viewMode: 'external' | 'internal' | 'dashboard' = 'dashboard';

  /**
   * Toggles between external API search and internal database view
   * @param mode Selected view mode
   */
  switchView(mode: 'external' | 'internal') {
    this.viewMode = mode;
    if (mode === 'internal') {
      this.loadInternalProducts();
    } else {
      this.meals = []; // Reset list for fresh external search results
    }
  }

  /**
   * Fetches approved products from the internal database
   */
  loadInternalProducts() {
    this.productService.getInternalProducts().subscribe({
      next: (res) => {
        this.meals = res; // Mapping internal results to the local array
        this.cdr.detectChanges(); // Forcing UI update to reflect fetched data
      },
      error: (err) => Swal.fire('Error', 'Could not load your products', 'error')
    });
  }

  constructor(
    private productService: ProductService, 
    private router: Router, 
    private cdr: ChangeDetectorRef
  ) {}


  search() {
  this.productService.searchExternal(this.searchLetter).subscribe({
    next: (response) => {
      this.meals = response.data || [];
      this.currentPage = 0; 
      this.calculatePagination();
      this.cdr.detectChanges();

    },
      error: (err) => this.Toast.fire({ icon: 'error', title: 'Search failed' })

  });
}

calculatePagination() {
  this.totalPages = Math.ceil(this.meals.length / this.pageSize);
  this.updatePagedMeals();
}

updatePagedMeals() {
  const startIndex = this.currentPage * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.pagedMeals = this.meals.slice(startIndex, endIndex);
}

nextPage() {
  if (this.currentPage < this.totalPages - 1) {
    this.currentPage++;
    this.updatePagedMeals();
    window.scrollTo(0, 0); 
  }
}

prevPage() {
  if (this.currentPage > 0) {
    this.currentPage--;
    this.updatePagedMeals();
    window.scrollTo(0, 0);
  }
}

  /**
   * Handles selection/deselection logic for individual meal items
   * @param meal The selected/deselected meal object
   */
  toggleSelection(meal: any) {
    const index = this.selectedMeals.findIndex(m => m.name === meal.name);
    if (index > -1) {
      this.selectedMeals.splice(index, 1); // Remove if already exists in selection
    } else {
      this.selectedMeals.push(meal); // Append to selection array
    }
  }

  /**
   * Helper method for template styling (Checkmark/Outline visibility)
   * @param meal Item to check
   */
  isMealSelected(meal: any): boolean {
    return this.selectedMeals.some(m => m.name === meal.name);
  }

  /**
   * Submits only the manually selected items to the database
   */
  approveSelected() {
  if (this.selectedMeals.length === 0) return;

  this.productService.approveMeal(this.selectedMeals).subscribe({
    next: (res) => {
      this.Toast.fire({ icon: 'success', title: `${this.selectedMeals.length} products added!` });

      const selectedNames = this.selectedMeals.map(m => m.name);
      this.meals = this.meals.filter(meal => !selectedNames.includes(meal.name));

      this.selectedMeals = [];

      this.calculatePagination();
      
  
      if (this.pagedMeals.length === 0 && this.currentPage > 0) {
        this.currentPage--;
        this.calculatePagination();
      }

      this.cdr.detectChanges();
    },
    error: (err) => this.Toast.fire({ icon: 'error', title: 'Error saving selected products' })
  });
}

  /**
   * Quick approve for a single meal item
   * @param meal Target meal to approve
   */
  approve(meal: any) {
  this.productService.approveMeal(meal).subscribe({
    next: (res) => {
      this.Toast.fire({ icon: 'success', title: 'Product added successfully' });
      
      this.meals = this.meals.filter(m => m.name !== meal.name); 
      
      this.calculatePagination(); 
      
      this.cdr.detectChanges();
    },
    error: (err) => this.Toast.fire({ icon: 'error', title: 'Error saving product' })
  });
}

  /**
   * Confirmation dialog for bulk approving all current search results
   */
  confirmApproveAll() {
    if (this.meals.length === 0) return;

    Swal.fire({
      title: "Are you sure?",
      text: `You are about to approve all ${this.meals.length} items!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve all!",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        this.approveAll();
      }
    });
  }

  executeBulkApprove() {
  this.productService.approveMeal(this.meals).subscribe({
    next: (res) => {
      this.Toast.fire({ icon: 'success', title: 'products saved successfully' });
      
      const selectedNames = this.selectedMeals.map(m => m.name);
      this.meals = this.meals.filter(meal => !selectedNames.includes(meal.name));

      this.selectedMeals = [];

      this.calculatePagination();
      
      if (this.pagedMeals.length === 0 && this.currentPage > 0) {
        this.currentPage--;
        this.calculatePagination();
      }

      this.cdr.detectChanges();
    },
    error: (err) => this.Toast.fire({ icon: 'error', title: 'Error saving selected products' })
  });
}

  /**
   * Legacy method for direct bulk approval (alternative to dialog)
   */
  approveAll() {
    this.productService.approveMeal(this.meals).subscribe({
    next: (res) => {
      this.Toast.fire({ icon: 'success', title: 'All products saved successfully (Bulk Approve)' });
      
      // فضي كل حاجة
      this.meals = [];
      this.pagedMeals = [];
      this.calculatePagination(); 
      
      this.cdr.detectChanges();
    },
    error: (err) => this.Toast.fire({ icon: 'error', title: 'Bulk approval failed' })
  });
  }

  /**
   * Standard delete confirmation dialog
   * @param mealId Database record ID
   */
  confirmDelete(mealId: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33", // Destructive action color
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.executeDelete(mealId);
      }
    });
  }

  private executeDelete(id: number) {
    this.productService.deleteMeal(id).subscribe({
      next: () => {
        Swal.fire("Deleted!", "The meal has been removed.", "success");
        // Update local list after successful DB removal
      },
      error: (err) => Swal.fire("Error!", "Could not delete the item.", "error")
    });
  }

  /**
   * Session termination and navigation to login
   */
  logout() {
    Swal.fire({
      title: 'Logout?',
      text: "Are you sure you want to exit?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear(); // Clear all session data (Tokens, Roles, etc.)
        this.router.navigate(['/login']);
      }
    });
  }
}