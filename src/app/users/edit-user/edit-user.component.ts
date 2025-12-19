import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User, UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  userForm: FormGroup;
  roles = ['MOBILE', 'WEB'];
  statuses = ['Active', 'Inactive'];
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public user: User,
    private userService: UsersService,
    private dialogRef: MatDialogRef<EditUserComponent>
  ) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      username: [this.user.username],
      nom: [this.user.nom],
      prenom: [this.user.prenom],
      poste: [this.user.poste],
      status: [this.user.status],
      appUserRole: [this.user.appUserRole]
    });
  }

  editUser() {
    if (this.userForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      // Créer un objet avec seulement les champs modifiés (non vides)
      const updatedData: any = {};
      
      Object.keys(this.userForm.value).forEach(key => {
        const newValue = this.userForm.value[key];
        const oldValue = this.user[key];
        
        // Ne garder que les champs modifiés ET non vides
        if (newValue !== oldValue && newValue !== '' && newValue !== null) {
          updatedData[key] = newValue;
        }
      });

      // Si aucun champ n'a été modifié, fermer le dialogue
      if (Object.keys(updatedData).length === 0) {
        this.close();
        return;
      }

      // IMPORTANT: Envoyer seulement les champs à modifier
      this.userService.updateUser(updatedData, this.user.id).subscribe({
        next: (updatedUser) => {
          console.log('Utilisateur mis à jour', updatedUser);
          
          // Retourner l'utilisateur mis à jour
          this.close({
            ...this.user, // Garder les anciennes données
            ...updatedData, // Ajouter les nouvelles
            // Si le backend retourne l'utilisateur complet, utilisez:
            // ...updatedUser
          });
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour', err);
          this.isLoading = false;
          this.errorMessage = err.message || 'Erreur lors de la mise à jour';
        }
      });
    }
  }

  close(updatedUser?: User) {
    this.dialogRef.close(updatedUser);
  }
}