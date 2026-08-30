import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeclaracionesIcaService } from '../../services/declaraciones-ica.service';

@Component({
  selector: 'app-tabla-consulta',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-container">
      <h3>Consulta de Trámites Radicados</h3>
      <button (click)="refresh()">Actualizar Listado</button>
      <table>
        <thead>
          <tr>
            <th>ID Trámite</th>
            <th>NIT Contribuyente</th>
            <th>Periodo</th>
            <th>Monto Retenido</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let dec of service.declaraciones()">
            <td>{{ dec.id || 'N/A' }}</td>
            <td>{{ dec.nitContribuyente }}</td>
            <td>{{ dec.periodoGrabable }}</td>
            <td>{{ dec.montoRetenido | currency }}</td>
            <td [ngClass]="dec.estado?.toLowerCase() || 'pendiente'">
              {{ dec.estado }}
            </td>
          </tr>
          <tr *ngIf="service.declaraciones().length === 0">
            <td colspan="5" class="empty">No se han registrado trámites.</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class TablaConsultaComponent implements OnInit {
  constructor(public service: DeclaracionesIcaService) {}

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.service.findAll().subscribe();
  }
}
