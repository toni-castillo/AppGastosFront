import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { FormularioGasto } from '../interfaces/formularioGasto.interface';
import { UsuariosService } from './usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class GastosService {

  baseUrl: string
  token: string;

  constructor(
    private httpClient: HttpClient,
    private usuariosService: UsuariosService
  ) {
    this.baseUrl = 'http://localhost:3000/api/expenses';
    this.token = '';
  }

  create(pFormulario: FormData): Promise<any> {
    this.token = this.usuariosService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        authorization: this.token!
      })
    }

    return lastValueFrom(
      this.httpClient.post<any>(`${this.baseUrl}/create`, pFormulario, httpOptions)
    )
  }

  getAll(): Promise<any[]> {
    return lastValueFrom(this.httpClient.get<any[]>(this.baseUrl));
  }

  updateById(id: number, formularioCompra: FormularioGasto): Promise<any[]> {
    this.token = this.usuariosService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        authorization: this.token!
      })
    }
    return lastValueFrom(this.httpClient.put<any[]>(`${this.baseUrl}/${id}`, formularioCompra, httpOptions));
  }
}
