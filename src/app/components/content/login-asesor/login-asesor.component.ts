import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { first } from "rxjs/operators";
import {
  PreguntasUser,
  Token,
  User,
  ValidateQuestion,
} from "src/app/interfaces/user.interface";
import { AuthenticationService } from "src/app/services/authentication.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import { CardRegisterFormComponent } from "../../card-register-form/card-register-form.component";
declare var $;

@Component({
  selector: "app-login-asesor",
  templateUrl: "./login-asesor.component.html",
  styleUrls: ["./login-asesor.component.css"],
})
export class LoginAsesorComponent implements OnInit {
  @ViewChild(CardRegisterFormComponent, { static: false })
  childComponent: CardRegisterFormComponent;
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
      this.cookieService.get("atoken") !== ""
        ? this.cookieService.get("atoken")
        : null;
    if (currentToken) {
      this.router.navigate(["/consultar-persona"]);
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

  processFormLogin(formLogin: FormGroup) {
    this.formLoginEmitter = formLogin;
    formLogin.reset({
      document: "",
      password: "",
    });
  }

  processFormForgotPassword(formForgotPassword: FormGroup) {
    this.formForgotPasswordEmitter = formForgotPassword;
    formForgotPassword.reset({
      document: "",
    });
  }

  processFormValidate(formValidate: FormGroup) {
    this.formValidateEmitter = formValidate;
    formValidate.reset({
      document: "",
    });
  }

  cleanForm() {
    this.processFormLogin(this.formLoginEmitter);
    this.processFormForgotPassword(this.formForgotPasswordEmitter);
    this.processFormValidate(this.formValidateEmitter);
  }
}
