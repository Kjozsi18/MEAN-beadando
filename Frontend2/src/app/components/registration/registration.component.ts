import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

import { ApiService } from '../../shared/api.service';
import { User } from '../../model/user';

import SHA256 from 'crypto-js/sha256';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  user: User = {
    _id: '',
    email: '',
    name: '',
    address: '',
    nickname: '',
    password: '',
    role: false
  }

  signUpForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    repassword: new FormControl('', Validators.required),
    nickname: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
  });

  constructor(private api: ApiService) {}
  ngOnInit(): void {}

  onSubmit() {
    if (this.signUpForm.invalid) {
      alert("Kérlek, töltsd ki az összes mezőt!");
      return;
    }

    const password = this.signUpForm.get("password")?.value;
    const repassword = this.signUpForm.get("repassword")?.value;

    if (password !== repassword) {
      alert("A két jelszó nem egyezik!");
      return;
    }

    // Hashelés SHA-256-tal
    const hashedPassword = SHA256(password!).toString();

    this.user.email = this.signUpForm.get("email")?.value!;
    this.user.name = this.signUpForm.get("name")?.value!;
    this.user.address = this.signUpForm.get("address")?.value!;
    this.user.nickname = this.signUpForm.get("nickname")?.value!;
    this.user.password = hashedPassword;

    this.api.createUser(this.user).subscribe({
      next: (res) => {
        alert("Sikeres regisztráció!");
        this.signUpForm.reset();
      },
      error: (err) => {
        console.error(err);
        alert("Hiba történt a regisztráció során.");
      }
    });
  }
}
