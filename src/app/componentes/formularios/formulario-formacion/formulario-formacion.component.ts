import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { FormacionService } from 'src/app/services/formacion.service';
import { Expenses } from 'src/app/interfaces/expenses.interface';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { GeneralEmployeeService } from 'src/app/services/general-employee.service';

@Component({
  selector: 'app-formulario-formacion',
  templateUrl: './formulario-formacion.component.html',
  styleUrls: ['./formulario-formacion.component.css']
})
export class FormularioFormacionComponent implements OnInit {

  formulario!: FormGroup;
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
    private formacionService: FormacionService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private generalEmployeeService: GeneralEmployeeService,
    private datePipe: DatePipe) {

    this.arrDepartamentos = new Array()

  }

  async ngOnInit(): Promise<void> {
    this.initForm();
    this.arrDepartamentos = await this.usuariosService.getAllDepartments();
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
    body.fechaFormacion = body.fechaFormacion.toISOString().slice(0, 10)
    if (!body.km) {
      body.km = null;
    };


    try {
      await this.formacionService.create(this.formulario.value)
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
        fechaFormacion: ['', [Validators.required]],
        formacionSolicitada: ['', [Validators.required]],
        proveedor: ['', [Validators.required]],
        horasFormacion: ['', [Validators.required]],
        horarioFormacion: ['', [Validators.required]],
        personas: ['', [Validators.required]],
        importe: ['', [Validators.required, Validators.min(0)]],
      }
    );
  };


  checkControl(pFiel: string, pValidator: string): boolean {
    if (this.formulario.get(pFiel)?.hasError(pValidator) && this.formulario.get(pFiel)?.touched) {
      return true
    } else {
      return false
    }
  }

  async recuperarFormulario(id: number) {

    this.expense = await this.generalEmployeeService.getById(id);
    let { department, project_code, reason, date_expense, requested_training, provider, training_hours, training_schedule, number_people, amount } = this.expense;

    this.formulario = this.formBuilder.group(
      {
        fechaSolicitud: [new Date()],
        departamento: [department, [Validators.required]],
        codigo: [project_code, [Validators.required, Validators.maxLength(20)]],
        motivoGasto: [reason, [Validators.required, Validators.maxLength(400)]],
        fechaFormacion: [date_expense, [Validators.required]],
        formacionSolicitada: [requested_training, [Validators.required]],
        proveedor: [provider, [Validators.required]],
        horasFormacion: [training_hours, [Validators.required]],
        horarioFormacion: [training_schedule, [Validators.required]],
        personas: [number_people, [Validators.required]],
        is_accepted: ["Pendiente", []],
        importe: [amount, [Validators.required, Validators.min(0)]],
      }
    );
    console.log('RESPONSE: ');
    console.log(this.expense);
    console.log('FORMULARIO.VALUES:');
    console.log(this.formulario.value);

  }

  async editarGasto() {
    let id = this.expense?.id || 0;
    let body = this.formulario.value
    body.fechaSolicitud = this.datePipe.transform(body.fechaSolicitud, 'yyyy-MM-dd');
    body.fechaFormacion = this.datePipe.transform(body.fechaFormacion, 'yyyy-MM-dd');

    try {

      let actualizar = await this.formacionService.updateById(id, this.formulario.value);
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
    };
  };
};
