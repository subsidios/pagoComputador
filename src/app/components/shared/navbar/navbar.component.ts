import { Component, OnInit } from "@angular/core";

import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { AuthenticationService } from "../../../services/authentication.service";
import { UtilitiesService } from "../../../services/utilities.service";
import { environment } from "src/environments/environment";
import {
  Session,
  Token,
  User,
  UserOrCompany,
  ValidateToken,
} from "src/app/interfaces/user.interface";
import { CookieService } from "ngx-cookie-service";
import { first } from "rxjs/operators";
import { Subscription } from "rxjs";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  public environment = environment;
  login: boolean = false;
  loading: boolean = false;
  showButtons: boolean = false;
  userOrCompany: UserOrCompany;
  $subs: Subscription;
  puedeIngresar: Boolean = true;
  constructor(
    private router: Router,
    private cookieService: CookieService,
    private authenticationService: AuthenticationService,
    public utilitiesService: UtilitiesService,
    private activatedRoute: ActivatedRoute
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('Current URL:', event.url);
        if (event.url.includes('modify') || event.url.includes('questions')) {
          this.puedeIngresar = false;
        }else{
          this.puedeIngresar = true;
        }
      }
    });

   
    
    this.userOrCompany =
      localStorage.getItem("userOrCompany") !== ""
        ? JSON.parse(localStorage.getItem("userOrCompany"))
        : null;
      let gtoken =
      this.cookieService.get("gtoken") !== ""
        ? JSON.parse(this.cookieService.get("gtoken"))
        : "";
      let ptoken =
        this.cookieService.get("ptoken") !== ""
          ? JSON.parse(this.cookieService.get("ptoken"))
          : "";
      /* let user =
        localStorage.getItem("user") !== ""
          ? JSON.parse(localStorage.getItem("user"))
          : null;
      let cc =
        localStorage.getItem("cc") !== ""
          ? JSON.parse(localStorage.getItem("cc"))
          : null;
     
    if (ptoken != "") {
      if (user == null || cc == null || preguntas == null) {
       this.authenticationService
          .loginNew(ptoken.token)
          .pipe(first())
          .subscribe((response: Session) => {
           this.utilitiesService.currentUser = response.usuario;
            if (response.usuario.existeUsuario) {
              this.login = true;
              this.utilitiesService.loading = false;
            }
          });
      } else {
        this.utilitiesService.currentUser =user;
        this.login = true;
        this.utilitiesService.loading = false;
        
      }
    }else{
      this.login = false;
    } */
   
    if (ptoken) {
      this.loadCurrentUser();
    }

    // Se envia gtoken porque es necesario para consumir los servicios que se consultan después
    if (gtoken && this.userOrCompany !== null) {
      if (this.userOrCompany.document) {
        this.loadUserWithoutAuth(gtoken);
      }
    }

    // let path = this.activatedRoute.snapshot.routeConfig.path;
    // console.log(path);
    // if (
    //   path === "libreInversion" ||
    //   path === "vehiculo" ||
    //   path === "vivienda" ||
    //   path === "cartera"
    // ) {
    //   this.showButtons = true;
    // }
  }

  ngOnInit() {
    this.$subs = this.utilitiesService
      .receivedcambioBtnInicio()
      .subscribe((datas) => {
        if (datas == "false") {
          this.login = false;
        } else {
          this.login = true;
        }
        //console.log("datas ", datas, "login ", this.userOrCompany);
      });
  }

  logout() {
    this.utilitiesService.loading = true;
    this.utilitiesService.messageLoading = null;
    setTimeout(() => {
      this.login = false;
      this.authenticationService.logout();
      this.utilitiesService.currentUser = null;
      this.utilitiesService.nasfaUser = null;
      this.router.navigate(["/login"]);
      this.utilitiesService.loading = false;
    }, 500);
  }

  getShortName(fullName) {
    if (fullName) {
      let nombre = fullName.split(" ");
      return nombre[0];
    } else {
      return "Iniciar sesión";
    }
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
        .login(ptoken.token)
        .pipe(first())
        .subscribe((response: User) => {
          // console.log(response);
          if (!response["mensaje"]) {
            this.utilitiesService.currentUser = response;
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

  validateUserWithoutAuth(gtoken: Token) : Promise<void> {
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
  
  irMiPerfilConfa() {
    this.utilitiesService.loading = true;
    setTimeout(() => {
      this.router.navigate(['/miPerfilConfa']);
      this.utilitiesService.loading = false;
    }, 500);
  }
}
