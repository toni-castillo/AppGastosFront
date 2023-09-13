import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ComprasService } from 'src/app/services/compras.service';
import { AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Expenses } from 'src/app/interfaces/expenses.interface';
import { GeneralEmployeeService } from 'src/app/services/general-employee.service';

@Component({
  selector: 'app-formulario-compra',
  templateUrl: './formulario-compra.component.html',
  styleUrls: ['./formulario-compra.component.css']
})
export class FormularioCompraComponent implements OnInit {

  form!: FormGroup;
  msg: string = "";
  departmentsArray: string[] = [];
  err: boolean = false;
  arrDepartamentos: string[];
  expense: Expenses | undefined;
  isNewForm: boolean = true;


  constructor(
    private formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    private comprasService: ComprasService,
    private datePipe: DatePipe,
    private router: Router,
    private generalEmployeeService: GeneralEmployeeService,
    private activatedRoute: ActivatedRoute
  ) {
    this.arrDepartamentos = new Array();
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
      }
    })
  }

  initForm() {
    this.form = this.formBuilder.group({
      date_request: [new Date()],
      department: ['', [Validators.required]],
      project_code: ['', [Validators.required]],
      reason: ['', [Validators.required, Validators.maxLength(400)]],
      date_expense: ['', [Validators.required, this.dateValidator]],
      product_link: ['', [Validators.required]],
      provider: ['', [Validators.required]],
      units: ['', [Validators.required, Validators.min(0)]],
      amount: ['', [Validators.required, Validators.min(0)]]
    });
  }

  async getDataForm() {
    this.form.value.date_request = this.datePipe.transform(this.form.value.date_request, 'yyyy-MM-dd');
    this.form.value.date_expense = this.datePipe.transform(this.form.value.date_expense, 'yyyy-MM-dd');

    try {
      console.log(this.form.value);
      const response = await this.comprasService.create(this.form.value);
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
    let { department, project_code, reason, date_expense, product_link, provider, units, amount } = this.expense;

    this.form = this.formBuilder.group({
      date_request: [new Date()],
      department: [department, [Validators.required]],
      project_code: [project_code, [Validators.required]],
      reason: [reason, [Validators.required, Validators.maxLength(400)]],
      date_expense: [date_expense, [Validators.required, this.dateValidator]],
      product_link: [product_link, [Validators.required]],
      provider: [provider, [Validators.required]],
      units: [units, [Validators.required]],
      is_accepted: ["Pendiente", []],
      amount: [amount, [Validators.required]]
    });
    console.log('RESPONSE: ')
    console.log(this.expense)
    console.log('FORMULARIO.VALUES:')
    console.log(this.form.value)
  }

  async editarGasto() {
    let id = this.expense?.id || 0;
    let body = this.form.value;
    body.date_request = this.datePipe.transform(body.date_request, 'yyyy-MM-dd');
    body.date_expense = this.datePipe.transform(body.date_expense, 'yyyy-MM-dd');

    try {

      let actualizar = await this.comprasService.updateById(id, this.form.value);
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
