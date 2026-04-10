import { Component, OnInit } from '@angular/core';
import { PrescriptionService } from '../../../services/prescription.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-upload-prescription',
  templateUrl: './upload-prescription.component.html',
  styleUrls: ['./upload-prescription.component.css']
})
export class UploadPrescriptionComponent implements OnInit {

  file!: File;
  userId: number = 0;

  prescriptions: any[] = [];

  constructor(private prescriptionService: PrescriptionService,private authService: AuthService) {}

  ngOnInit() {
  const user = this.authService.getUser();   

  if (user) {
    this.userId = user.id;   
  }

  console.log("Logged in user:", user);
  console.log("User ID:", this.userId);

  this.loadPrescriptions();
}

  onFileChange(event: any) {
    this.file = event.target.files[0];
  }

  upload() {
    if (!this.file) {
      alert("Please select a file");
      return;
    }

    this.prescriptionService.upload(this.file)
      .subscribe({
        next: () => {
          alert("Prescription uploaded successfully");
          this.loadPrescriptions();   // ✅ refresh
        },
        error: () => alert("Upload failed")
      });
  }

  loadPrescriptions() {
    this.prescriptionService.getMyPrescriptions()
      .subscribe(data => {
        this.prescriptions = data as any[];   
      });
  }
}