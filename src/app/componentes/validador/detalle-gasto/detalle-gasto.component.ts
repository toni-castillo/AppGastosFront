import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Expenses } from 'src/app/interfaces/expenses.interface';
import { GeneralValidadorService } from 'src/app/services/general-validador.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-detalle-gasto',
  templateUrl: './detalle-gasto.component.html',
  styleUrls: ['./detalle-gasto.component.css']
})
export class DetalleGastoComponent implements OnInit {

  expense: Expenses | undefined;


  constructor(
    private activatedRoute: ActivatedRoute,
    private generalValidatorService: GeneralValidadorService,
    private router: Router) {

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(async params => {
      let id = parseInt(params['id']);
      this.expense = await this.getExpenseById(id);
    })
  }


  async getExpenseById(id: any) {

    let arrExpenses = await this.generalValidatorService.getAll();
    let expense = arrExpenses.find(expense => expense.id === id)
    return expense;
  }

  async aceptarGasto() {
    let nuevoEstado = "Aceptado";
    let id = this.expense?.id || 0;
    let cambioEstado = [];

    try {
      cambioEstado = await this.generalValidatorService.updateById(id, nuevoEstado);
      Swal.fire({
        icon: 'success',
        title: '¡Hurra!',
        text: 'Gasto aceptado correctamente',
        confirmButtonText: 'Continuar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/validador']);
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

    return cambioEstado;
  }

  async rechazarGasto() {
    let nuevoEstado = "Rechazado";
    let id = this.expense?.id || 0;

    Swal.fire({
      title: 'Inserta una respuesta',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: async (note) => {
        note = await this.generalValidatorService.updateByIdNote(id, note);
        await this.generalValidatorService.updateById(id, nuevoEstado);
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/validador']);
        try {
          Swal.fire({
            icon: 'success',
            title: '¡Rechazado!',
            text: 'Gasto rechazado correctamente',
            confirmButtonText: 'Continuar'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/validador']);
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
      } else if (result.isDenied) {
        this.router.navigate(['/validador'])
      };

    });
  }
}

