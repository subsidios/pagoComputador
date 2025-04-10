import { Component, OnInit } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { WebcamImage } from "ngx-webcam";
import { AuthenticationService } from "../../../services/authentication.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import { CookieService } from "ngx-cookie-service";
import { first } from "rxjs/operators";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AutenticacionLDAPService } from "../../../services/autenticacion-ldap.service";
import { ActivatedRoute } from "@angular/router";

declare var $;

@Component({
  selector: "app-consultar-persona",
  templateUrl: "./consultar-persona.component.html",
  styleUrls: ["./consultar-persona.component.css"],
})
export class ConsultarPersonaComponent implements OnInit {
  toast2: boolean = false;
  toast: boolean = true;
  respuestaFacial: any;
  myIP: string;
  numeroIdentificacion: number;
  formConsulta: FormGroup;
  mostrarCamera: boolean = false;

  constructor(
    public utilitiesService: UtilitiesService,
    private authenticationService: AuthenticationService,
    private cookieService: CookieService,
    private formBuilder: FormBuilder,
    private autenticacionLDAPService: AutenticacionLDAPService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.sendData();
    this.consultarip();
    this.createForm();
    this.validacionTokenDca();
  }

  validacionTokenDca() {
    this.route.queryParams.subscribe((params) => {
      const parametro = params["parM1"];
      if (parametro !== undefined && parametro !== "") {
        this.validacionTokenActivo(parametro);
      }
    });
  }

  validacionTokenActivo(parametro: string) {
    this.utilitiesService.loading = true;
    this.autenticacionLDAPService
      .validarUsuarioInternoLogueo(parametro)
      .subscribe(
        (response) => {
          const responseObject = JSON.parse(JSON.stringify(response));
          if (responseObject.nombre) {
            this.utilitiesService.loading = false;
            this.utilitiesService.fullNameUser = responseObject.nombre;
            this.utilitiesService.fullNameAsesor =
              responseObject.nombreCompleto;
            this.utilitiesService.documentUser = responseObject.documento;
          } else {
            this.logout();
          }
        },
        (error) => {
          this.logout();
        }
      );
  }

  logout() {
    // this.utilitiesService.loading = true;
    this.utilitiesService.messageLoading = null;
    this.utilitiesService.messageTitleModal = "Acceso no autorizado";
    this.utilitiesService.messageModal = "Su sesión ha expirado";
    this.utilitiesService.backLogin = false;
    $(".btn-modal-warning-asesor").click();
    setTimeout(() => {
      this.authenticationService.logout();
    }, 3000);
  }

  createForm() {
    this.formConsulta = this.formBuilder.group({
      document: [
        "",
        [
          Validators.required,
          Validators.min(99999),
          Validators.max(999999999999999),
          Validators.pattern("^[0-9]+"),
        ],
      ],
    });
  }

  enableConsumerCreditsPerson() {
    this.utilitiesService.loading = true;
    this.authenticationService
      .getEnableConsumerModule()
      .pipe(first())
      .subscribe(
        (response: any) => {
          console.log(response);
          if (response.servicioActivo) {
            this.validateFace();
          } else {
            this.utilitiesService.loading = true;
            this.utilitiesService.messageTitleModal = "Acceso no autorizado";
            this.utilitiesService.messageModal =
              "En estos momentos no podemos recibir tu pago ya que el sistema se encuentra en mantenimiento. Inténtalo de nuevo más tarde.";
            this.utilitiesService.backLogin = false;

            setTimeout(() => {
              this.utilitiesService.loading = false;
              $(".btn-modal-warning").click();
            }, 1000);
          }
        },
        (err) => {
          if (err.status == 503) {
            this.utilitiesService.loading = false;
            alert("ALGO NO VA BIEN, Parece que no tienes conexión");
            //   this.toastr.error('ALGO NO VA BIEN, Parece que no tienes conexión', 'Error', { enableHtml: true, positionClass: 'toast-top-center' });
          }
        }
      );
  }

  get getDocument() {
    return (
      this.formConsulta.get("document").invalid &&
      this.formConsulta.get("document").touched
    );
  }

  get f() {
    return this.formConsulta.controls;
  }

  sendData() {
    this.utilitiesService.sendcambioBtnInicio("true");
  }

