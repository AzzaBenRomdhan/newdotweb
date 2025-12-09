import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
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

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public user: User,
    private userService: UsersService,
    private dialogRef: MatDialogRef<EditUserComponent>
  ) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      username: [this.user.username, [this.usernameValidator.bind(this)]],
      nom: [this.user.nom],
      prenom: [this.user.prenom],
      poste: [this.user.poste],
      status: [this.user.status],
      appUserRole: [this.user.appUserRole]
    });
  }

  // Validator conditionnel pour username
  usernameValidator(control: AbstractControl) {
    const value = control.value;
    if (value !== this.user.username && (!value || value.length < 4)) {
      return { minlength: true };
    }
    return null;
  }

  editUser() {
    if (this.userForm.valid) {
      const updatedUser: User = { ...this.user };

      // On ne remplace que les champs modifiés
      Object.keys(this.userForm.value).forEach(key => {
        if (this.userForm.value[key] !== undefined && this.userForm.value[key] !== null) {
          updatedUser[key] = this.userForm.value[key];
        }
      });

      this.userService.updateUser(updatedUser, this.user.id).subscribe({
        next: (res) => {
          console.log('Utilisateur mis à jour', res);
          this.close(res);
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour', err);
        }
      });
    }
  }

  close(updatedUser?: User) {
    this.dialogRef.close(updatedUser);
  }
}
