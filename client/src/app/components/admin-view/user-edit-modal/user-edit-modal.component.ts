import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-edit-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './user-edit-modal.component.html',
  styleUrls: ['./user-edit-modal.component.scss']
})
export class UserEditModalComponent {
  userForm: FormGroup;
  isEditMode: boolean;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!data.id;

    this.userForm = this.fb.group({
      id: [data.id || ''],
      firstName: [data.firstName || '', Validators.required],
      lastName: [data.lastName || '', Validators.required],
      email: [data.email || '', [Validators.required, Validators.email]],
      password: [data.password, this.isEditMode ? null : Validators.required],
      role: [data.role || 'User', Validators.required]
    });
  }

  onSave(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      // For new users, remove the empty ID field
      const result = this.isEditMode ? formValue : (({ id, ...rest }) => rest)(formValue);
      this.dialogRef.close(result);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}