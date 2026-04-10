import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;
  profileData = {
    fullName: '',
    phone: '',
    email: ''
  };
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  updating = false;
  changingPassword = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    if (this.user) {
      this.profileData = {
        fullName: this.user.fullName,
        phone: this.user.phone,
        email: this.user.email
      };
    }
  }

  updateProfile() {
    this.updating = true;
    // API call to update profile
    setTimeout(() => {
      this.updating = false;
      alert('Profile updated successfully');
    }, 1000);
  }

  changePassword() {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    this.changingPassword = true;
    // API call to change password
    setTimeout(() => {
      this.changingPassword = false;
      alert('Password changed successfully');
      this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
    }, 1000);
  }
}