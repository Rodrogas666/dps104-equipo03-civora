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
