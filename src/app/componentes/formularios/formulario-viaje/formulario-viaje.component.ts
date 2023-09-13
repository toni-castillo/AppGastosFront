import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ViajesService } from 'src/app/services/viajes.service';
import { Expenses } from 'src/app/interfaces/expenses.interface';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { GeneralEmployeeService } from 'src/app/services/general-employee.service';

@Component({
  selector: 'app-formulario-viaje',
  templateUrl: './formulario-viaje.component.html',
  styleUrls: ['./formulario-viaje.component.css']
})
export class FormularioViajeComponent implements OnInit {

  formulario!: FormGroup;
  consumo: number = 0;
  minDate: Date = new Date();
  err: boolean = false;
  mensaje: string = "";
  datepicker!: MatNativeDateModule;
  arrDepartamentos: string[];
  expense: Expenses | undefined;
  isNewForm: boolean = true;



  constructor(
    private formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    private viajesService: ViajesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private generalEmployeeService: GeneralEmployeeService,
    private datePipe: DatePipe) {

    this.arrDepartamentos = new Array()

  }

  async ngOnInit(): Promise<void> {
    this.initForm();
    this.arrDepartamentos = await this.usuariosService.getAllDepartments();
    this.subcribeTransporte();
    this.subcribePernocta();
    this.activatedRoute.params.subscribe(async params => {
      let id = parseInt(params['id']);
      if (id) {
        this.isNewForm = false;
        this.recuperarFormulario(id);
      } else {
        this.isNewForm = true;
        console.log('formulario nuevo')
      }
    })


  }


  async getDataForm() {
    console.log(this.formulario.value)
    let body = this.formulario.value
    body.fechaSolicitud = body.fechaSolicitud.toISOString().slice(0, 10)
    body.fechaSalida = body.fechaSalida.toISOString().slice(0, 10)
    body.fechaRegreso = body.fechaRegreso.toISOString().slice(0, 10)
    if (!body.km) {
      body.km = null;
    };


    try {
      await this.viajesService.create(this.formulario.value)
      Swal.fire({
        icon: 'success',
        title: '¡Hurra!',
        text: 'Has registrado el gasto correctamente',
        confirmButtonText: 'Continuar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/empleado']);
        }
      })
        .catch(err => {
          console.log(err)
        });
    } catch (msg: any) {
      console.log(msg);
      Swal.fire({
        icon: 'error',
        title: 'Error' + ' ' + msg.status,
        text: msg.statusText,
        confirmButtonText: 'Aceptar'
      });
    }


  }

  initForm() {
    this.formulario = this.formBuilder.group(
      {
        fechaSolicitud: [new Date()],
        departamento: ['', [Validators.required]],
        codigo: ['', [Validators.required, Validators.maxLength(20)]],
        motivoGasto: ['', [Validators.required, Validators.maxLength(400)]],
        fechaSalida: ['', [Validators.required]],
        fechaRegreso: ['', [Validators.required]],
        pernocta: ['', [Validators.required]],
        hotel: ['', []],
        origen: ['', [Validators.required]],
        destino: ['', [Validators.required]],
        transporte: ['', [Validators.required]],
        km: ['', []],
        importe: ['', [Validators.required, Validators.min(0)]],
      }
    );
  }

  subcribeTransporte() {
    this.formulario.controls["transporte"].valueChanges.subscribe(newValue => {

      if (newValue === 'coche') {
        this.formulario.controls["km"].setValidators([Validators.required, Validators.min(0)])
        this.formulario.controls["km"].updateValueAndValidity()
      } else {
        this.formulario.controls["km"].clearValidators()
        this.formulario.controls["km"].updateValueAndValidity()
      }
    })
  }


  subcribePernocta() {
    this.formulario.controls["pernocta"].valueChanges.subscribe(newValue => {

      if (newValue === true) {
        this.formulario.controls["hotel"].setValidators(Validators.required)
        this.formulario.controls["hotel"].updateValueAndValidity()
      } else {
        this.formulario.controls["hotel"].clearValidators()
        this.formulario.controls["hotel"].updateValueAndValidity()
      }
    })
  }


  calculaConsumo($event: any): void {
    let km = $event.target.value;
    if (km === "") {
      km = 0;
    }
    let kmNumber = parseFloat(km);
    this.consumo = kmNumber * 0.19;
  }


  checkControl(pFiel: string, pValidator: string): boolean {
    if (this.formulario.get(pFiel)?.hasError(pValidator) && this.formulario.get(pFiel)?.touched) {
      return true
    } else {
      return false
    }
  }

  async recuperarFormulario(id: number) {

    this.expense = await this.generalEmployeeService.getById(id);
    let { department, project_code, reason, departure_date, return_date, overnight, hotel_link, trip_origin, trip_destination, means_transport, if_car_km, amount } = this.expense;
    let overnight_boolean = overnight === 1 ? true : false;

    this.formulario = this.formBuilder.group(
      {
        fechaSolicitud: [new Date()],
        departamento: [department, [Validators.required]],
        codigo: [project_code, [Validators.required, Validators.maxLength(20)]],
        motivoGasto: [reason, [Validators.required, Validators.maxLength(400)]],
        fechaSalida: [departure_date, [Validators.required]],
        fechaRegreso: [return_date, [Validators.required]],
        pernocta: [overnight_boolean, [Validators.required]],
        hotel: [hotel_link, []],
        origen: [trip_origin, [Validators.required]],
        destino: [trip_destination, [Validators.required]],
        transporte: [means_transport, [Validators.required]],
        km: [if_car_km, []],
        is_accepted: ["Pendiente", []],
        importe: [amount, [Validators.required, Validators.min(0)]],
      }
    );
    console.log('RESPONSE: ')
    console.log(this.expense)
    console.log('FORMULARIO.VALUES:')
    console.log(this.formulario.value)

  }

  async editarGasto() {
    let id = this.expense?.id || 0;
    let body = this.formulario.value
    body.fechaSolicitud = this.datePipe.transform(body.fechaSolicitud, 'yyyy-MM-dd');
    body.fechaSalida = this.datePipe.transform(body.fechaSalida, 'yyyy-MM-dd');
    body.fechaRegreso = this.datePipe.transform(body.fechaRegreso, 'yyyy-MM-dd');

    try {

      let actualizar = await this.viajesService.updateById(id, this.formulario.value);
      console.log(this.formulario.value)
      Swal.fire({
        icon: 'success',
        title: '¡Hurra!',
        text: 'Gasto editado correctamente',
        confirmButtonText: 'Continuar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/empleado']);
        }
      })
        .catch(err => {
          console.log(err)
        });
    } catch (msg: any) {
      console.log(msg);
      Swal.fire({
        icon: 'error',
        title: 'Ha habido un error, intentalo más tarde',
        text: msg.statusText,
        confirmButtonText: 'Aceptar'
      });
    }
  }


}
