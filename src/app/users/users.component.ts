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
  users: User[] = [];
  errorMessage: string = '';
  isLoading = true;

  constructor(
    private userService: UsersService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

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

  editUserDialog(user: User): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '500px',
      data: user
    });

    dialogRef.afterClosed().subscribe((updatedUser: User) => {
      if (updatedUser) {
        // Mettre à jour l'utilisateur dans le tableau local
        this.updateUserInList(updatedUser);
      }
    });
  }

  // Méthode pour mettre à jour l'utilisateur dans le tableau
  updateUserInList(updatedUser: User): void {
    // Trouver l'index de l'utilisateur dans le tableau
    const index = this.users.findIndex(u => u.id === updatedUser.id);
    
    if (index !== -1) {
      // Mettre à jour l'utilisateur dans le tableau
      this.users[index] = {
        ...this.users[index], // Anciennes données
        ...updatedUser // Nouvelles données
      };
      
      // Alternative: Remplacer complètement l'élément
      // this.users[index] = updatedUser;
      
      // Créer une nouvelle référence du tableau pour déclencher le changement
      this.users = [...this.users];
      
      console.log('Utilisateur mis à jour localement:', this.users[index]);
    }
  }

  deleteUser(idOrUsername: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(idOrUsername).subscribe({
          next: () => {
            // Mettre à jour localement sans recharger
            this.removeUserFromList(idOrUsername);
          },
          error: err => this.errorMessage = 'Erreur lors de la suppression'
        });
      }
    });
  }

  // Méthode pour supprimer un utilisateur du tableau local
  removeUserFromList(idOrUsername: string): void {
    // Supprimer par ID
    this.users = this.users.filter(user => 
      user.id !== idOrUsername && user.username !== idOrUsername
    );
  }
}