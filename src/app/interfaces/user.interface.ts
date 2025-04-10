export interface UserRegister {
  sistema: string;
  linkMensaje: string;
  parametro: string;
  remitente: string;
  asunto: string;
  usuario: User;
}

export interface User {
  usuarioId?: number;
  documento: string;
  direccion: string;
  telefono: string;
  sexo: string;
  categoria: string;
  celular: string;
  correo: string;
  clave: string;
  codBeneficiario: string;
  nombreBeneficiario: string;
  fechaNacimiento: string;
  fechaRegistro: string;
  documentoTrabajador: string;
  obligaCambioContra?: boolean;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  link: string;
  existeUsuario: boolean;
  usuarioNasfa: boolean;
  fechaActualizacion?: string;
  sistemaActualizacion: string;
  correoMd5: string;
  aceptaHabeas: boolean;
  tipoDocumento?: string;
  preguntasValidacion: boolean;
  fechaRespuestasValidacion: string;
  bloqueoUser: boolean;
  estadoUser: string;
  contUser: number;
  bloqueo: boolean;
  preguntas: PreguntasUser;
}

export interface Token {
  token?: string;
  mensaje?: string;
}

export interface RememberPassword {
  documento: string;
  sistema: string;
  linkMensaje: string;
  parametro: string;
  remitente: string;
  asunto: string;
}

export interface ValidateToken {
  mensaje: string;
  valido: boolean;
  tipo: string;
}

export interface UserOrCompany {
  documentType: string;
  document?: number;
  // dateBirthday: string;
  companyNit?: number;
  companyBranch?: string;
}

export interface ServiceVerification {
  mensaje: string;
  servicioActivo: boolean;
}

export interface Session {
  debeActualizarDatos?: boolean;
  debeRealizarValidacion?: boolean;
  puedeIngresar?: boolean;
  usuario?: User;
  exitoso: boolean;
}

export interface ValidateQuestion {
  respuesta: boolean;
  bloqueo: boolean;
  intentos: number;
  error: string;
  estado: number;
  debeActualizarDatos: boolean;
}

export interface validateResponse {
  ValidacionRespuestasResponse: Resultado;
}

export interface Resultado {
  error: number;
  mensaje: string;
  resultadoValidacion: boolean;
}

export interface Questions {
  ConsultaPreguntasResponse: ConsultaPreguntasResponse;
}

export interface ConsultaPreguntasResponse {
  mensaje: string;
  error: number;
  preguntas: PreguntasUser;
}

export interface PreguntasUser {
  identificador: number;
  texto: string;
  respuestas: object;
}

export interface TypeDocumentsArray {
  typeDocument: TypeDocuments;
}

export interface TypeDocuments {
  titulo: string;
  valor: string;
}

export interface MiPerfilConfa {
  existeUsuario: boolean;
  usuarioNasfa: boolean;
  tipo_afi?: string;
  esDesempleadoParaServicio?: boolean;
  tipoUsuario?: string;
}

export interface resValidaUser {
  estado: number;
  salida: string;
  error: string;
  asistente?: Asistente;
}

export class Asistente {
  asistente_id: number = 0;
  usuario_red: string = "";
  documento: string = "";
  nombre: string = "";
  correo: string = "";
  es_externo: Boolean = false;
  empresa: string = "";
  cargo: string = "";
  nombreCompleto: String = "";
}
