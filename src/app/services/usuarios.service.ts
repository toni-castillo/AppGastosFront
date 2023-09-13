import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, lastValueFrom, map, Observable, Subject } from 'rxjs';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { LoginResponse } from '../interfaces/loginResponse.interface';
import { Usuario } from '../interfaces/usuario.interface';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private baseUrl: string;
  private logged$: Subject<boolean>;
  private role$: Subject<string>;
  role: string;
  private fullName$: Subject<string>;

  private currentRoleUserSubject: BehaviorSubject<any>;
  public currentRoleUser: Observable<string>;

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) {
    this.baseUrl = 'http://localhost:3000/api/users';
    this.logged$ = new Subject();
    this.role$ = new Subject();
    this.role = '';
    this.fullName$ = new Subject();

    this.currentRoleUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentRoleUser')!));
    this.currentRoleUser = this.currentRoleUserSubject.asObservable();
  }

  public get currentRoleUserValue(): any {
    return this.currentRoleUserSubject.value;
  }

  // login(pFormulario: LoginRequest): Observable<any> {
  //   return this.httpClient.post<LoginResponse>(`${this.baseUrl}/login`, pFormulario);

  login(pFormulario: LoginRequest): Observable<any> {
    return this.httpClient.post<LoginResponse>(`${this.baseUrl}/login`, pFormulario)
      .pipe(map(loginResponse => {
        if (loginResponse.token && loginResponse.role) {
          localStorage.setItem('currentRoleUser', JSON.stringify(loginResponse.role));
          this.currentRoleUserSubject.next(loginResponse.role);
        }
        return loginResponse;
      }))
  }

  logout() {
    this.cookieService.delete('token', '/');
    localStorage.removeItem('currentRoleUser');
    this.currentRoleUserSubject.next(null);
  }

  getAll(): Promise<Usuario[]> {
    return lastValueFrom(this.httpClient.get<Usuario[]>(this.baseUrl));
  }

  async getAllDepartments(): Promise<string[]> {
    let arrDepartamentos = await this.getAll();
    let departamentosInArr: string[] = arrDepartamentos.map(user => user.department[0].toUpperCase() + user.department.slice(1));

    departamentosInArr = [...new Set(departamentosInArr)]; // new Set elimina elementos duplicados del array

    return departamentosInArr;
  }

  loginCheck(pLogged: boolean, pRole: any, pFullName: any) {
    this.logged$.next(pLogged);
    console.log('loginCheck pLogged res:', pLogged);
    this.role$.next(pRole);
    console.log('loginCheck pRole res:', pRole);
    this.role = pRole;
    this.fullName$.next(pFullName);
    console.log('loginCheck pFullName res:', pFullName);
  }

  getLogged() {
    return this.logged$.asObservable();
  }

  getRole() {
    return this.role$.asObservable();
  }

  getFullName() {
    return this.fullName$.asObservable();
  }

  setToken(token: string) {
    this.cookieService.set("token", token);
  }

  getToken() {
    return this.cookieService.get("token");
  }

  getUserByToken(token: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/profile`, {
      headers: {
        authorization: token
      }
    });
  }

}