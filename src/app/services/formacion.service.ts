import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { FormularioFormacion } from '../interfaces/formularioFormacion.interface';
import { UsuariosService } from './usuarios.service';


@Injectable({
  providedIn: 'root'
})
export class FormacionService {

  baseUrl: string;
  token: string;

  constructor(
    private httpClient: HttpClient,
    private usuariosService: UsuariosService
  ) {
    this.baseUrl = 'http://localhost:3000/api/trainings';
    this.token = '';
  }

  create(formValue: FormularioFormacion) {
    this.token = this.usuariosService.getToken();

    const httpOptions = {
      headers: new HttpHeaders({
        authorization: this.token!
      })
    }
    return lastValueFrom(
      this.httpClient.post(`${this.baseUrl}/create`, formValue, httpOptions)
    );

  }

  getAll(): Promise<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        authorization: localStorage.getItem('token')!
      })
    }
    return lastValueFrom(this.httpClient.get<any[]>(this.baseUrl, httpOptions));
  }

  updateById(id: number, formularioFormacion: FormularioFormacion): Promise<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        authorization: localStorage.getItem('token')!
      })
    }
    return lastValueFrom(this.httpClient.put<any[]>(`${this.baseUrl}/${id}`, formularioFormacion, httpOptions));
  }
}
