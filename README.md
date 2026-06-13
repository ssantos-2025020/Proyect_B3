# Sistema de Incidentes — Salón C-27 (Menú Interactivo)
 
Sistema de gestión de problemas técnicos del salón C-27 con menú interactivo, desarrollado en TypeScript modular.
 
## 📁 Estructura del Proyecto
 
```
salon-c27-menu/
├── src/
│   ├── types/
│   │   └── incidente.types.ts    ← Tipos e interfaces base
│   ├── dtos/
│   │   └── incidente.dto.ts      ← DTOs para crear y actualizar
│   ├── services/
│   │   └── incidente.service.ts  ← Lógica CRUD completa
│   └── index.ts                  ← Punto de entrada y menú interactivo
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
└── README.md
```
 
## ⚙️ Instalación y uso
 
### 1. Instalar dependencias
```bash
pnpm install
```
 
### 2. Ejecutar directamente con tsx (recomendado)
```bash
pnpm start
```
 
### 3. Compilar y ejecutar desde dist/
```bash
pnpm run build
pnpm run run:dist
```
 
## 📋 Opciones del Menú
 
El sistema ofrece un menú interactivo con las siguientes opciones:
 
1. **Crear reporte** - Registra un nuevo incidente
2. **Listar reportes** - Muestra todos los incidentes registrados
3. **Actualizar reporte** - Modifica un incidente existente
4. **Salir** - Cierra el sistema
 
## 📐 Tipos usados
 
| Tipo | Valores permitidos |
|------|-------------------|
| `Prioridad` | `'baja'` \| `'medio'` \| `'alta'` |
| `EstadoIncidente` | `'abierto'` \| `'en progreso'` \| `'resuelto'` |
 
## 🔒 Reglas de diseño
 
- El campo `id` es **readonly** — no puede modificarse después de creado
- El `estado` inicial siempre es `'abierto'` (lo asigna el sistema)
- La `fechaCreacion` se genera automáticamente al crear un reporte
- La `fechaCreacion` solo puede modificarse al actualizar un reporte
- El `salon` siempre será `'C-27'`
- La `prioridad` se selecciona escribiendo el texto (baja/medio/alta)
- El `CreateIncidenteDTO` tiene `fechaCreacion` opcional (se genera automáticamente)
- El `UpdateIncidenteDTO` hace todos los campos opcionales para actualizaciones parciales
 
## 💡 Características del Menú
 
- **Validación de entrada**: Todos los campos tienen validación en tiempo real
- **Prioridad por texto**: Se escribe "baja", "medio" o "alta" directamente
- **Fecha automática**: Al crear, la fecha se asigna automáticamente
- **Actualización parcial**: Al actualizar, presiona Enter para conservar valores actuales
- **Fecha sin hora**: Se muestra solo la fecha (DD/MM/AAAA)
