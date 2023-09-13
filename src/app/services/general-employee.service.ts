import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Expenses } from '../interfaces/expenses.interface';
import { UsuariosService } from './usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralEmployeeService {

  baseUrl: string;
  token: string;

  constructor(
    private httpClient: HttpClient,
    private usuariosService: UsuariosService
  ) {
    this.baseUrl = 'http://localhost:3000/api/generalemployee';
    this.token = '';
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

  getById(id: number): Promise<Expenses> {
    this.token = this.usuariosService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        authorization: this.token!
      })
    }
    return lastValueFrom(this.httpClient.get<Expenses>(`${this.baseUrl}/${id}`, httpOptions));
  }

}
