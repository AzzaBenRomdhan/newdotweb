import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
})
export class AddUserDialogComponent {
  userForm: FormGroup;
  roles = ['MOBILE', 'WEB'];
  statuses = ['Active', 'Inactive'];

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private dialogRef: MatDialogRef<AddUserDialogComponent>
  ) {
    this.userForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    poste: ['', Validators.required],
    status: ['Active', Validators.required],
    appUserRole: ['', Validators.required]
    });
  }

saveUser(): void {
  if (this.userForm.invalid) {
    this.userForm.markAllAsTouched(); // 🔥 force l’affichage des erreurs
    return;
  }

  const user: User = { ...this.userForm.value };

  this.userService.createUser(user).subscribe({
    next: (createdUser) => this.dialogRef.close(createdUser),
    error: (err) => console.error(err)
  });
}


  close(): void {
    this.dialogRef.close(false);
  }
}
