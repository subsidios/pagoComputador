export interface RespuestaTransaccionProceso {
  celular: string;
  clasificacion: number;
  direccion: string;
  documento: string;
  email: string;
  estadoFacturaId: number;
  fechaCreacion: string;
  fechaModificacion: string;
  identificadorProducto: string;
  medioPago: string;
  message: string;
  metadata: string;
  nombreApellido: string;
  numeroFactura: string;
  paymentOrderId: string;
  paymentOrderStatusId: string;
  registroId: number;
  tipoDocumento: string;
  transStatusId: number;
  transUuid: string;
  urlRetorno: string;
  valorPago: number;
}
