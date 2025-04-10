import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { first } from "rxjs/operators";
import { PreguntasUser, Token, User, ValidateQuestion } from "src/app/interfaces/user.interface";
import { AuthenticationService } from "src/app/services/authentication.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import { CardRegisterFormComponent } from "../../card-register-form/card-register-form.component";
declare var $;
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  @ViewChild(CardRegisterFormComponent, { static: false }) childComponent: CardRegisterFormComponent;
  public tamano = false;
  user: User;
  respuesta: Boolean = false;
  token: Token;
  preguntas: PreguntasUser;
  respuestasList: any = [];
  intentosValidos: number = 3;
  
  formLoginEmitter: FormGroup;
  formForgotPasswordEmitter: FormGroup;
  formValidateEmitter: FormGroup;

  constructor(
    private router: Router,
    public cookieService: CookieService,
    public utilitiesService: UtilitiesService,
    private authenticationService: AuthenticationService
  ) {
    utilitiesService.loading = true;
    setTimeout(function () {
      utilitiesService.loading = false;
    }, 1000);
    let currentToken =
      this.cookieService.get("ptoken") !== ""
        ? JSON.parse(this.cookieService.get("ptoken"))
        : null;
    if (currentToken) {
      this.router.navigate(["/validar-rostro"]);
    }
  }

  ngOnInit() {
    this.sendData();
  }

  sendData() {
    this.utilitiesService.sendcambioBtnInicio("false");
  }

  modal() {
    this.tamano = !this.tamano;
  }

  processUser(user: User) {
    this.user = user;
    console.log("Event emitter user", user);
    this.childComponent.fullNameDisabled();
  }

  processRespuesta(res: Boolean) {
    this.respuesta = res;
    console.log("Event emitter respuesta", res);
  }

  processPreguntas(preguntas: PreguntasUser) {
    this.preguntas = preguntas;
    console.log("Event emitter preguntas", preguntas);
  }

  processRespuestas(res: any) {
    this.respuestasList = [];
    this.respuestasList = res;
    console.log("Event emitter respuesta List", res);
    this.guardarRespuestas(res);
  }

  guardarRespuestas(respuestas: any) {
    this.utilitiesService.messageLoading = "Cargando, por favor espera"
    this.utilitiesService.loading = true;
    this.authenticationService.validateQuestion(this.user.documento, respuestas, "R")
      .pipe(first())
      .subscribe((res: ValidateQuestion) => {
        if (res.estado == 0) {
          this.utilitiesService.messageTitleModal = "¡Intentalo nuevamente!";
          this.utilitiesService.messageModal =     "Ha ocurrido un error, Por favor intentalo nuevamente";
          this.utilitiesService.backLogin = false;
          setTimeout(() => {
            $(".btn-modal-error").click();
            this.utilitiesService.loading = false;
          }, 1000);
        } else if (res.estado == 1) {
          if (res.respuesta == true) {
            this.respuesta = res.respuesta;
            this.utilitiesService.loading = false;
            $(".btn-close-form-questions").click();
            setTimeout(() => {
              $(".btn-form-register").click();
            }, 500);
          } else if (res.respuesta == false) {
            if (res.bloqueo == true) {
              this.utilitiesService.messageTitleModal = "¡No puedes continuar!";
              this.utilitiesService.messageModal = "No pudimos realizar la validación de tus datos, por favor realiza la revisión de ellos comunicándote al siguiente correo: confa@confa.co";
              this.utilitiesService.backLogin = true;
              setTimeout(() => {
                $(".btn-close-form-questions").click();
                $(".btn-modal-error").click();
                this.utilitiesService.loading = false;
              }, 1000);
            } else if (res.bloqueo == false) {
              let cuantosintentosQuedan: number = this.intentosValidos - res.intentos;
              let intentotext = cuantosintentosQuedan == 1 ? 'intento ' : 'intentos ';
              this.utilitiesService.messageTitleModal = "¡Ten cuidado!";
              this.utilitiesService.messageModal = "Los datos ingresados no son correctos, tienes " + cuantosintentosQuedan + " " + intentotext + " más para  validar tus datos";
              this.utilitiesService.backLogin = false;
              setTimeout(() => {
                $(".btn-close-form-questions").click();
                $(".btn-modal-error-questions-register").click();
                this.utilitiesService.loading = false;
              }, 1000);
            }
          }
        }
      });
  }

  processFormLogin(formLogin: FormGroup) {
    this.formLoginEmitter = formLogin;
    formLogin.reset({
      document: '',
      password: ''
    });
  }

  processFormForgotPassword(formForgotPassword: FormGroup) {
    this.formForgotPasswordEmitter = formForgotPassword;
    formForgotPassword.reset({
      document: ''
    });
  }

  processFormValidate(formValidate: FormGroup) {
    this.formValidateEmitter = formValidate;
    formValidate.reset({
      document: ''
    });
  }

  cleanForm() {
    this.processFormLogin(this.formLoginEmitter);
    this.processFormForgotPassword(this.formForgotPasswordEmitter);
    this.processFormValidate(this.formValidateEmitter);
  }
}
