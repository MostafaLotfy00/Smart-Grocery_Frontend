import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product'; // Product service for inventory management
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './manage-products.html',
  styleUrl: './manage-products.scss'
})
export class ManageProductsComponent implements OnInit {
  // --- Inventory Data Properties ---
  myProducts: any[] = [];
  isLoading: boolean = false;

  // --- Pagination State ---
  currentPage: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;
  totalPages: number = 0;

  // --- View Configuration ---
  viewMode: 'external' | 'internal' | 'dashboard' = 'dashboard';

  constructor(
    private productService: ProductService, 
    private router: Router, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadMyProducts();
  }

  /**
   * Loads the current user's product inventory with server-side pagination
   */
  loadMyProducts() {
    this.isLoading = true;
    // Passing pagination parameters to the service method
    this.productService.getInternalProducts(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          // Mapping paginated API response to local state
          this.myProducts = res.data.items;
          this.totalElements = res.data.totalElements;
          this.totalPages = res.data.totalPages;
          this.currentPage = res.data.pageNo;
        }
        this.isLoading = false;
        this.cdr.detectChanges(); // Ensuring UI synchronization
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire('Error', 'Failed to load your inventory', 'error');
      }
    });
  }

  /**
   * Switches UI context between local inventory and external search
   * @param mode Target view mode
   */
  switchView(mode: 'external' | 'internal') {
    this.viewMode = mode;
    if (mode === 'internal') {
      this.loadMyProducts();
    } else {
      this.myProducts = []; // Clearing list to prepare for new external search context
    }
  }

  // --- Pagination Navigation Controls ---

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadMyProducts();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadMyProducts();
    }
  }

  /**
   * Resets to the first page when page size is modified to ensure correct index calculation
   */
  onPageSizeChange() {
    this.currentPage = 0; 
    this.loadMyProducts();
  }

  /**
   * Displays a confirmation dialog before permanent product deletion
   * @param id Product unique identifier
   */
  confirmDelete(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "This item will be permanently removed from your store!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444", // Tailwind Red-500 for destructive actions
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        this.executeDelete(id);
      }
    });
  }

  /**
   * Performs the deletion via service and updates the UI state
   * @param id Product ID to be deleted
   */
  
  private executeDelete(id: number) {
    this.productService.deleteMeal(id).subscribe({
      next: () => {
        // Optimistic UI update by filtering out the deleted item from the local array
        this.myProducts = this.myProducts.filter(p => p.id !== id);
        Swal.fire("Deleted!", "The product has been removed.", "success");
        this.cdr.detectChanges();
      },
      error: (err) => Swal.fire("Error!", "Delete failed. Try again.", "error")
    });
  }

  /**
   * Clears session storage and redirects user to the login screen
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
        localStorage.clear(); // Removing auth tokens, roles, and session identifiers
        this.router.navigate(['/login']);
      }
    });
  }
}