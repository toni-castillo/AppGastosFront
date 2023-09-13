import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';


@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private router: Router,
    private usuariosService: UsuariosService
  ) { }

  canActivate(): boolean {
    if (this.usuariosService.getToken()) {
      return true;
    } else {
      this.router.navigate(['/login'])
      return false;
    }
  }
}