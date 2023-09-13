import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { FormularioViaje } from '../interfaces/formularioViaje.interface';
import { UsuariosService } from './usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class ViajesService {

  baseUrl: string;
  token: string;

  constructor(
    private httpClient: HttpClient,
    private usuariosService: UsuariosService
  ) {
    this.baseUrl = 'http://localhost:3000/api/trips';
    this.token = '';
  }

  create(formValue: FormularioViaje) {
    this.token = this.usuariosService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        authorization: this.token!
      })
    }
    return lastValueFrom(
      this.httpClient.post<any>(`${this.baseUrl}/create`, formValue, httpOptions)
    );

  }

  getAll(): Promise<any[]> {
    this.token = this.usuariosService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        authorization: this.token!
      })
    }
    return lastValueFrom(this.httpClient.get<any[]>(this.baseUrl, httpOptions));
  }

  updateById(id: number, formularioViaje: FormularioViaje): Promise<any[]> {
    this.token = this.usuariosService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        authorization: this.token!
      })
    }
    return lastValueFrom(this.httpClient.put<any[]>(`${this.baseUrl}/${id}`, formularioViaje, httpOptions));
  }


}
