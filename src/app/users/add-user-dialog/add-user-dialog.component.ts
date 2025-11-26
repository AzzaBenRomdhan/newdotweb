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
  statuses = ['ACTIVE', 'DISABLED'];

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private dialogRef: MatDialogRef<AddUserDialogComponent>
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      poste: ['', Validators.required],
      status: ['ACTIVE', Validators.required],
      appUserRole: ['WEB', Validators.required],
    });
  }

  saveUser(): void {
    if (this.userForm.valid) {
      const user: User = {...this.userForm.value,  appUserRole: 'WEB' }
      this.userService.createUser(user).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error(err),
      });
    }
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
