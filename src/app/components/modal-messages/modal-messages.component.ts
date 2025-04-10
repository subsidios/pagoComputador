import { Component, OnInit } from "@angular/core";

import { UtilitiesService } from "../../services/utilities.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "../../services/authentication.service";
import { User } from "../../interfaces/user.interface";
import { first } from "rxjs/operators";
import { AttentionService } from "src/app/services/attention.service";

declare var $;

@Component({
  selector: "app-modal-messages",
  templateUrl: "./modal-messages.component.html",
  styleUrls: ["./modal-messages.component.css"],
})
export class ModalMessagesComponent implements OnInit {
  constructor(
    public attentionService: AttentionService,
    public utilitiesService: UtilitiesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) {
    this.confirmUser();
  }

  ngOnInit() {}

  confirmUser() {
    let confirmUser =
      this.activatedRoute.snapshot.queryParams[
        "34240997a16763c011134c570fcc149e"
      ];
    if (confirmUser) {
      this.utilitiesService.loading = true;
      this.authenticationService
        .confirmUserRegistrationConfa(confirmUser)
        .pipe(first())
        .subscribe((response: User) => {
          if (response.documento !== "") {
            // console.log(response);
            this.utilitiesService.messageTitleModal = "Registro exitoso";
            this.utilitiesService.messageModal =
              "Confirmación de registro exitoso.";
            this.utilitiesService.backLogin = true;

            setTimeout(() => {
              this.utilitiesService.loading = false;
              $(".btn-modal-success").click();
            }, 1000);
          } else {
            this.utilitiesService.messageTitleModal = "Registro fallido";
            this.utilitiesService.messageModal =
              "La confirmación de registro no fue exitosa o ya ha sido confirmada.";
            this.utilitiesService.backLogin = true;

            setTimeout(() => {
              this.utilitiesService.loading = false;
              $(".btn-modal-error").click();
            }, 1000);
          }
        });
    }
  }

  backLogin(success: boolean) {
    let confirmUser =
      this.activatedRoute.snapshot.queryParams[
        "34240997a16763c011134c570fcc149e"
      ];
    if (confirmUser && success) {
      this.router.navigate(["/login"]);
    }

    let changePassword =
      this.activatedRoute.snapshot.queryParams[
        "e541f24f0b06368c9cfb418174699da5"
      ];
    if (changePassword && success) {
      this.router.navigate(["/login"]);
    }

    if (success) {
      this.authenticationService.logout();
      this.router.navigate(["/login"]);
    }
    this.utilitiesService.recoveryEmail = null;
  }

  backLogin2(success: boolean) {
    if (success) {
      this.authenticationService.logout();
      this.router.navigate(["/login"]);
    }
    let path = this.activatedRoute.snapshot.routeConfig.path;
    if (path === "login") {
      setTimeout(() => {
        $(".btn-form-questions").click();
      }, 500);
    }

    this.utilitiesService.recoveryEmail = null;
  }

  backHome(success: boolean) {
    if (success) {
      this.router.navigate(["/home"]);
    }
  }

  continue(home: boolean, modify: boolean) {
    console.log(" ---", home);
    console.log(" ---", modify);
    if (home) {
      this.utilitiesService.backHome = false;
      this.router.navigate(["/"]);
    } else if (modify) {
      this.utilitiesService.backModify = false;
      console.log("entra a Modify");
      setTimeout(() => {
        this.utilitiesService.loading = false;
        this.router.navigate(["/modify"]);
      }, 500);
    }
  }
  navigatecreditsimulador() {
    this.router.navigate(["/home"]);
  }

  reload() {
    window.location.reload();
  }

  cerrarModalAsesor() {
    this.authenticationService.logout();
    this.utilitiesService.currentUser = null;
    this.utilitiesService.fullNameUser = null;
    this.utilitiesService.fullNameAsesor = null;
    this.utilitiesService.documentUser = null;
    this.utilitiesService.nasfaUser = null;
    this.utilitiesService.loading = false;
    window.location.href = "#/loginAsesor";
  }

  redirigirPago(){
    window.location.href = this.utilitiesService.urlPago;
  }
}
