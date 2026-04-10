import { Component, OnInit } from '@angular/core';
import { PrescriptionService } from '../../../services/prescription.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-upload-prescription',
  templateUrl: './upload-prescription.component.html',
  styleUrls: ['./upload-prescription.component.css']
})
export class UploadPrescriptionComponent implements OnInit {
  prescriptions: any[] = [];
  selectedFile: File | null = null;
  uploading = false;
  loading = true;
  userId: number = 0;

  constructor(
    private prescriptionService: PrescriptionService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadPrescriptions();
  }

  loadPrescriptions() {
    const user = this.authService.getUser();
    if (user) {
      this.userId = user.id;
      console.log("Logged in user:", user);
      console.log("User ID:", this.userId);
      
      this.prescriptionService.getUserPrescriptions(this.userId).subscribe({
        next: (data: any) => {
          this.prescriptions = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading prescriptions:', error);
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (allowedTypes.includes(file.type)) {
        this.selectedFile = file;
      } else {
        alert('Please upload JPEG, PNG, or PDF file');
        event.target.value = '';
      }
    }
  }

  uploadPrescription() {
    if (!this.selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    const user = this.authService.getUser();
    if (!user) {
      alert('Please login to upload prescription');
      return;
    }

    this.uploading = true;
    this.prescriptionService.uploadPrescription(user.id, this.selectedFile).subscribe({
      next: () => {
        this.uploading = false;
        alert('Prescription uploaded successfully');
        this.selectedFile = null;
        const fileInput = document.getElementById('prescriptionFile') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        this.loadPrescriptions();
      },
      error: (error) => {
        this.uploading = false;
        alert('Failed to upload prescription: ' + (error.error?.message || 'Unknown error'));
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-success';
      case 'rejected': return 'bg-danger';
      default: return 'bg-warning';
    }
  }
}