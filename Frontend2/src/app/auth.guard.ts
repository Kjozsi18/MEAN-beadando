import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): boolean {
    // Csak akkor próbáljuk meg elérni a localStorage-ot, ha böngészőben futunk
    if (isPlatformBrowser(this.platformId)) {
      const isLoggedIn = !!localStorage.getItem('user');
      if (!isLoggedIn) {
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }

    // Alapértelmezés szerveroldalon: ne engedje be
    return false;
  }
}
