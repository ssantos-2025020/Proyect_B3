import * as readline from 'readline';
import { IncidenteService } from './services/incidente.service';
import { Prioridad, EstadoIncidente } from './types/incidente.types';

const servicio = new IncidenteService();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const preguntar = (texto: string): Promise<string> =>
  new Promise((resolve) => rl.question(texto, (resp) => resolve(resp.trim())));

// VALIDACIONES
const soloLetras       = (v: string) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(v);
const letrasYNumeros   = (v: string) => /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(v);
const descripcionValida = (v: string) => /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,;:!?¿¡\-()]+$/.test(v);
const soloNumero       = (v: string) => /^\d+$/.test(v);
const fechaValida      = (v: string) => /^\d{2}\/\d{2}\/\d{4}$/.test(v) && !isNaN(Date.parse(v.split('/').reverse().join('-')));

async function pedirCampo(pregunta: string, validar: (v: string) => boolean, error: string): Promise<string> {
  while (true) {
    const valor = await preguntar(pregunta);
    if (valor !== '' && validar(valor)) return valor;
    console.log(`  ✘ ${error}`);
  }
}

// MENÚ
async function mostrarMenu(): Promise<void> {
  console.log('\n========================================');
  console.log('      SOPORTE TÉCNICO C-27');
  console.log('========================================');
  console.log('  1. Crear reporte');
  console.log('  2. Listar reportes');
  console.log('  3. Actualizar reporte');
  console.log('  4. Salir');
  console.log('----------------------------------------');
}

// CREAR
async function crearReporte(): Promise<void> {
  console.log('\n-- Nuevo Reporte --');

  const titulo       = await pedirCampo('Título: ',       letrasYNumeros,    'Solo letras, números y espacios.');
  const descripcion  = await pedirCampo('Descripción: ',  descripcionValida, 'Solo letras, números, espacios y signos de puntuación.');
  const reportadoPor = await pedirCampo('Reportado por: ', soloLetras,       'Solo letras y espacios, sin números ni símbolos.');

  const prioridadInput = await pedirCampo('Prioridad (baja/medio/alta): ', (v) => ['baja','medio','alta'].includes(v.toLowerCase()), 'Escribe baja, medio o alta.');
  const prioridad = prioridadInput.toLowerCase() as Prioridad;

  const nuevo = servicio.crear({ titulo, descripcion, reportadoPor, prioridad });
  console.log(`\nID: ${nuevo.id}`);
  console.log(`Título: ${titulo}`);
  console.log(`Descripción: ${descripcion}`);
  console.log(`Reportado por: ${reportadoPor}`);
  console.log(`Prioridad: ${nuevo.prioridad}`);
  console.log(`Estado: ${nuevo.estado}`);
  console.log(`Fecha: ${nuevo.fechaCreacion.toLocaleDateString()}`);
  console.log('✔ Reporte creado');
}

// LISTAR
function listarReportes(): void {
  const lista = servicio.listarTodos();
  console.log('\n-- Reportes del Salón C-27 --');
  if (lista.length === 0) { console.log('No hay reportes registrados.'); return; }

  lista.forEach((r) => {
    console.log(`\n  ID          : ${r.id}`);
    console.log(`  Título      : ${r.titulo}`);
    console.log(`  Descripción : ${r.descripcion}`);
    console.log(`  Reportado   : ${r.reportadoPor}`);
    console.log(`  Prioridad   : ${r.prioridad}`);
    console.log(`  Estado      : ${r.estado}`);
    console.log(`  Fecha       : ${r.fechaCreacion.toLocaleDateString()}`);
  });
}

// ACTUALIZAR
async function actualizarReporte(): Promise<void> {
  listarReportes();
  if (servicio.listarTodos().length === 0) return;

  const idTexto = await pedirCampo('\nID a actualizar: ', soloNumero, 'El ID solo admite números.');
  const reporte  = servicio.buscarPorId(parseInt(idTexto));
  if (!reporte) { console.log('✘ No se encontró el reporte.'); return; }

  console.log('\nPresiona Enter para conservar el valor actual.\n');

  // Título
  let titulo: string | undefined;
  const inTitulo = await preguntar(`Título (${reporte.titulo}): `);
  if (inTitulo === '')                         titulo = reporte.titulo;
  else if (letrasYNumeros(inTitulo))           titulo = inTitulo;
  else { console.log('✘ Título inválido, se conserva el anterior.'); titulo = reporte.titulo; }

  // Descripción
  let descripcion: string | undefined;
  const inDesc = await preguntar(`Descripción (${reporte.descripcion}): `);
  if (inDesc === '')                           descripcion = reporte.descripcion;
  else if (descripcionValida(inDesc))          descripcion = inDesc;
  else { console.log('✘ Descripción inválida, se conserva la anterior.'); descripcion = reporte.descripcion; }

  // Reportado por
  let reportadoPor: string | undefined;
  const inRep = await preguntar(`Reportado por (${reporte.reportadoPor}): `);
  if (inRep === '')                            reportadoPor = reporte.reportadoPor;
  else if (soloLetras(inRep))                  reportadoPor = inRep;
  else { console.log('✘ Nombre inválido, se conserva el anterior.'); reportadoPor = reporte.reportadoPor; }

  // Prioridad
  console.log(`Prioridad actual: ${reporte.prioridad}`);
  console.log('1) baja  2) medio  3) alta  (Enter para no cambiar)');
  const inPrioridad = await preguntar('Elige: ');
  const prioridades = ['baja','medio','alta'] as Prioridad[];
  const prioridad   = ['1','2','3'].includes(inPrioridad)
    ? prioridades[parseInt(inPrioridad) - 1]
    : reporte.prioridad;

  // Estado
  console.log(`Estado actual: ${reporte.estado}`);
  console.log('1) abierto  2) en progreso  3) resuelto  (Enter para no cambiar)');
  const inEstado = await preguntar('Elige: ');
  const estados  = ['abierto','en progreso','resuelto'] as EstadoIncidente[];
  const estado   = ['1','2','3'].includes(inEstado)
    ? estados[parseInt(inEstado) - 1]
    : reporte.estado;

  // Fecha
  let fechaCreacion: Date = reporte.fechaCreacion;
  const inFecha = await preguntar(`Fecha (${reporte.fechaCreacion.toLocaleDateString()}) DD/MM/AAAA o Enter: `);
  if (inFecha !== '') {
    if (fechaValida(inFecha)) {
      const [d, m, a] = inFecha.split('/');
      fechaCreacion   = new Date(`${a}-${m}-${d}`);
    } else {
      console.log('✘ Fecha inválida, se conserva la anterior.');
    }
  }

  servicio.actualizar(parseInt(idTexto), { titulo, descripcion, reportadoPor, prioridad, estado, fechaCreacion });
  console.log('✔ Reporte actualizado.');
}

// MAIN
async function main(): Promise<void> {
  let corriendo = true;
  while (corriendo) {
    await mostrarMenu();
    const opcion = await preguntar('Elige una opción: ');
    switch (opcion) {
      case '1': await crearReporte();      break;
      case '2': listarReportes();          break;
      case '3': await actualizarReporte(); break;
      case '4': console.log('\nHasta luego.\n'); corriendo = false; break;
      default:  console.log('✘ Opción no válida. Elige entre 1 y 4.');
    }
  }
  rl.close();
}

main();
