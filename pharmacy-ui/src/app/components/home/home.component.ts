import { Component, OnInit } from '@angular/core';
import { MedicineService } from '../../services/medicine.service';
import { Medicine } from '../../models/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredMedicines: Medicine[] = [];
  categories: any[] = [];

  constructor(private medicineService: MedicineService) {}

  ngOnInit() {
    this.loadFeaturedMedicines();
    this.loadCategories();
  }

  loadFeaturedMedicines() {
    this.medicineService.getMedicines().subscribe(data => {
      this.featuredMedicines = data.slice(0, 6);
    });
  }

  loadCategories() {
    this.medicineService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }
}