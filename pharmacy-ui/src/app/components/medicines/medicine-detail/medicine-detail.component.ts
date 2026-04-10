import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicineService } from '../../../services/medicine.service';
import { Medicine } from '../../../models/models';

@Component({
  selector: 'app-medicine-detail',
  templateUrl: './medicine-detail.component.html',
  styleUrls: ['./medicine-detail.component.css']
})
export class MedicineDetailComponent implements OnInit {
  medicine: Medicine | null = null;
  quantity: number = 1;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private medicineService: MedicineService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loadMedicine(id);
  }

  loadMedicine(id: number) {
    this.loading = true;
    this.medicineService.getMedicineById(id).subscribe({
      next: (data) => {
        this.medicine = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading medicine:', error);
        this.loading = false;
      }
    });
  }

  addToCart() {
    if (!this.medicine) return;
    
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === this.medicine?.id);
    
    if (existingItem) {
      existingItem.quantity += this.quantity;
    } else {
      cart.push({
        id: this.medicine.id,
        name: this.medicine.name,
        price: this.medicine.price,
        quantity: this.quantity,
        requiresPrescription: this.medicine.requiresPrescription,
        stockQuantity: this.medicine.stockQuantity
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${this.medicine.name} added to cart!`);
  }

  goBack() {
    this.router.navigate(['/shop']);
  }
}