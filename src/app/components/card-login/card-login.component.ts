import { Component, OnInit, Output, EventEmitter } from "@angular/core";

import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "../../services/authentication.service";
import { first } from "rxjs/operators";
import {
  User,
  Token,
  UserOrCompany,
  Session,
} from "../../interfaces/user.interface";
import { UtilitiesService } from "../../services/utilities.service";
import { CookieService } from "ngx-cookie-service";
import * as CryptoJS from "crypto-js";
import * as Md5 from "crypto-js/md5";
import { InfoPago } from "src/app/interfaces/pago.interface";
import { RespuestaIniciarTransaccion } from "src/app/interfaces/respuestaIniciarTransaccion.interface";
import { RespuestaTransaccionProceso } from "src/app/interfaces/respuestaTransaccionProceso.interface";
import { environment } from "src/environments/environment";

declare var $;

@Component({
  selector: "app-card-login",
  templateUrl: "./card-login.component.html",
  styleUrls: ["./card-login.component.css"],
})
export class CardLoginComponent implements OnInit {
  formLogin: FormGroup;
  returnUrl: string;
  infoPago: InfoPago;
  infoRespuestaProceso: RespuestaTransaccionProceso;
  // showModal: boolean = false;
  @Output() formLoginEmitter: EventEmitter<FormGroup> = new EventEmitter();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    public utilitiesService: UtilitiesService,
    private cookieService: CookieService
  ) {
    this.createForm();
  }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    // obtener retorno de los parametros route de la url o por defecto a '/'

    this.returnUrl = `/validar-rostro`;
    // console.log('returnUrl', this.returnUrl);

    this.formLoginEmitter.emit(this.formLogin);
    this.activatedRoute.queryParams.subscribe(params => {
      //const queryParamValue = Object.keys(params)[0]; // Obtiene la clave (7dc7dc58cdcadaeacom en este caso)
      // console.log('Valor obtenido:', queryParamValue);
      const queryParamKey = Object.keys(params)[0]; // Obtiene la clave
      const queryParamValue = params[queryParamKey]; // Obtiene el valor asociado

      console.log('Clave obtenida:', queryParamKey);
      console.log('Valor obtenido:', queryParamValue);

      this.authenticationService
        .verificarTransaccionPayZen(queryParamValue)
        .pipe(first())
        .subscribe((response: RespuestaTransaccionProceso) => {
          console.log('Respuesta del servicio:', response);
          console.log('mensaje:', response.message);
          if (response.message === '' && response.paymentOrderStatusId === 'PAID') {

            this.utilitiesService.loading = false;
            this.utilitiesService.urlPago = "";
            this.infoRespuestaProceso = response;
            console.log('esta es la respuesta: ' + this.infoRespuestaProceso);
            //this.infoPago = response;

            setTimeout(() => {
              //$('#modalPagoExitoso').modal('show'); // Mostrar el modal
              this.utilitiesService.messageTitleModal = "Pago exitoso";
              // Lista de claves a mostrar
              const camposAMostrar = [
                "documento",
                "identificadorProducto",
                "nombreApellido",
                "paymentOrderId",
                "valorPago"
              ];

              const etiquetas = {
                nombreApellido: "Nombre",
                paymentOrderId: "Identificador Pago"
              };
              //este funciona
              //this.utilitiesService.messageModal = Object.entries(response)
              // .map(([key, value]) => `${key}: ${value}`)
              // .join("\n");

              //  this.utilitiesService.messageModal = `<div style="text-align: left;">` + camposAMostrar
              //  .map(key => response[key] !== undefined ? `${key}: ${response[key]}` : `${key}: N/A`)
              //  .join("<br>") + 
              //  `</div>`;

              //este final
              this.utilitiesService.messageModal = camposAMostrar
                .map(key => `${etiquetas[key] || key}: ${response[key] !== undefined ? response[key] : 'N/A'}`)
                .join("\n");


              // this.utilitiesService.messageModal = `<div style="text-align: left;">` +
              //   camposAMostrar
              //     .map(key => `${etiquetas[key] || key}: ${response[key] !== undefined ? response[key] : 'N/A'}`)
              //     .join("<br>") +
              //   `</div>`;


              // this.utilitiesService.messageModal = camposAMostrar
              //   .map(key => `${key}: ${response[key]}`)
              //   .join("\n");
              this.utilitiesService.backLogin = true;

              // $(".btn-close-popup-change-password").click();
              /// setTimeout(() => {
              this.utilitiesService.loading = false;
              $(".btn-modal-success").click();
              // }, 1000);
            }, 1000);
            //  this.utilitiesService.messageTitleModal = "Cambio exitoso";
            //  this.utilitiesService.messageModal =
            //    "Su contraseña ha cambiado con éxito.";
            //  this.utilitiesService.backLogin = true;

            //  $(".btn-close-popup-change-password").click();
            //  setTimeout(() => {
            //    this.utilitiesService.loading = false;
            //    $(".btn-modal-success").click();
            //  }, 1000);
          } else {
            this.utilitiesService.messageTitleModal = "Transacción en proceso";
            this.utilitiesService.messageModal = response.message
            // this.utilitiesService.errorInfoLogin;

            this.utilitiesService.backLogin = false;

            setTimeout(() => {
              this.utilitiesService.loading = false;
              $(".btn-modal-error").click();
            }, 500);
          }
        });
      //if (queryParamValue) {
      //  this.llamarWebService(queryParamValue);
      //}
    });
  }

  createForm() {
    this.formLogin = this.formBuilder.group({
      documentTrabajador: [
        "",
        [
          Validators.required,
          Validators.min(99999),
          Validators.max(999999999999999),
          Validators.pattern("^[0-9]+"),
        ],
      ],
      documentPersonaCargo: [
        "",
        [
          Validators.required,
          Validators.min(99999),
          Validators.max(999999999999999),
          Validators.pattern("^[0-9]+"),
        ],
      ],
      radicado: ["", [Validators.required, Validators.minLength(3)]],
    });
  }

  // convenience getter for easy access to form fields
  // un práctico buscador para facilitar el acceso a los campos de los formularios
  get f() {
    return this.formLogin.controls;
  }

  get getDocumentTrabajador() {
    return (
      this.formLogin.get("documentTrabajador").invalid &&
      this.formLogin.get("documentTrabajador").touched
    );
  }

  get getDocumentPersonaCargo() {
    return (
      this.formLogin.get("documentPersonaCargo").invalid &&
      this.formLogin.get("documentPersonaCargo").touched
    );
  }

  get getRadicado() {
    return (
      this.formLogin.get("radicado").invalid &&
      this.formLogin.get("radicado").touched
    );
  }
  onSubmit() {
    this.utilitiesService.urlPago = "";
    this.utilitiesService.messageLoading = "";

    if (this.formLogin.invalid) {
      Object.values(this.f).forEach((control) => {
        control.markAllAsTouched();
      });
      return;
    } else {
      let documentTrabajador = this.f.documentTrabajador.value;
      let documentPersonaCargo = this.f.documentPersonaCargo.value;
      let radicado = this.f.radicado.value;



      if (documentTrabajador !== "" && radicado !== "" && documentPersonaCargo !== "") {
        //const radicado = this.encriptar(this.f.radicado.value);
        this.utilitiesService.loading = true;

        this.authenticationService
          .loginCredencialesPago(documentTrabajador, documentPersonaCargo, radicado)
          .pipe(first())
          .subscribe((response: InfoPago) => {
            console.log('Respuesta del servicio:', response);
            if (response.estado) {
              this.utilitiesService.loading = false;
              this.infoPago = response;
              $('#modalPago').modal('show'); // Mostrar el modal
              
            } else {
              this.utilitiesService.messageTitleModal = "Error consultando la información";
              this.utilitiesService.messageModal = response.mensaje
              // this.utilitiesService.errorInfoLogin;

              this.utilitiesService.backLogin = false;

              setTimeout(() => {
                this.utilitiesService.loading = false;
                $(".btn-modal-error").click();
              }, 500);
            }
          });
      }
    }
  }

  onSubmit1() {
    // stop here if form is invalid
    // Deténgase aquí si el formulario no es válido
    if (this.formLogin.invalid) {
      Object.values(this.f).forEach((control) => {
        control.markAllAsTouched();
      });
      return;
    } else {
      let documentTrabajador = this.f.documentTrabajador.value;
      let documentPersonaCargo = this.f.documentPersonaCargo.value;
      let radicado = this.f.radicado.value;

      // this.authenticationService.getGenericToken()
      //   .pipe(first())
      //   .subscribe((response: Token) => {
      //     console.log("token generic", response);
      //   });

      if (documentTrabajador !== "" && radicado !== "" && documentPersonaCargo !== "") {
        this.utilitiesService.messageLoading = null;
        this.utilitiesService.loading = true;

        //--------------------------------------------------------------//
        this.authenticationService
          .consultarBloqueoUsuario(documentTrabajador)
          .pipe(first())
          .subscribe((bloqueo) => {
            if (bloqueo == true) {
              console.log("Usuario Bloqueado");
              this.utilitiesService.messageTitleModal = "¡Usuario Bloqueado!";
              this.utilitiesService.messageModal =
                "No puedes ingresar debido que excediste los intentos permitidos para validarte.";
              this.utilitiesService.backLogin = false;

              setTimeout(() => {
                this.utilitiesService.loading = false;
                $(".btn-modal-error").click();
              }, 500);
            } else if (bloqueo == false) {
              console.log("Usuario No Bloqueado");

              this.authenticationService
                .getToken(documentTrabajador, radicado)
                .pipe(first())
                .subscribe((response: Token) => {
                  // console.log("response: ", response);
                  if (response.token) {
                    // this.authenticationService.login(document, radicado)
                    this.authenticationService
                      .loginNew(response.token)
                      .pipe(first())
                      .subscribe((response: Session) => {
                        this.utilitiesService.currentUser = response.usuario;
                        console.log(response);
                        if (response.usuario.existeUsuario) {
                          let userOrCompany: UserOrCompany = {
                            documentType: response.usuario.tipoDocumento,
                            document: parseInt(response.usuario.documento),
                            // dateBirthday: response.fechaNacimiento
                          };

                          localStorage.setItem(
                            "userOrCompany",
                            JSON.stringify(userOrCompany)
                          );
                          if (response.usuario.tipoDocumento == "") {
                            this.utilitiesService.loading = false;
                            $(".btn-credits1").click();
                            console.log("Entro");
                          } else {
                            this.cookieService.delete("gtoken");
                            this.utilitiesService.messageLoading = `Bienvenido ${response.usuario.primerNombre} ${response.usuario.segundoNombre} ${response.usuario.primerApellido} ${response.usuario.segundoApellido}`;
                            // console.log(this.utilitiesService.messageLoading);
                            this.utilitiesService.fullNameUser =
                              response.usuario.primerNombre +
                              " " +
                              response.usuario.segundoNombre +
                              " " +
                              response.usuario.primerApellido +
                              " " +
                              response.usuario.segundoApellido;
                            this.utilitiesService.documentUser =
                              response.usuario.documento;

                            $(".btn-close-popup-login").click();
                            setTimeout(() => {
                              this.utilitiesService.loading = false;
                              this.router.navigate([this.returnUrl]);
                            }, 500);
                          }
                        }
                      });

                    this.formLogin.reset({
                      documentTrabajador: "",
                      documentPersonaCargo: "",
                      radicado: "",
                    });
                  } else {
                    // this.utilitiesService.messageTitleModal = response.mensaje;
                    // console.log(response.mensaje);
                    this.utilitiesService.messageTitleModal =
                      "Inténtalo nuevamente";
                    this.utilitiesService.messageModal =
                      this.utilitiesService.errorInfoLogin;
                    this.utilitiesService.backLogin = false;

                    setTimeout(() => {
                      this.utilitiesService.loading = false;
                      $(".btn-modal-error").click();
                    }, 500);
                  }
                });
            }
          });
      }
    }
  }
  ////////////////////////////nueva forma de encriptar
  encriptar(pas: string) {
    try {
      const claveMD5 = this.hashMD5(pas);
      const claveSHA256 = this.hashSHA256(claveMD5);
      const claveconfa = this.encriptarConfa(claveSHA256);
      return claveconfa;
      console.log("Nueva contraseña: " + claveconfa);
    } catch (error) {
      console.error("Error al encriptar la contraseña:", error);
    }
  }

  hashMD5(pas: string): string {
    try {
      const md5Hash = Md5(pas).toString();
      return md5Hash;
    } catch (error) {
      console.error("Error al calcular el hash MD5:", error);
      throw error;
    }
  }

  hashSHA256(clave: string): string {
    try {
      // Calcular el hash
      const hash = CryptoJS.SHA256(clave).toString(CryptoJS.enc.Hex);
      return hash;
    } catch (error) {
      console.error("Error al calcular el hash SHA256:", error);
      throw error;
    }
  }

  encriptarConfa(valor: string): string {
    try {
      let respuesta = valor
        .replace(/1/g, "Fb")
        .replace(/2/g, "at")
        .replace(/4/g, "VI")
        .replace(/6/g, "pZ")
        .replace(/7/g, "sH")
        .replace(/9/g, "Dx")
        .replace(/3/g, "Mo")
        .replace(/0/g, "rQ");
      return respuesta;
    } catch (error) {
      console.error("Error al encriptar con Confa:", error);
      throw error;
    }
  }

  mostrarModalRedireccion() {
    setTimeout(() => {
      this.utilitiesService.loading = true;
      this.utilitiesService.messageTitleModal = 'Información';
      this.utilitiesService.messageModal = 'Serás redirigido a la pasarela de pagos!'
      $(".btn-modal-success-payu-t").click();
    }, 500);
  }

  redirigirPago() {
    console.log('redirigir pasarela');
    if (!this.validarEmail(this.infoPago.email)) {
      alert('Por favor ingrese un correo electrónico válido.');
      return;
    }
    //consumo para iniciar Transaccion
    //const radicado = this.encriptar(this.f.radicado.value);
    this.utilitiesService.loading = true;
    //this.infoPago.urlRetorno = 'http://localhost:4200/#/login'
    //this.infoPago.urlRetorno = 'https://app.confa.co:8355/#/login'
    this.infoPago.urlRetorno = `${environment.urlRetornoPagoCompu}`
    //this.infoPago.urlRetorno = this.activatedRoute.snapshot.routeConfig.path + '/#/login';
    //this.infoPago.email = this.formLogin.get("email").value;
    this.authenticationService
      .IniciarTransaccionPayZen(this.infoPago)
      .pipe(first())
      .subscribe((response: RespuestaIniciarTransaccion) => {
        console.log('Respuesta del servicio:', response);
        if (response.message === '' && response.paymentOrderStatus === 'RUNNING') {
          //this.utilitiesService.loading = false;
          // this.showModal = true;
          // $(".btn-modal-success-payu-t").click();
          // $(".close").click();
          // setTimeout(() => {
          // this.showModal = false;
          // this.utilitiesService.loading = false;
          // $(".btn-modal-success-payu-t").click();
          // window.location.href = response.paymentUrl;
          // }, 2000);

          this.utilitiesService.loading = false;
          this.utilitiesService.urlPago = response.paymentUrl;
          this.mostrarModalRedireccion();
          //window.location.href = response.paymentUrl;
        } else {
          this.utilitiesService.messageTitleModal = "Error consultando la información";
          this.utilitiesService.messageModal = response.message
          // this.utilitiesService.errorInfoLogin;

          this.utilitiesService.backLogin = false;

          setTimeout(() => {
            this.utilitiesService.loading = false;
            $(".btn-modal-error").click();
          }, 500);
        }
      });
  }

  redirigirLogin() {
    this.router.navigate(['/login']);
  }

  validarEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}


