export type Prioridad = 'baja' | 'medio' | 'alta';
export type EstadoIncidente = 'abierto' | 'en progreso' | 'resuelto';

export interface Incidente {
  readonly id: number;       // Autoincremental: 1, 2, 3...
  titulo: string;            // Letras, números y espacios
  descripcion: string;       // Letras, números, espacios y puntuación
  reportadoPor: string;      // Solo letras y espacios
  prioridad: Prioridad;      // 'baja' | 'medio' | 'alta'
  estado: EstadoIncidente;   // 'abierto' | 'en progreso' | 'resuelto'
  fechaCreacion: Date;
  salon: string;
}
