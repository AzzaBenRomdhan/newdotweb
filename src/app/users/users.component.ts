import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User, UsersService } from 'app/services/users/users.service';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: User[] = [];  // tableau pour stocker les utilisateurs
  errorMessage: string = '';

  constructor(private userService: UsersService,
    private dialog: MatDialog) { }  // injection du service

  ngOnInit(): void {
    this.loadUsers();
  }

  // récupérer tous les utilisateurs
  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de récupérer les utilisateurs';
      }
    });
  }

  openAddUserDialog(): void {
  const dialogRef = this.dialog.open(AddUserDialogComponent, {
    width: '400px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.loadUsers(); // recharge la liste après ajout
    }
  });
 }
  deleteUser(idOrUsername: string): void {
    // ouvrir le dialog de confirmation
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(idOrUsername).subscribe({
          next: () => this.loadUsers(),
          error: err => this.errorMessage = 'Erreur lors de la suppression'
        });
      }
    });
  }
}
