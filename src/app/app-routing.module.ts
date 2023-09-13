import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpleadoComponent } from './componentes/empleado/empleado.component';
import { FormularioViajeComponent } from './componentes/formularios/formulario-viaje/formulario-viaje.component';
import { FormularioCompraComponent } from './componentes/formularios/formulario-compra/formulario-compra.component';
import { LoginComponent } from './componentes/login/login.component';
import { ValidadorComponent } from './componentes/validador/validador.component';
import { DetalleGastoComponent } from './componentes/validador/detalle-gasto/detalle-gasto.component';
import { DetalleGastoEmpleadoComponent } from './componentes/empleado/detalle-gasto-empleado/detalle-gasto-empleado.component';
import { FormularioGastoComponent } from './componentes/formularios/formulario-gasto/formulario-gasto.component';
import { FormularioFormacionComponent } from './componentes/formularios/formulario-formacion/formulario-formacion.component';
import { RoleGuard } from './guards/role.guard';


const routes: Routes = [
  { path: "", pathMatch: 'full', redirectTo: '/login' },
  { path: "login", component: LoginComponent },
  { path: "empleado", component: EmpleadoComponent, canActivate: [RoleGuard], data: { pRole: 'employee' } },
  { path: "empleado/viaje", component: FormularioViajeComponent, canActivate: [RoleGuard], data: { pRole: 'employee' } },
  { path: "empleado/viaje/:id", component: FormularioViajeComponent, canActivate: [RoleGuard], data: { pRole: 'employee' } },
  { path: "empleado/compra", component: FormularioCompraComponent, canActivate: [RoleGuard], data: { pRole: 'employee' } },
  { path: "empleado/compra/:id", component: FormularioCompraComponent, canActivate: [RoleGuard], data: { pRole: 'employee' } },
  { path: "empleado/gasto", component: FormularioGastoComponent, canActivate: [RoleGuard], data: { pRole: 'employee' } },
  { path: "empleado/gasto/:id", component: FormularioGastoComponent, canActivate: [RoleGuard], data: { pRole: 'employee' } },
  { path: "empleado/formacion", component: FormularioFormacionComponent, canActivate: [RoleGuard], data: { pRole: 'employee' } },
  { path: "empleado/formacion/:id", component: FormularioFormacionComponent, canActivate: [RoleGuard], data: { pRole: 'employee' } },
  { path: "empleado/:id", component: DetalleGastoEmpleadoComponent, canActivate: [RoleGuard], data: { pRole: 'employee' } },
  { path: "validador", component: ValidadorComponent, canActivate: [RoleGuard], data: { pRole: 'validator' } },
  { path: "validador/:id", component: DetalleGastoComponent, canActivate: [RoleGuard], data: { pRole: 'validator' } },
  { path: "**", redirectTo: "/login" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
