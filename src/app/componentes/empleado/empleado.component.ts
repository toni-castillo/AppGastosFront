import { Component, OnInit } from '@angular/core';
import { Expenses } from 'src/app/interfaces/expenses.interface';
import { GeneralEmployeeService } from 'src/app/services/general-employee.service';

import { ExpensesTypes } from 'src/app/interfaces/expenses-types'; //! OJO
import { Router } from '@angular/router';


@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoComponent implements OnInit {

  arrFormularios: any[] = new Array();
  formulario: Expenses | undefined;

  arrTypes: any[] = new Array();

  constructor(
    private generalEmployeeService: GeneralEmployeeService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    this.arrFormularios = await this.getAllExpenses();

    this.arrTypes = Object.keys(ExpensesTypes).map(key => {
      return {
        key: ExpensesTypes[key as keyof typeof ExpensesTypes],
        value: key,
      };
    });
  }

  async getAllExpenses() {
    let arrExpenses = await this.generalEmployeeService.getAll();
    let arrExpensesSorted = arrExpenses.sort((a, b): number => {

      let resta = (new Date(a.date_request)).valueOf() - (new Date(b.date_request)).valueOf();
      return resta;
    });

    return arrExpensesSorted;
  }

  onClickGoToForm(pValue: string) {
    this.router.navigate(['/empleado/' + pValue]);
  }

}
