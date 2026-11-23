/** vecino: reporta y consulta. directiva: además actualiza el estado de los reportes. */
export type RolUsuario = 'vecino' | 'directiva';

export type ModoAutenticacion = 'inicioSesion' | 'registro';

export interface DatosInicioSesion {
  correo: string;
  contrasena: string;
}

export interface DatosRegistroUsuario {
  nombre: string;
  correo: string;
  contrasena: string;
  direccionResidencial: string;
}
