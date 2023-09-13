import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Expenses } from 'src/app/interfaces/expenses.interface';
import { GastosService } from 'src/app/services/gastos.service';
import { GeneralEmployeeService } from 'src/app/services/general-employee.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario-gasto',
  templateUrl: './formulario-gasto.component.html',
  styleUrls: ['./formulario-gasto.component.css']
})
export class FormularioGastoComponent implements OnInit {

  form: FormGroup;
  msg: string = "";
  departmentsArray: string[] = [];
  err: boolean = false;
  arrDepartamentos: string[];
  expense: Expenses | undefined;
  isNewForm: boolean = true;
  attached: any;

  constructor(
    private formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    private gastosService: GastosService,
    private router: Router,
    private datePipe: DatePipe,
    private generalEmployeeService: GeneralEmployeeService,
    private activatedRoute: ActivatedRoute
  ) {
    this.arrDepartamentos = new Array();
    this.attached = "";

    this.form = this.formBuilder.group({
      date_request: [new Date()],
      department: ['', [Validators.required]],
      project_code: ['', [Validators.required]],
      reason: ['', [Validators.required, Validators.maxLength(400)]],
      date_expense: ['', [Validators.required, this.dateValidator]],
      type: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      attached: ['']
    })
  }

  async ngOnInit(): Promise<void> {
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

  onChange($event: any) {
    this.attached = $event.target.files;
    console.log('attached', this.attached);
    console.log('attached[0]', this.attached[0]);
  }

  async getDataForm() {
    let fd = new FormData();
    fd.append('date_request', new Date().toISOString().slice(0, 10));
    fd.append('department', this.form.value.department);
    fd.append('project_code', this.form.value.project_code);
    fd.append('reason', this.form.value.reason);
    fd.append('date_expense', new Date().toISOString().slice(0, 10));
    fd.append('type', this.form.value.type);
    fd.append('amount', this.form.value.amount);
    fd.append('attached', this.attached[0] || '');

    try {
      console.log('fd', fd);
      console.log('this.form.value', this.form.value);
      const response = await this.gastosService.create(fd);
      console.log(response);
      Swal.fire({
        icon: 'success',
        title: '¡Hurra!',
        text: 'Has registrado el gasto correctamente',
        confirmButtonText: 'Continuar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/empleado']);
        }
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

  dateValidator(control: AbstractControl) {
    const today = new Date();
    const date = new Date(control.value);
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      return { dateValidator: 'La fecha debe ser válida y posterior a la actual' }
    }
    return null;
  }

  checkControl(pFiel: string, pValidator: string): boolean {
    if (this.form.get(pFiel)?.hasError(pValidator) && this.form.get(pFiel)?.touched) {
      return true
    } else {
      return false
    }
  }

  async recuperarFormulario(id: number) {
    this.expense = await this.generalEmployeeService.getById(id);
    let { department, project_code, reason, date_expense, type, amount, attached } = this.expense;

    this.form = this.formBuilder.group({
      date_request: [new Date()],
      department: [department, [Validators.required]],
      project_code: [project_code, [Validators.required]],
      reason: [reason, [Validators.required, Validators.maxLength(400)]],
      date_expense: [date_expense, [Validators.required, this.dateValidator]],
      type: [type, [Validators.required]],
      amount: [amount, [Validators.required]],
      attached: [attached, [Validators.required]]

    });

    console.log('RESPONSE: ', this.expense)
    console.log('FORM.VALUE: ', this.form.value)
  }

  async editarGasto() {
    let id = this.expense?.id || 0;
    let body = this.form.value;
    body.date_request = this.datePipe.transform(body.date_request, 'yyyy-MM-dd');
    body.date_expense = this.datePipe.transform(body.date_expense, 'yyyy-MM-dd');

    try {

      let actualizar = await this.gastosService.updateById(id, this.form.value);
      console.log(this.form.value)
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
