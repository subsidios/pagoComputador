import { Injectable } from "@angular/core";
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

import { AuthenticationService } from "../services/authentication.service";
import { first } from "rxjs/operators";
import { ValidateToken, Token } from "../interfaces/user.interface";
import { CookieService } from "ngx-cookie-service";
import { UtilitiesService } from "../services/utilities.service";

declare var $;

@Injectable({ providedIn: "root" })
export class AuthGuard  {
  validateToken: boolean = false;
  message: string;
  type: string;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private cookieService: CookieService,
    public utilitiesService: UtilitiesService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // const currentToken = this.authenticationService.currentTokenValue;
    let currentToken =
      this.cookieService.get("ptoken") !== ""
        ? JSON.parse(this.cookieService.get("ptoken"))
        : null;
    // console.log("currentToken", currentToken);

    if (currentToken) {
      return this.validate(currentToken, "E")
        .then(() => {
          // logged in so return true
          // conectado para que el retorno sea verdadero
          // console.log("validateToken", this.validateToken);
          if (this.validateToken) {
            return true;
          }
        })
        .catch((err) => {
          this.utilitiesService.loading = false;
          this.modalTokenExpired();
          return false;
        });
    }

    // not logged in so redirect to login page with the return url
    // no está conectado, así que redirecciona a la página de acceso con la url de retorno
    this.utilitiesService.fullNameUser = null;
    this.router.navigate(["/login"]); // , { queryParams: { returnUrl: state.url } }
    // console.log("validateToken", this.validateToken);
    return false;
  }

  private validate(currentToken: Token, tokenType: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.authenticationService
        .validateToken(currentToken.token)
        .pipe(first())
        .subscribe((response: ValidateToken) => {
          if (response.valido && response.tipo == tokenType) {
            this.validateToken = true;
            resolve();
          } else {
            this.utilitiesService.currentUser = null;
            this.validateToken = false;
            this.message = response.mensaje;
            this.type = response.tipo;
            reject();
          }
        });
    });
  }

  modalTokenExpired() {
    if (!this.validateToken && this.message === "02--El Token Expiró") {
      this.utilitiesService.loading = true;

      this.utilitiesService.messageTitleModal = "Su sesión ha expirado";
      this.utilitiesService.messageModal =
        "Su sesión ha llegado al tiempo de caducidad, inicie sesión nuevamente";
      this.utilitiesService.backLogin = true;

      setTimeout(() => {
        this.utilitiesService.loading = false;
        this.router.navigate(["/login"]);
        $(".btn-modal-token-expired").click();
      }, 1000);
    }
  }
}
