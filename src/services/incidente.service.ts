import { Incidente } from '../types/incidente.types';
import { CreateIncidenteDTO, UpdateIncidenteDTO } from '../dtos/incidente.dto';

export class IncidenteService {
  private reportes: Incidente[] = [];
  private contador: number = 1;

  crear(dto: CreateIncidenteDTO): Incidente {
    const nuevo: Incidente = {
      id: this.contador++,
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      reportadoPor: dto.reportadoPor,
      prioridad: dto.prioridad,
      estado: 'abierto',
      fechaCreacion: dto.fechaCreacion ?? new Date(),
      salon: 'C-27',
    };
    this.reportes.push(nuevo);
    return nuevo;
  }

  listarTodos(): Incidente[] {
    return this.reportes;
  }

  buscarPorId(id: number): Incidente | null {
    return this.reportes.find((r) => r.id === id) ?? null;
  }

  actualizar(id: number, dto: UpdateIncidenteDTO): Incidente | null {
    const index = this.reportes.findIndex((r) => r.id === id);
    if (index === -1) return null;
    this.reportes[index] = { ...this.reportes[index], ...dto };
    return this.reportes[index];
  }
}
