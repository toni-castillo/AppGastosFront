import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Expenses } from '../interfaces/expenses.interface';
import { UsuariosService } from './usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralValidadorService {

  baseUrl: string;
  token: string;

  constructor(
    private httpClient: HttpClient,
    private usuariosService: UsuariosService
  ) {
    this.baseUrl = 'http://localhost:3000/api/generalvalidator';
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

  updateById(id: number, nuevoEstado: string): Promise<any[]> {
    this.token = this.usuariosService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        authorization: this.token!
      })
    }
    return lastValueFrom(this.httpClient.put<any[]>(`${this.baseUrl}/${id}`, { 'isAccepted': nuevoEstado }, httpOptions));
  }

  updateByIdNote(id: number, note: string): Promise<any[]> {
    this.token = this.usuariosService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        authorization: this.token!
      })
    }
    return lastValueFrom(this.httpClient.put<any[]>(`${this.baseUrl}/${id}/refused`, { 'validator_note': note }, httpOptions));
  }
}