import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductService } from '../../services/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-home.html',
  styleUrl: './user-home.scss',
})
export class UserHome implements OnInit {
  // --- Data Properties ---
  products: any[] = [];
  isLoading: boolean = false;
  
  // --- Pagination Properties ---
  currentPage: number = 0;
  pageSize: number = 10; 
  totalElements: number = 0;
  totalPages: number = 0;

  // --- Filter & Search Properties ---
  searchName: string = '';
  selectedCategory: string = '';
  categories: string[] = ['Beef', 'Chicken', 'Dessert', 'Lamb', 'Side', 'Seafood', 'Vegetarian'];

  // --- Modal & UI State Management ---
  selectedProduct: any = null;
  isModalOpen = false; 
  isCartOpen = false;
  showSuccessModal = false;
  showDeleteModal = false;

  // --- Shopping List Properties ---
  shoppingList: any[] = [];
  cartCount = 0;

  constructor(
    private productService: ProductService, 
    private cdr: ChangeDetectorRef, 
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadShoppingList();
  }

  /**
   * Fetches products from the internal database with pagination and filters
   */
  loadProducts() {
    this.isLoading = true;
    this.productService.getInternalProducts(
      this.currentPage, 
      this.pageSize, 
      this.selectedCategory, 
      this.searchName
    ).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.products = res.data.items;
          this.totalElements = res.data.totalElements;
          this.totalPages = res.data.totalPages;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => this.isLoading = false
    });
  }

  /**
   * Resets pagination and triggers search
   */
  onSearch() {
    this.currentPage = 0;
    this.loadProducts();
  }

  /**
   * Displays detailed information about a specific product in a modal
   * @param event Mouse event to prevent bubbling
   * @param productId Unique identifier of the product
   */
  viewDetails(event: Event, productId: number) {
    event.preventDefault(); 
    event.stopPropagation(); // Prevents event from bubbling to parent elements

    this.isModalOpen = true; 
    this.selectedProduct = null; // Resetting previous data for a clean view

    // Disabling background scroll while modal is active
    document.body.style.overflow = 'hidden';

    this.productService.getProductById(productId).subscribe({
      next: (res) => {
        if (res.success) {
          this.selectedProduct = res.data;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error fetching meal details:', err);
        this.closeModal();
      }
    });
  }

  /**
   * Retrieves the current user's shopping list and updates the cart counter
   */
  loadShoppingList() {
    this.productService.getShoppingList().subscribe({
      next: (res) => {
        if (res.success) {
          this.shoppingList = res.data; 
          this.cartCount = this.shoppingList.length;
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Error loading shopping list:', err)
    });
  }

  /**
   * Adds a product to the user's shopping list with immediate UI feedback
   * @param productId Unique identifier of the product
   */
  addToCart(productId: number) {
    this.productService.addToShoppingList(productId).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadShoppingList(); // Refreshing cart count
          
          this.showSuccessModal = true;
          this.cdr.detectChanges();

          // Auto-hide success feedback after 1.5 seconds
          setTimeout(() => {
            this.showSuccessModal = false;
            this.cdr.detectChanges();
          }, 1500);
        }
      }
    });
  }

  /**
   * Removes an item from the shopping list and provides UI notification
   * @param productId Unique identifier of the product to be removed
   */
  removeItem(productId: number) {
    this.productService.removeFromShoppingList(productId).subscribe({
      next: () => {
        // Optimistic UI update: filtering list locally before server sync if needed
        this.shoppingList = this.shoppingList.filter(item => item.id !== productId);
        this.cartCount = this.shoppingList.length;

        this.showDeleteModal = true;
        this.cdr.detectChanges();

        // Auto-hide deletion feedback after 1.5 seconds
        setTimeout(() => {
          this.showDeleteModal = false;
          this.cdr.detectChanges();
        }, 1500);
      },
      error: (err) => {
        console.error('Delete operation failed:', err);
      }
    });
  }

  /**
   * Toggles the visibility of the shopping list sidebar
   */
  toggleShoppingList() {
    this.isCartOpen = !this.isCartOpen;
    if (this.isCartOpen) this.loadShoppingList();
  }

  /**
   * Closes the product details modal and restores page scrolling
   */
  closeModal() {
    this.isModalOpen = false;
    document.body.style.overflow = 'auto'; 
  }

  // --- Pagination Control Methods ---

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadProducts();
    }
  }

  /**
   * Handles page size adjustments and resets to the first page
   */
  onPageSizeChange() {
    this.currentPage = 0; 
    this.loadProducts();
  }

  /**
   * Terminates the user session and redirects to the login page
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
        localStorage.clear(); // Clearing authentication tokens and session data
        this.router.navigate(['/login']);
      }
    });
  }
}