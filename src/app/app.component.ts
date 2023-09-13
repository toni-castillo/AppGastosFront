import { Component } from '@angular/core';
import { UsuariosService } from './services/usuarios.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app-gastos';
  currentRoleUser: string | undefined;

  constructor(
    private usuariosService: UsuariosService
  ) {
    this.usuariosService.currentRoleUser.subscribe(x => this.currentRoleUser = x);
  }
}
