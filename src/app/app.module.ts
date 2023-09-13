import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './componentes/login/login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';


import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { EmpleadoComponent } from './componentes/empleado/empleado.component';
import { ValidadorComponent } from './componentes/validador/validador.component';
import { FormularioCompraComponent } from './componentes/formularios/formulario-compra/formulario-compra.component';
import { FormularioViajeComponent } from './componentes/formularios/formulario-viaje/formulario-viaje.component';
import { MenuComponent } from './componentes/menu/menu.component';

import { CookieService } from 'ngx-cookie-service';
import { DetalleGastoComponent } from './componentes/validador/detalle-gasto/detalle-gasto.component';
import { DetalleGastoEmpleadoComponent } from './componentes/empleado/detalle-gasto-empleado/detalle-gasto-empleado.component';
import { FormularioGastoComponent } from './componentes/formularios/formulario-gasto/formulario-gasto.component';
import { FormularioFormacionComponent } from './componentes/formularios/formulario-formacion/formulario-formacion.component';
import { ErrorInterceptor } from './helpers/error.interceptor';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EmpleadoComponent,
    ValidadorComponent,
    FormularioViajeComponent,
    FormularioCompraComponent,
    MenuComponent,
    DetalleGastoComponent,
    DetalleGastoEmpleadoComponent,
    FormularioGastoComponent,
    FormularioFormacionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatTableModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    [DatePipe],
    [CookieService],
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
