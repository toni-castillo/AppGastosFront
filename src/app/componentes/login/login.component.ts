import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formulario!: FormGroup;
  hide = true;
  err: boolean = false;
  mensaje: string = "";
  role: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    private router: Router) {
  }


  ngOnInit(): void {
    this.initForm();
  }

  // async getDataForm() {
  //   const user = { email: this.formulario.value.email, password: this.formulario.value.password };

  //   this.usuariosService.login(user).subscribe({
  //     next: (token) => {
  //       this.usuariosService.setToken(token);

  //       this.usuariosService.getUserByToken(token).subscribe({
  //         next: (respuesta) => {
  //           this.usuariosService.loginCheck(true, respuesta.role, respuesta.name + ' ' + respuesta.surname);

  //           if (respuesta.role === 'employee') {
  //             this.router.navigate(['/empleado']);
  //           } else {
  //             this.router.navigate(['/validador']);
  //           }
  //         },
  //         error: (error) => {
  //           console.log('Error getUserByToken: ', error);
  //         }
  //       });

  //       this.err = false;
  //     },
  //     error: (err) => {
  //       this.err = true;
  //       console.log('Error login: ', err);

  //       if (err.status == 401) {
  //         this.mensaje = "Usuario o clave incorrectos";
  //       } else {
  //         this.mensaje = "Ha habido un problema, intentalo más tarde."
  //       }
  //     }
  //   });
  // }

  async getDataForm() {
    const user = { email: this.formulario.value.email, password: this.formulario.value.password };

    this.usuariosService.login(user).subscribe({
      next: (loginResponse) => {

        console.log('loginResponse.token', loginResponse.token);

        this.usuariosService.setToken(loginResponse.token);

        this.usuariosService.getUserByToken(loginResponse.token).subscribe({
          next: (respuesta) => {
            this.usuariosService.loginCheck(true, respuesta.role, respuesta.name + ' ' + respuesta.surname);

            if (respuesta.role === 'employee') {
              this.router.navigate(['/empleado']);
            } else {
              this.router.navigate(['/validador']);
            }
          },
          error: (error) => {
            console.log('Error getUserByToken: ', error);
          }
        });

        this.err = false;
      },
      error: (err) => {
        this.err = true;
        console.log('Error login: ', err);

        if (err.status == 401) {
          this.mensaje = "Usuario o clave incorrectos";
        } else {
          this.mensaje = "Ha habido un problema, intentalo más tarde."
        }
      }
    });
  }

  initForm() {
    this.formulario = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
        password: ['', [Validators.required]]
      }
    );
  }

  checkControl(pFiel: string, pValidator: string): boolean {
    if (this.formulario.get(pFiel)?.hasError(pValidator) && this.formulario.get(pFiel)?.touched) {
      return true
    } else {
      return false
    }
  }
}