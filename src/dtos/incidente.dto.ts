import { Prioridad, EstadoIncidente } from '../types/incidente.types';

export interface CreateIncidenteDTO {
  titulo: string;
  descripcion: string;
  reportadoPor: string;
  prioridad: Prioridad;
  fechaCreacion?: Date;
}

export interface UpdateIncidenteDTO {
  titulo?: string;
  descripcion?: string;
  reportadoPor?: string;
  prioridad?: Prioridad;
  estado?: EstadoIncidente;
  fechaCreacion?: Date;
}
