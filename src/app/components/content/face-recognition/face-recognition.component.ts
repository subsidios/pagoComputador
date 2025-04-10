import { Component, OnInit } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { WebcamImage } from "ngx-webcam";
import { AuthenticationService } from "../../../services/authentication.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import { CookieService } from "ngx-cookie-service";
import { first } from "rxjs/operators";
import { Session } from "src/app/interfaces/user.interface";

declare var $;

@Component({
  selector: "app-face-recognition",
  templateUrl: "./face-recognition.component.html",
  styleUrls: ["./face-recognition.component.css"],
})
export class FaceRecognitionComponent implements OnInit {
  toast2: boolean = false;
  toast: boolean = true;
  respuestaFacial: any;
  myIP: string;

  constructor(
    public utilitiesService: UtilitiesService,
    private authenticationService: AuthenticationService,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    this.sendData();
    this.consultarip();

    /* this.utilitiesService.messageTitleModal = "Tener en cuenta";
    this.utilitiesService.messageModal =
  "Estamos realizando ajustes en el sistema de InstaCrédito, motivo por el cual estará inhabilitado hasta el 31 de diciembre. Recuerda que en el canal digital puedes acceder al crédito de pago por libranza y pignoración del subsidio ya que estos continúan habilitados.\n\nAgradecemos tu comprensión y te deseamos un feliz año.";

    this.utilitiesService.backLogin = false;

    setTimeout(() => {
      this.utilitiesService.loading = false;
      $(".btn-modal-warning").click();
    }, 1000); */
  }

  enableConsumerCreditsPerson() {
    this.utilitiesService.loading = true;
    this.authenticationService
      .getEnableConsumerModule()
      .pipe(first())
      .subscribe(
        (response: any) => {
          // console.log(response);
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
    let body = {
      documento: this.utilitiesService.documentUser,
      image: this.webcamImage.imageAsBase64,
      ip: this.myIP,
    };
    this.authenticationService.identificacionFacial(body).subscribe(
      (response) => {
        //console.log(response);
        this.respuestaFacial =
          response["RespuestaValidacionFacial"]["respuesta"];
        if (
          response["RespuestaValidacionFacial"]["mensaje"] ===
          "Bloqueado por multiples intentos fallidos"
        ) {
          this.utilitiesService.loading = true;
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
          this.utilitiesService.loading = true;
          this.utilitiesService.messageTitleModal = "Acceso no autorizado";
          this.utilitiesService.messageModal =
            response["RespuestaValidacionFacial"]["mensaje"];
          this.utilitiesService.backLogin = false;

          setTimeout(() => {
            this.utilitiesService.loading = false;
            $(".btn-modal-warning").click();
          }, 1000);
        }
        this.toast = this.respuestaFacial["resultadoValidacion"];
        //this.toast2 = true;
        if (this.toast == true) {
          console.log("ENTRO AQUI");
          this.consultaRutaDca(this.respuestaFacial["transaccionId"]);
        } else {
          this.utilitiesService.loading = true;
          this.utilitiesService.messageTitleModal = "Acceso no autorizado";
          this.utilitiesService.messageModal = this.respuestaFacial["detalle"];
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
  }

  consultaRutaDca(id) {
    // console.log(id);
    let currentToken = JSON.parse(this.cookieService.get("ptoken"));
    let body = {
      numerodocumento: this.utilitiesService.documentUser,
      token: currentToken.token,
      direccionip: this.myIP,
      codigovalidacion: id,
    };
    this.authenticationService.rutaDcaRedireccion(body).subscribe(
      (response) => {
        if (response["codigo"] == "") {
          this.utilitiesService.loading = false;
          console.log(response["URL"]);
          setTimeout(() => {
            window.location.href = response["URL"];
          }, 4000);
        } else {
          this.utilitiesService.loading = false;
        }
      },
      (err) => {
        if (err.status(500)) {
          this.utilitiesService.loading = false;
          alert("ALGO NO VA BIEN, Parece que no tienes conexión");
        }
      }
    );
  }
}
