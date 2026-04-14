import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../src/environments/environment';
import { Meal, ApiResponse } from '../meal.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseAdminUrl = `${environment.apiUrl}/api/admin/meals`;
  private baseUserUrl = `${environment.apiUrl}/api/meals`;

  constructor(private http: HttpClient) { }

  /**
   * Fetches product data from external API sources via the backend proxy
   * @param letter Search filter parameter
   */
  searchExternal(letter: string): Observable<any> {
    const token = localStorage.getItem('token'); 
    return this.http.get(`${this.baseAdminUrl}/external?letter=${letter}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  /**
   * Persists selected meal data to the internal database
   * Normalizes input to ensure payload is always sent as an array (Bulk Support)
   * @param data Single meal object or array of meals
   */
  approveMeal(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    
    // Normalization logic: Wrap single objects into an array to meet API requirements
    const finalData = Array.isArray(data) ? data : [data];

    return this.http.post(`${this.baseAdminUrl}/approve`, finalData, {
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      }
    });
  }

  /**
   * Retrieves approved products with filtering and pagination support
   * @param page Page index
   * @param size Number of items per page
   * @param category Optional category filter
   * @param name Optional name search filter
   */
  getInternalProducts(page: number = 0, size: number = 20, category: string = '', name: string = ''): Observable<any> {
    const token = localStorage.getItem('token');
    
    // Constructing query parameters for dynamic filtering
    let url = `${this.baseUserUrl}/approved?page=${page}&size=${size}`;
    if (category) url += `&category=${category}`;
    if (name) url += `&name=${name}`;

    return this.http.get(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  /**
   * Fetches full details for a specific approved product
   * @param id Product unique identifier
   */
  getProductById(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.baseUserUrl}/approved/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  /**
   * Permanently removes a product from the internal inventory (Admin only)
   * @param id Product ID to delete
   */
  deleteMeal(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(`${this.baseAdminUrl}/approved/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

  /**
   * Adds a product to the user's personal shopping list
   * @param productId Target product ID
   */
  addToShoppingList(productId: number): Observable<any> {
    // Sending empty body as parameters are handled via URL path
    return this.http.post(`${environment.apiUrl}/api/shopping-list/${productId}`, {});
  }

  /**
   * Removes a product from the user's shopping list
   * @param productId Target product ID
   */
  removeFromShoppingList(productId: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/api/shopping-list/${productId}`);
  }

  /**
   * Retrieves the complete shopping list for the current session
   */
  getShoppingList(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/shopping-list`);
  }

}