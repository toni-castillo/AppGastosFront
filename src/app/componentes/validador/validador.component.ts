import { Component, OnInit } from '@angular/core';
import { Expenses } from 'src/app/interfaces/expenses.interface';
import { GeneralValidadorService } from 'src/app/services/general-validador.service';


@Component({
  selector: 'app-validador',
  templateUrl: './validador.component.html',
  styleUrls: ['./validador.component.css']
})
export class ValidadorComponent implements OnInit {

  arrFormularios: any[] = new Array();
  formulario: Expenses | undefined;

  constructor(
    private generalValidatorService: GeneralValidadorService
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.arrFormularios = await this.getAllExpenses();

  }


  async getAllExpenses() {
    let arrExpenses = await this.generalValidatorService.getAll();

    let arrExpensesFilter = arrExpenses.filter((formulario) => formulario.is_accepted !== "Rechazado");

    let arrExpensesFilterSorted = arrExpensesFilter.sort((a, b): number => {

      let resta = (new Date(b.date)).valueOf() - (new Date(a.date)).valueOf();
      return resta;
    });

    return arrExpensesFilterSorted;
  }




}



