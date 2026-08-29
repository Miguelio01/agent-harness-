import { Injectable, signal } from '@angular/core';
import { Observable, from } from 'rxjs';

export interface DeclaracionIca {
  id?: string;
  nitContribuyente: string;
  periodoGrabable: string;
  montoRetenido: number;
  estado?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DeclaracionesIcaService {
  private apiUrl = 'http://localhost:3000/declaraciones-ica';
  
  // Writable signal for active cache of list query
  declaraciones = signal<DeclaracionIca[]>([]);

  constructor() {}

  findAll(): Observable<DeclaracionIca[]> {
    const promise = fetch(this.apiUrl)
      .then(res => res.json())
      .then(data => {
        this.declaraciones.set(data);
        return data;
      });
    return from(promise);
  }

  create(declaracion: DeclaracionIca): Observable<DeclaracionIca> {
    const promise = fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(declaracion)
    })
      .then(res => res.json())
      .then(data => {
        this.declaraciones.update(prev => [...prev, data]);
        return data;
      });
    return from(promise);
  }
}
