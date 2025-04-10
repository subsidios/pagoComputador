import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute, NavigationEnd } from "@angular/router";
import { first } from "rxjs/operators";
import { Token, User } from "src/app/interfaces/user.interface";
import { AuthenticationService } from "src/app/services/authentication.service";
import { UtilitiesService } from "src/app/services/utilities.service";
declare var $;
@Component({
  selector: "app-confirm",
  templateUrl: "./confirm.component.html",
  styleUrls: ["./confirm.component.css"],
})
export class ConfirmComponent implements OnInit {
  public redirectTo = null;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    public utilitiesService: UtilitiesService
  ) {}

  ngOnInit() {
    /* let data =
      this.route.snapshot.queryParams["34240997a16763c011134c570fcc149e"];
    this.redirectTo = this.route.snapshot.params.to;
    this.confirmData(data); */

    let data =
    this.route.snapshot.queryParams["34240997a16763c011134c570fcc149e"];
    if (data) {
      this.redirectTo = this.route.snapshot.params.to;
      this.confirmData(data);
    } else {
      alert("no tiene ruta");
      this.router.navigate(["/"]);
    }
  }

  confirmData(code) {

    this.authenticationService
      .getGenericToken()
      .pipe(first())
      .subscribe((response: Token) => {
        this.authenticationService. confirmUserRegistrationConfa(code).subscribe(
          (response: User) => {
            this.authenticationService.logout();
            if (response.documento !== "") {
              this.utilitiesService.messageTitleModal = "Registro exitoso";
              this.utilitiesService.messageModal =
                "Confirmación de registro exitoso.";
              this.utilitiesService.backLogin = true;
              setTimeout(() => {
                this.utilitiesService.loading = false;
                $(".btn-modal-success").click();
              }, 1000);
              this.router.navigate(["/"]);
            } else {
              this.utilitiesService.messageTitleModal = "Registro fallido";
              this.utilitiesService.messageModal =
                "La confirmación de registro no fue exitosa o ya ha sido confirmada.";
              this.utilitiesService.backLogin = true;

              setTimeout(() => {
                this.utilitiesService.loading = false;
                $(".btn-modal-error").click();
              }, 1000);
              this.router.navigate(["/"]);
            }
          },
          (err) => {
            if (err.status == 503) {
              alert("ALGO NO VA BIEN, Parece que no tienes conexión");
              //   this.toastr.error('ALGO NO VA BIEN, Parece que no tienes conexión', 'Error', { enableHtml: true, positionClass: 'toast-top-center' });
            }
          }
        );
      });
  }
  confirmData1(code) {
    this.authenticationService.confirmUserRegistrationConfa(code).subscribe(
      (response: any) => {
        if (this.redirectTo) {
          this.router.navigate([this.redirectTo]);
        } else {
          this.router.navigate(["/"]);
        }
      },
      (err) => {
        if (err.status == 503) {
          alert("ALGO NO VA BIEN, Parece que no tienes conexión");
          //   this.toastr.error('ALGO NO VA BIEN, Parece que no tienes conexión', 'Error', { enableHtml: true, positionClass: 'toast-top-center' });
        }
      }
    );
  }
}
