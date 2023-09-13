import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UsuariosService } from '../services/usuarios.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private usuariosService: UsuariosService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if ([401, 403].indexOf(err.status) !== -1) {
        this.usuariosService.logout();
        location.reload();
      }

      const error = err.error.message || err.statusText;
      // const error = err.error.status || err.statusText;
      return throwError(() => new Error(error));
    }))
  }
}