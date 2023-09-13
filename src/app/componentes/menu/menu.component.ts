import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  isLogged: boolean;
  token: string;
  user: object;
  role: string;
  fullName: string;

  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
    private cookieService: CookieService
  ) {
    this.isLogged = false;
    this.token = '';
    this.user = {};
    this.role = '';
    this.fullName = '';
  }

  ngOnInit(): void {
    if (this.usuariosService.getToken()) {
      this.isLogged = true;
      this.token = this.usuariosService.getToken();

      this.usuariosService.getUserByToken(this.token).subscribe({
        next: (respuesta) => {
          this.user = respuesta;
          this.role = respuesta.role;
          this.fullName = respuesta.name + ' ' + respuesta.surname;
        }
      });
    } else {
      this.router.navigate(['/login'])
      this.isLogged = false;
      this.usuariosService.loginCheck(false, '', '');
    }

    this.usuariosService.getLogged().subscribe((pLogged) => {
      this.isLogged = pLogged;
      console.log('isLogged menu: ', this.isLogged);
    });

    this.usuariosService.getRole().subscribe((pRole) => {
      this.role = pRole;
      console.log('role menu: ', this.role);
    });

    this.usuariosService.getFullName().subscribe((pFullName) => {
      this.fullName = pFullName;
      console.log('fullName menu: ', this.fullName);
    });
  }

  async onClickLogout() {
    const result = await Swal.fire({
      title: 'Cerrando sesión',
      text: "¿Quieres salir de la aplicación?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, quiero salir',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      this.usuariosService.logout();
      this.usuariosService.loginCheck(false, '', '');
      this.router.navigate(['/login']);
    }
  }

}
