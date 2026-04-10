import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MedicineService } from '../../services/medicine.service';
import { Category, Medicine } from '../../models/models';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  featuredMedicines: Medicine[] = [];
  loading = true;
  showScrollButton = false;
  isLoggedIn: boolean = false;
  
  private subscriptions: Subscription = new Subscription();

  constructor(
    private medicineService: MedicineService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    
    this.subscriptions.add(
      this.authService.currentUser.subscribe(user => {
        this.isLoggedIn = !!user;
      })
    );
    
    this.loadData();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollButton = window.scrollY > 300;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  loadData() {
    this.subscriptions.add(
      this.medicineService.getCategories().subscribe({
        next: (data) => {
          this.categories = data.slice(0, 6);
        },
        error: (error) => console.error('Error loading categories:', error)
      })
    );

    this.subscriptions.add(
      this.medicineService.getMedicines().subscribe({
        next: (data) => {
          this.featuredMedicines = data.slice(0, 4);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading medicines:', error);
          this.loading = false;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}