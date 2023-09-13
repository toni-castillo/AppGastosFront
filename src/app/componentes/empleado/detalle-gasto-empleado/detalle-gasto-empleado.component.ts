import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Expenses } from 'src/app/interfaces/expenses.interface';
import { GeneralEmployeeService } from 'src/app/services/general-employee.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-gasto-empleado',
  templateUrl: './detalle-gasto-empleado.component.html',
  styleUrls: ['./detalle-gasto-empleado.component.css']
})
export class DetalleGastoEmpleadoComponent implements OnInit {

  expense: Expenses | undefined;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];



  constructor(
    private activatedRoute: ActivatedRoute,
    private generalEmployeeService: GeneralEmployeeService,
    private router: Router) {

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(async params => {
      let id = parseInt(params['id']);
      this.expense = await this.getExpenseById(id);


    })
  }


  async getExpenseById(id: any) {

    let arrExpenses = await this.generalEmployeeService.getAll();
    let expense = arrExpenses.find(expense => expense.id === id)
    return expense;
  }
}
