import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../../../services/user.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  loading = true;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  updateRole(userId: number, role: string) {
    this.userService.updateUserRole(userId, role).subscribe({
      next: () => {
        alert('User role updated successfully');
        this.loadUsers();
      },
      error: (error) => {
        alert('Failed to update user role');
      }
    });
  }

  getRoleBadgeClass(role: string): string {
    return role === 'Admin' ? 'bg-danger' : 'bg-primary';
  }
}