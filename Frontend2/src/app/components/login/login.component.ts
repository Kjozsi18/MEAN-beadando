import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../shared/api.service';

import SHA256 from 'crypto-js/sha256';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(private api: ApiService, private router:Router) {}
  ngOnInit(): void {}

  onLogin() {
    if (this.loginForm.invalid) {
      alert("Kérlek, töltsd ki az összes mezőt!");
      return;
    }

    const email = this.loginForm.get("email")?.value!;
    const password = this.loginForm.get("password")?.value!;

    const hashedPassword = SHA256(password).toString();

    this.api.loginUser(email, hashedPassword).subscribe({
      next: (res) => {
        alert("Sikeres bejelentkezés!");
        localStorage.setItem('user', JSON.stringify(res));
        //console.log(localStorage.getItem('user'));
        this.router.navigate(['/dashboard']);

      },
      error: (err) => {
        console.error(err);
        alert("Hiba történt a bejelentkezés során.");
      }
    });
    
  }

  goRegister(){
    this.router.navigate(['/registration']);
  }
}