  public webcamImage: WebcamImage = null;
  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
    this.enableConsumerCreditsPerson();
  }
  consultarip() {
    this.authenticationService.consultarIp().subscribe((response: any) => {
      this.myIP = response.ip;
    });
  }

  validateFace() {
    let currentToken = this.cookieService.get("atoken");
    this.utilitiesService.loading = true;
    this.autenticacionLDAPService
      .validarUsuarioInternoLogueo(currentToken)
      .subscribe(
        (response) => {
          const responseObject = JSON.parse(JSON.stringify(response));
          if (responseObject.nombre) {
            let document2 = this.f.document.value;
            let body = {
              documento: document2,
              image: this.webcamImage.imageAsBase64,
              ip: this.myIP,
            };
            this.authenticationService.identificacionFacial(body).subscribe(
              (response) => {
                this.respuestaFacial =
                  response["RespuestaValidacionFacial"]["respuesta"];
                if (
                  response["RespuestaValidacionFacial"]["mensaje"] ===
                  "Bloqueado por multiples intentos fallidos"
                ) {
                  this.utilitiesService.messageTitleModal =
                    "Bloqueado por multiples intentos fallidos";
                  this.utilitiesService.messageModal =
                    "Apreciado afiliado, el proceso de validación biométrica no fue exitoso. Te invitamos a acercarte a uno de nuestros puntos de atención para obtener mayor información";
                  this.utilitiesService.backLogin = false;

                  setTimeout(() => {
                    this.utilitiesService.loading = false;
                    $(".btn-modal-warning").click();
                  }, 1000);
                }
                if (response["RespuestaValidacionFacial"]["error"] == 3) {
                  this.utilitiesService.messageTitleModal =
                    "Acceso no autorizado";
                  this.utilitiesService.messageModal =
                    response["RespuestaValidacionFacial"]["mensaje"];
                  this.utilitiesService.backLogin = false;

                  setTimeout(() => {
                    this.utilitiesService.loading = false;
                    $(".btn-modal-warning").click();
                  }, 1000);
                }
                this.toast = this.respuestaFacial["resultadoValidacion"];
                if (this.toast == true) {
                  this.consultaRutaDca(this.respuestaFacial["transaccionId"]);
                } else {
                  this.utilitiesService.messageTitleModal =
                    "Acceso no autorizado";
                  if (
                    this.respuestaFacial["detalle"].includes("imagen en S3")
                  ) {
                    this.utilitiesService.messageModal =
                      "Error al guardar la imagen, inténtelo nuevamente";
                  } else {
                    this.utilitiesService.messageModal =
                      this.respuestaFacial["detalle"];
                  }

                  this.utilitiesService.backLogin = false;

                  setTimeout(() => {
                    this.utilitiesService.loading = false;
                    $(".btn-modal-warning").click();
                  }, 1000);
                }
              },
              (err) => {
                console.log("error" + err.status);
                if (err.status == 500) {
                  this.utilitiesService.loading = false;
                  alert("ALGO NO VA BIEN, Parece que no tienes conexión");
                  //   this.toastr.error('ALGO NO VA BIEN, Parece que no tienes conexión', 'Error', { enableHtml: true, positionClass: 'toast-top-center' });
                }
              }
            );
          } else {
            this.logout();
          }
        },
        (error) => {
          this.logout();
        }
      );
  }

  consultaRutaDca(id) {
    // console.log(id);
    let currentToken = this.cookieService.get("atoken");
    let body = {
      numerodocumento: this.f.document.value,
      token: currentToken,
      asesor: this.utilitiesService.fullNameUser,
      direccionip: this.myIP,
      codigovalidacion: id,
    };
    this.authenticationService.rutaDcaRedireccionAsesor(body).subscribe(
      (response) => {
        if (response["codigo"] == "") {
          this.utilitiesService.loading = false;
          console.log(response["URL"]);
          setTimeout(() => {
            window.location.href = response["URL"];
          }, 4000);
        } else {
          this.utilitiesService.loading = false;
          this.utilitiesService.messageLoading = null;
          this.utilitiesService.messageTitleModal = "Acceso no autorizado";
          this.utilitiesService.messageModal = response["mensaje"];
          this.utilitiesService.backLogin = false;
          $(".btn-modal-warning-asesor").click();
        }
      },
      (err) => {
        if (err.status(500)) {
          this.utilitiesService.loading = false;
          alert("ALGO NO VA BIEN, Parece que no tienes conexión");
          //   this.toastr.error('ALGO NO VA BIEN, Parece que no tienes conexión', 'Error', { enableHtml: true, positionClass: 'toast-top-center' });
        }
      }
    );
  }

  validateDocument() {
    this.utilitiesService.loading = true;
    this.utilitiesService.messageModal = "";
    if (this.formConsulta.invalid) {
      Object.values(this.f).forEach((control) => {
        control.markAllAsTouched();
      });
      return;
    } else {
      let currentToken = this.cookieService.get("atoken");
      this.autenticacionLDAPService
        .validarUsuarioInternoLogueo(currentToken)
        .subscribe(
          (response) => {
            const responseObject = JSON.parse(JSON.stringify(response));
            if (responseObject.nombre) {
              this.utilitiesService.loading = true;
              this.utilitiesService.messageLoading = null;
              let documento = this.f.document.value;
              this.autenticacionLDAPService
                .validarFacialPersona(documento)
                .subscribe(
                  (response: any) => {
                    if (response.estado === "1") {
                      this.utilitiesService.loading = true;
                      this.utilitiesService.messageTitleModal =
                        "El usuario cuenta con registro facial.";
                      this.utilitiesService.messageModal = "";
                      this.utilitiesService.backLogin = false;
                      setTimeout(() => {
                        this.utilitiesService.loading = false;
                        $(".btn-modal-success-asesor").click();
                      }, 1000);
                      this.mostrarCamera = true;
                    } else {
                      this.mostrarCamera = false;
                      if (
                        response.mensaje.includes(
                          "usuario no se encuentra registrado"
                        )
                      ) {
                        this.utilitiesService.messageTitleModal =
                          "El usuario no cuenta con registro facial. Es necesario realizar enrolamiento para poder continuar con el proceso";
                      } else {
                        this.utilitiesService.messageTitleModal =
                          response.mensaje;
                      }
                      this.utilitiesService.messageModal = "";
                      this.utilitiesService.backLogin = false;
                      setTimeout(() => {
                        this.utilitiesService.loading = false;
                        $(".btn-modal-error").click();
                      }, 1000);
                    }
                  },
                  (err) => {
                    this.utilitiesService.messageTitleModal =
                      "Error consultando el documento de la persona";
                    this.utilitiesService.messageModal = "";
                    this.utilitiesService.backLogin = false;
                    setTimeout(() => {
                      this.utilitiesService.loading = false;
                      $(".btn-modal-error").click();
                    }, 1000);
                  }
                );
            } else {
              this.logout();
            }
          },
          (error) => {
            this.logout();
          }
        );
    }
  }

  limpiarCampos() {
    this.formConsulta.reset();
    this.mostrarCamera = false;
  }
}
