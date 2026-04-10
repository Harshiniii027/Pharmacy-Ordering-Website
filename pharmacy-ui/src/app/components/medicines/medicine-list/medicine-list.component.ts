import { Component, OnInit } from '@angular/core';
import { MedicineService } from '../../../services/medicine.service';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';
import { Medicine, Category } from '../../../models/models';

@Component({
  selector: 'app-medicine-list',
  templateUrl: './medicine-list.component.html',
  styleUrls: ['./medicine-list.component.css']
})
export class MedicineListComponent implements OnInit {
  medicines: Medicine[] = [];
  categories: Category[] = [];
  filteredMedicines: Medicine[] = [];
  selectedCategoryId: number | null = null;
  searchTerm: string = '';
  prescriptionFilter: boolean | null = null;
  loading: boolean = true;

  constructor(
    private medicineService: MedicineService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadMedicines();
    this.loadCategories();
  }

  loadMedicines() {
    this.loading = true;
    this.medicineService.getMedicines().subscribe({
      next: (data) => {
        this.medicines = data;
        this.filterMedicines();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading medicines:', error);
        this.loading = false;
      }
    });
  }

  loadCategories() {
    this.medicineService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  filterMedicines() {
    this.filteredMedicines = this.medicines.filter(medicine => {
      const matchesCategory = !this.selectedCategoryId || medicine.categoryId === this.selectedCategoryId;
      const matchesSearch = !this.searchTerm || 
        medicine.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        medicine.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesPrescription = this.prescriptionFilter === null || 
        medicine.requiresPrescription === this.prescriptionFilter;
      return matchesCategory && matchesSearch && matchesPrescription;
    });
  }

  onCategoryChange(categoryId: number | null) {
    this.selectedCategoryId = categoryId;
    this.filterMedicines();
  }

  onSearch() {
    this.filterMedicines();
  }

  clearFilters() {
    this.selectedCategoryId = null;
    this.searchTerm = '';
    this.prescriptionFilter = null;
    this.filterMedicines();
  }

  addToCart(medicine: Medicine) {
    if (!this.authService.isLoggedIn()) {
      alert('Please login to add items to cart');
      return;
    }
    
    this.cartService.addToCart({
      id: medicine.id,
      name: medicine.name,
      price: medicine.price,
      quantity: 1,
      requiresPrescription: medicine.requiresPrescription,
      stockQuantity: medicine.stockQuantity
    });
    
    alert(`${medicine.name} added to cart!`);
  }
}