import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { FormularioCompra } from '../interfaces/formularioCompra.interface';
import { UsuariosService } from './usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  baseUrl: string
  token: string;

  constructor(
    private httpClient: HttpClient,
    private usuariosService: UsuariosService
  ) {
    this.baseUrl = 'http://localhost:3000/api/purchases';
    this.token = '';
  }

  create(pFormulario: FormularioCompra): Promise<any> {
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
    this.token = this.usuariosService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        authorization: this.token!
      })
    }
    return lastValueFrom(this.httpClient.get<any[]>(this.baseUrl, httpOptions));
  }

  updateById(id: number, formularioCompra: FormularioCompra): Promise<any[]> {
    this.token = this.usuariosService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        authorization: this.token!
      })
    }
    return lastValueFrom(this.httpClient.put<any[]>(`${this.baseUrl}/${id}`, formularioCompra, httpOptions));
  }
}

