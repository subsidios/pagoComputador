export interface RespuestaIniciarTransaccion {
  paymentOrderId: string;
  paymentOrderStatus: string;
  paymentUrl: string;
  message: string;
}