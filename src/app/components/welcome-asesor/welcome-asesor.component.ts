import { Component, OnInit } from "@angular/core";

import { AuthenticationService } from "../../services/authentication.service";
import { CookieService } from "ngx-cookie-service";
import { UtilitiesService } from "../../services/utilities.service";
import {
  User,
  UserOrCompany,
  Token,
  ValidateToken,
  Session,
  resValidaUser,
  Asistente,
} from "../../interfaces/user.interface";
import { Router, ActivatedRoute } from "@angular/router";
import { first } from "rxjs/operators";
import { AutenticacionLDAPService } from "../../services/autenticacion-ldap.service";

@Component({
  selector: "app-welcome-asesor",
  templateUrl: "./welcome-asesor.component.html",
  styleUrls: ["./welcome-asesor.component.css"],
})
export class WelcomeAsesorComponent implements OnInit {
  login: boolean = false;
  showButtons: boolean = false;
  loading: boolean = false;
  userOrCompany: UserOrCompany;
  constructor(
    private authenticationService: AuthenticationService,
    private cookieService: CookieService,
    private router: Router,
    public utilitiesService: UtilitiesService,
    private activatedRoute: ActivatedRoute,
    private autenticacionLDAPService: AutenticacionLDAPService
  ) {
    let atoken =
      this.cookieService.get("atoken") !== ""
        ? this.cookieService.get("atoken")
        : "";
    if (atoken) {
      this.validateLogin();
    } else {
      this.logout();
    }
    // Se envia atoken porque es necesario para consumir los servicios que se consultan después
    if (atoken) {
      if (this.utilitiesService.documentUser) {
        this.loadUserWithoutAuth(atoken);
      }
    }
  }

  ngOnInit() {
    this.validateLogin();
  }

  backPage() {
    /* this.router.navigate(["/loginAsesor"]);*/
  }

  logout() {
    this.utilitiesService.loading = true;
    this.utilitiesService.messageLoading = null;

    setTimeout(() => {
      this.authenticationService.logout();
      this.utilitiesService.currentUser = null;
      this.utilitiesService.fullNameUser = null;
      this.utilitiesService.fullNameAsesor = null;
      this.utilitiesService.documentUser = null;
      this.utilitiesService.nasfaUser = null;
      this.router.navigate(["/loginAsesor"]);
      this.utilitiesService.loading = false;
    }, 500);
  }

  loadCurrentUser() {}

  loadUserWithoutAuth(atoken: String) {
    this.login = true;
  }

  private validateLogin() {
    let atoken = this.cookieService.get("atoken");
    if (atoken != null && atoken != "") {
      this.loading = true;
      this.autenticacionLDAPService
        .validarUsuarioInternoLogueo(atoken)
        .subscribe(
          (response) => {
            const responseObject = JSON.parse(JSON.stringify(response));
            if (responseObject.nombre) {
              this.login = true;
              this.loading = false;
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
    } else {
      this.logout();
    }
  }
}
