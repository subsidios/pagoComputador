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
} from "../../interfaces/user.interface";
import { Router, ActivatedRoute } from "@angular/router";
import { first } from "rxjs/operators";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.css"],
})
export class WelcomeComponent implements OnInit {
  login: boolean = false;
  showButtons: boolean = false;
  loading: boolean = false;
  userOrCompany: UserOrCompany;

  constructor(
    private authenticationService: AuthenticationService,
    private cookieService: CookieService,
    private router: Router,
    public utilitiesService: UtilitiesService,
    private activatedRoute: ActivatedRoute
  ) {
    let ptoken =
      this.cookieService.get("ptoken") !== ""
        ? JSON.parse(this.cookieService.get("ptoken"))
        : "";
    let gtoken =
      this.cookieService.get("gtoken") !== ""
        ? JSON.parse(this.cookieService.get("gtoken"))
        : "";
    this.userOrCompany =
      localStorage.getItem("userOrCompany") !== ""
        ? JSON.parse(localStorage.getItem("userOrCompany"))
        : null;
    if (ptoken) {
      this.loadCurrentUser();
    }

    // Se envia gtoken porque es necesario para consumir los servicios que se consultan después
    if (gtoken && this.userOrCompany !== null) {
      if (this.userOrCompany.document) {
        this.loadUserWithoutAuth(gtoken);
      }
    }

    let path = this.activatedRoute.snapshot.routeConfig.path;
    if (
      path === "libreInversion" ||
      path === "vehiculo" ||
      path === "vivienda" ||
      path === "cartera"
    ) {
      this.showButtons = true;
    }
  }

  ngOnInit() {}

  backPage() {
    this.router.navigate(["/home"]);
  }

  logout() {
    this.utilitiesService.loading = true;
    this.utilitiesService.messageLoading = null;
    setTimeout(() => {
      this.authenticationService.logout();
      this.utilitiesService.currentUser = null;
      this.utilitiesService.nasfaUser = null;
      this.router.navigate(["/login"]);
      this.utilitiesService.loading = false;
    }, 500);
  }

  loadCurrentUser() {
    this.validateLogin()
      .then(() => {
        let currentUser = this.utilitiesService.currentUser;
        if (currentUser) {
          this.login = true;
          this.utilitiesService.fullNameUser =
            currentUser.primerNombre +
            " " +
            currentUser.segundoNombre +
            " " +
            currentUser.primerApellido +
            " " +
            currentUser.segundoApellido;
          this.utilitiesService.documentUser = currentUser.documento;
        }
      })
      .catch((err) => {
        this.login = false;
        this.utilitiesService.currentUser = null;
      });
  }

  private validateLogin(): Promise<void>  {
    let ptoken = JSON.parse(this.cookieService.get("ptoken"));
    this.loading = true;

    return new Promise((resolve, reject) => {
      this.authenticationService
        .loginNew(ptoken.token)
        .pipe(first())
        .subscribe((response: Session) => {
          // console.log(response);
          if (!response["mensaje"]) {
            this.utilitiesService.currentUser = response.usuario;
            this.loading = false;
            resolve();
          } else {
            this.loading = false;
            reject();
          }
        });
    });
  }

  loadUserWithoutAuth(gtoken: Token) {
    this.validateUserWithoutAuth(gtoken)
      .then(() => {
        let nasfaUser = this.utilitiesService.nasfaUser;
        if (nasfaUser) {
          this.login = true;
          this.utilitiesService.fullNameUser =
            nasfaUser.primerNombre +
            " " +
            nasfaUser.segundoNombre +
            " " +
            nasfaUser.primerApellido +
            " " +
            nasfaUser.segundoApellido;
          this.utilitiesService.documentUser = nasfaUser.documento;
        }
      })
      .catch((err) => {
        this.login = false;
        this.utilitiesService.nasfaUser = null;
      });
  }

  validateUserWithoutAuth(gtoken: Token): Promise<void>  {
    let user: UserOrCompany = JSON.parse(localStorage.getItem("userOrCompany"));
    this.loading = true;

    return new Promise((resolve, reject) => {
      this.authenticationService
        .validateToken(gtoken.token)
        .pipe(first())
        .subscribe((response: ValidateToken) => {
          // console.log(response);
          if (response.valido) {
            this.authenticationService
              .consultUserInformationNASFA(user.document)
              .pipe(first())
              .subscribe((response: User) => {
                // console.log(response);
                if (response.usuarioNasfa) {
                  this.utilitiesService.nasfaUser = response;
                  this.loading = false;
                  resolve();
                } else {
                  this.loading = false;
                  reject();
                }
              });
          } else {
            this.loading = false;
            reject();
          }
        });
    });
  }
}
