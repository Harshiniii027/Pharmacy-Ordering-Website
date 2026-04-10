import { Component, OnInit } from '@angular/core';
import { MedicineService, Medicine, Category } from '../../../services/medicine.service';

@Component({
  selector: 'app-admin-medicines',
  templateUrl: './admin-medicines.component.html',
  styleUrls: ['./admin-medicines.component.css']
})
export class AdminMedicinesComponent implements OnInit {
  medicines: Medicine[] = [];
  categories: Category[] = [];
  loading = true;
  saving = false;
  editingMedicine: Medicine | null = null;
  
  medicineData: any = {
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    dosage: '',
    packaging: '',
    requiresPrescription: false,
    categoryId: 0,
    manufacturer: ''
  };

  constructor(private medicineService: MedicineService) {}

  ngOnInit() {
    this.loadMedicines();
    this.loadCategories();
  }

  loadMedicines() {
    this.medicineService.getMedicines().subscribe({
      next: (data) => {
        this.medicines = data;
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

  editMedicine(medicine: Medicine) {
    this.editingMedicine = medicine;
    this.medicineData = { ...medicine };
    const modal = document.getElementById('addMedicineModal');
    if (modal) {
      // @ts-ignore
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();
    }
  }

  saveMedicine() {
    this.saving = true;
    if (this.editingMedicine) {
      this.medicineService.updateMedicine(this.editingMedicine.id, this.medicineData).subscribe({
        next: () => {
          this.saving = false;
          this.loadMedicines();
          this.closeModal();
          alert('Medicine updated successfully');
        },
        error: (error) => {
          this.saving = false;
          alert('Failed to update medicine');
        }
      });
    } else {
      this.medicineService.createMedicine(this.medicineData).subscribe({
        next: () => {
          this.saving = false;
          this.loadMedicines();
          this.closeModal();
          alert('Medicine added successfully');
        },
        error: (error) => {
          this.saving = false;
          alert('Failed to add medicine');
        }
      });
    }
  }

  deleteMedicine(id: number) {
    if (confirm('Are you sure you want to delete this medicine?')) {
      this.medicineService.deleteMedicine(id).subscribe({
        next: () => {
          this.loadMedicines();
          alert('Medicine deleted successfully');
        },
        error: (error) => {
          alert('Failed to delete medicine');
        }
      });
    }
  }

  closeModal() {
    this.editingMedicine = null;
    this.medicineData = {
      name: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      dosage: '',
      packaging: '',
      requiresPrescription: false,
      categoryId: 0,
      manufacturer: ''
    };
    const modal = document.getElementById('addMedicineModal');
    if (modal) {
      // @ts-ignore
      const bsModal = bootstrap.Modal.getInstance(modal);
      if (bsModal) bsModal.hide();
    }
  }
}