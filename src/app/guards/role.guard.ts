import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuariosService } from '../services/usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  isLogged: boolean;
  // role: string;
  token: string;

  constructor(
    private router: Router,
    private usuariosService: UsuariosService
  ) {
    this.isLogged = false;
    // this.role = this.usuariosService.role; // Esto comentado de ahora
    this.token = '';
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const currentRoleUser = this.usuariosService.currentRoleUserValue;
    console.log('currentRoleUser role.guard', currentRoleUser);


    if (this.usuariosService.getToken()) {
      console.log('comprobar si la ruta está restringida por el rol');
      if (next.data['pRole'] && next.data['pRole'].indexOf(currentRoleUser) === -1) {
        console.log('rol no autorizado, redirigir a la página de inicio');

        if (currentRoleUser === 'employee') {
          this.router.navigate(['/empleado']);
          return false;
        } else {
          this.router.navigate(['/validador']);
          return false;
        }
      }
      console.log('autorizado por lo que devuelve true');
      return true;
    }

    this.router.navigate(['/login']);
    console.log('no ha iniciado la sesión así que redirige a la página de inicio de sesión con la url de retorno');
    return false;
  }

  //* FUNCIONA
  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

  //   const currentRoleUser = this.usuariosService.currentRoleUserValue;
  //   console.log('currentRoleUser role.guard', currentRoleUser);


  //   if (this.usuariosService.getToken()) {
  //     console.log('comprobar si la ruta está restringida por el rol');
  //     if (next.data['pRole'] && next.data['pRole'].indexOf(currentRoleUser) === -1) {
  //       console.log('rol no autorizado, redirigir a la página de inicio');
  //       this.router.navigate(['/']);
  //       return false;
  //     }
  //     console.log('autorizado por lo que devuelve true');
  //     return true;
  //   }

  //   this.router.navigate(['/login']);
  //   console.log('no ha iniciado la sesión así que redirige a la página de inicio de sesión con la url de retorno');
  //   return false;
  // }


  //* Actual
  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

  //   console.log('Estoy en role.guards.ts 1 y este es el rol', this.role);

  //   if (this.usuariosService.getToken()) {
  //     if (this.usuariosService.role === next.data['pRole']) {

  //       console.log('Estoy en role.guards.ts 2 y este es el rol', this.role);
  //       return true;
  //     } else {
  //       console.log('this.usuariosService.role', this.usuariosService.role);
  //       if (this.usuariosService.role === 'employee') {
  //         this.router.navigate(['/empleado'])
  //         console.log('Estoy en role.guards.ts 3 y este es el rol', this.role);
  //         return true;
  //       } else {
  //         this.router.navigate(['/validador'])
  //         console.log('Estoy en role.guards.ts 4 y este es el rol', this.role);
  //         return true;
  //       }

  //     }
  //   } else {
  //     this.router.navigate(['/login'])
  //     this.isLogged = false;
  //     this.usuariosService.loginCheck(false, '', '');
  //     console.log('Estoy en role.guards.ts 5');
  //     return true
  //   }
  // }


  //* Vieja
  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   // let url: string = state.url;
  //   return this.checkUserRole(next);
  // }

  // checkUserRole(next: ActivatedRouteSnapshot): boolean {
  //   if (this.usuariosService.getToken()) {

  //     this.usuariosService.getRole().subscribe((pRole) => {
  //       this.role = pRole;
  //     });

  //   } else {
  //     this.router.navigate(['/login'])
  //     this.isLogged = false;
  //     this.usuariosService.loginCheck(false, '', '');
  //   }

  //   if (this.role === next.data['pRole']) {
  //     return true;
  //   } else {
  //     if (this.role === 'employee') {
  //       this.router.navigate(['/empleado'])
  //       return false;
  //     } else {
  //       this.router.navigate(['/validador'])
  //       return false;
  //     }
  //   }
  // }

}
