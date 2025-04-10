export interface InfoPago {
  codigoTrabajador: string;
  codigoPersonaCargo: string;
  categoria: string;
  tipoTrabajador: string;
  estadoTrabajador: string;
  valorCopago: number;
  productoId: string;
  nombreTrabajador: string;
  email: string;
  codigoClasificacion: number;
  aceptaPoliticas: boolean;
  celular: string;
  direccion: string;
  mensaje: string;
  estado: boolean;
  nroSoli: number;
  urlRetorno?: string;
  estadoBeneficiario: string;
}
