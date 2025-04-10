import { Injectable } from "@angular/core";
import { BehaviorSubject, UnsubscriptionError } from "rxjs";
import { User } from "../interfaces/user.interface";
import { Observable } from "rxjs";
import * as moment from "moment";

@Injectable({
  providedIn: "root",
})
export class UtilitiesService {
  miPerfil: boolean = true;
  changePass: boolean = false;
  updateInfo: boolean = false;

  puedeIngresar: boolean = false;
  debeActualizarDatos: boolean = false;
  debeRealizarValidacion: boolean = false;
  userActivo: boolean = false;
  permiteRealizarPreguntas: boolean = false;

  bloqueo = false;
  backHome: boolean = false;
  backModify: boolean = false;

  // Loading
  loading: boolean = false;
  messageLoading: string = null;

  // Modal
  messageTitleModal: string = null;
  messageModal: string = null;
  backLogin: boolean = false;
  errorInfoLogin: string =
    "El usuario no se encuentra registrado o alguno de los dos datos es incorrecto.";

  // User
  currentUser: User;
  fullNameUser: string;
  documentUser: string;
  registerUser: User;
  existUser: boolean = false;
  recoveryEmail: string;
  nasfaUser: User;
  fullNameAsesor: string;
  private messageSource = new BehaviorSubject<string>("");

  dues: any = null;
  returnUrl: string = null;
  subserviceCode: number = null;

  colorTransaction: string = null;

  urlPago:string = '';

  constructor() {}

  sendcambioBtnInicio(message: string) {
    this.messageSource.next(message);
  }

  receivedcambioBtnInicio(): Observable<string> {
    return this.messageSource.asObservable();
  }

  convertDateFormat(_date: any, _format: string) {
    const year = _date.year;
    const month = _date.month;
    const day = _date.day;

    let date = year + "/" + month + "/" + day;

    if (year && month && day) {
      return moment(date).format(_format);
    } else {
      return moment(_date).format(_format);
    }
  }

  setCodeTransactionStatus(code: string) {
    switch (code) {
      case "OK":
        this.messageModal = "Transacción aprobada por la entidad financiera";
        break;
      case "NOT_AUTHORIZED":
        this.messageModal = "Transacción no aprobada por la entidad financiera";
        break;
      case "EXPIRED":
        this.messageModal = "Transacción expirada";
        break;
      case "FAILED":
        this.messageModal =
          "Se ha presentado un fallo en la comunicación con la entidad financiera";
        break;
      case "PENDING":
        this.messageModal =
          "Tu transacción está pendiente de aprobación por tu entidad financiera";
        break;
      case "BANK":
        this.messageModal =
          "Se ha presentado un fallo en la comunicación con la entidad financiera";
        break;
    }
  }
  setTimeOnboarding(type: string) {
    let n = moment().add(1, "days").unix();
    localStorage.setItem(type, n.toString());
  }
}
