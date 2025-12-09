import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User, UsersService } from 'app/services/users/users.service';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';
import { EditUserComponent } from './edit-user/edit-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: User[] = [];  // tableau pour stocker les utilisateurs
  errorMessage: string = '';
  isLoading = true;
  constructor(private userService: UsersService,
    private dialog: MatDialog) { }  // injection du service

  ngOnInit(): void {
    this.loadUsers();
  }

  // récupérer tous les utilisateurs
  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (data: User[]) => {
        this.users = data.reverse();
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de récupérer les utilisateurs';
        this.isLoading = false;
      }
    });
  }

 openAddUserDialog(): void {
  const dialogRef = this.dialog.open(AddUserDialogComponent, {
    width: '500px'
  });

  dialogRef.afterClosed().subscribe((newUser: User) => {
    if (newUser) {
      // Ajouter le nouvel utilisateur au début du tableau
      this.users.unshift(newUser);
    }
  });
}

 editUserDialog(user: User, usernameOrId: string): void {
  const dialogRef = this.dialog.open(EditUserComponent, {
    width: '500px',
    data: user
  });

  dialogRef.afterClosed().subscribe((newUser: User) => {
    /* if (newUser) {
      this.users.unshift(newUser);
    } */
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
