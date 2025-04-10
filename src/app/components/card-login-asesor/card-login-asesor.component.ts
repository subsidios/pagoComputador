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
  resValidaUser,
} from "../../interfaces/user.interface";
import { UtilitiesService } from "../../services/utilities.service";
import { CookieService } from "ngx-cookie-service";
import { AutenticacionLDAPService } from "../../services/autenticacion-ldap.service";

declare var $;

@Component({
  selector: "app-card-login-asesor",
  templateUrl: "./card-login-asesor.component.html",
  styleUrls: ["./card-login-asesor.component.css"],
})
export class CardLoginAsesorComponent implements OnInit {
  formLogin: FormGroup;
  returnUrl: string;
  @Output() formLoginEmitter: EventEmitter<FormGroup> = new EventEmitter();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    public utilitiesService: UtilitiesService,
    private cookieService: CookieService,
    private autenticacionLDAPService: AutenticacionLDAPService
  ) {
    this.createForm();
  }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    // obtener retorno de los parametros route de la url o por defecto a '/'
    this.returnUrl = `/consultar-persona`;
    this.formLoginEmitter.emit(this.formLogin);
  }

  createForm() {
    this.formLogin = this.formBuilder.group({
      user: ["", [Validators.required, Validators.pattern("^[a-zA-Z-_ ]+$")]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  // convenience getter for easy access to form fields
  // un práctico buscador para facilitar el acceso a los campos de los formularios
  get f() {
    return this.formLogin.controls;
  }

  get getUser() {
    return (
      this.formLogin.get("user").invalid && this.formLogin.get("user").touched
    );
  }

  get getPassword() {
    return (
      this.formLogin.get("password").invalid &&
      this.formLogin.get("password").touched
    );
  }

  onSubmitInterno() {
    if (this.formLogin.invalid) {
      Object.values(this.f).forEach((control) => {
        control.markAllAsTouched();
      });
      return;
    } else {
      let user = this.f.user.value.toLowerCase();
      let password = this.f.password.value;

      if (user !== "" && password !== "") {
        this.utilitiesService.messageLoading = null;
        this.utilitiesService.loading = true;
        this.authenticationService
          .getAsesorToken(user)
          .pipe(first())
          .subscribe((responseTING: Token) => {
            if (responseTING.token) {
              this.autenticacionLDAPService
                .validarUsuarioInterno(user, password)
                .pipe(first())
                .subscribe((response: resValidaUser) => {
                  if (response.salida == "OK" && response.estado == 1) {
                    const response2 = JSON.parse(response.asistente.toString());
                    if (response2.nombre != null && response2.nombre != "") {
                      this.utilitiesService.messageLoading = `Bienvenido ${response2.nombreCompleto} `;
                      this.utilitiesService.fullNameUser = response2.nombre;
                      this.utilitiesService.documentUser = response2.documento;
                      this.utilitiesService.fullNameAsesor =
                        response2.nombreCompleto;
                      setTimeout(() => {
                        this.utilitiesService.loading = false;
                        this.router.navigate([this.returnUrl]);
                      }, 1000);
                    } else {
                      this.utilitiesService.messageTitleModal =
                        "No tiene permisos en el aplicativo";
                      this.utilitiesService.messageModal = "";
                      this.utilitiesService.backLogin = false;
                      setTimeout(() => {
                        this.utilitiesService.loading = false;
                        $(".btn-modal-error").click();
                      }, 1000);
                    }
                  } else {
                    this.utilitiesService.messageTitleModal = response.error;
                    this.utilitiesService.messageModal = "";
                    this.utilitiesService.backLogin = false;
                    setTimeout(() => {
                      this.utilitiesService.loading = false;
                      $(".btn-modal-error").click();
                    }, 1000);
                  }
                });
            }
          });
      }
    }
  }
}
