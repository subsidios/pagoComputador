import { DatePipe } from "@angular/common";
import { Component, OnInit, Type, PipeTransform } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { first } from "rxjs/operators";
import { Session, Token, User } from "src/app/interfaces/user.interface";
import { AuthenticationService } from "src/app/services/authentication.service";
import { UtilitiesService } from "src/app/services/utilities.service";
declare var $;
@Component({
  selector: "app-modify-info-user",
  templateUrl: "./modify-info-user.component.html",
  styleUrls: ["./modify-info-user.component.css"],
})
export class ModifyInfoUserComponent implements OnInit {
  user: User;
  formUpdate: FormGroup;
  submitted: boolean = false;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    public utilitiesService: UtilitiesService,
    private cookieService: CookieService
  ) {
    let ptoken =
      this.cookieService.get("ptoken") !== ""
        ? JSON.parse(this.cookieService.get("ptoken"))
        : "";
    let user =
      localStorage.getItem("user") !== ""
        ? JSON.parse(localStorage.getItem("user"))
        : null;
    let cc =
      localStorage.getItem("cc") !== ""
        ? JSON.parse(localStorage.getItem("cc"))
        : null;
    if (ptoken != "") {
      if (user == null || cc == null) {
        this.authenticationService
          .loginNew(ptoken.token)
          .pipe(first())
          .subscribe((response: Session) => {
            this.utilitiesService.currentUser = response.usuario;
            this.user = response.usuario;
            if (response.usuario.existeUsuario) {
              /*   console.log("guardamos al informacion del usuario"); */
              localStorage.setItem("user", JSON.stringify(response));
              localStorage.setItem("cc", response.usuario.documento);
            }
          });
      } else {
        this.user = user;
      }
    }
  }

  ngOnInit() {
    this.utilitiesService.loading = true;
    let ptoken =
      this.cookieService.get("ptoken") !== ""
        ? JSON.parse(this.cookieService.get("ptoken"))
        : "";
    if (ptoken) {
      this.authenticationService
        .loginNew(ptoken.token)
        .pipe(first())
        .subscribe((response: Session) => {
          this.utilitiesService.currentUser = response.usuario;
          this.user = response.usuario;
          if (response.usuario.existeUsuario) {
          }

          if (
            this.user.tipoDocumento.trim() != "" &&
            this.user.celular.trim() != "" &&
            this.user.fechaNacimiento.trim() != "" &&
            this.user.direccion.trim() != ""
          ) {
            this.utilitiesService.loading = false;
            this.utilitiesService.messageTitleModal =
              "¡Tu información está completa!";
            this.utilitiesService.messageModal =
              "Presiona 'Continuar' para seguir usando nuestros servicios.";
            this.utilitiesService.backHome = true;
            setTimeout(() => {
              $(".btn-modal-success-validate").click();
            }, 1000);
          }

          if (
            this.user.tipoDocumento.trim() === "" ||
            this.user.celular.trim() === "" ||
            this.user.fechaNacimiento.trim() === "" ||
            this.user.direccion.trim() === ""
          ) {
            this.utilitiesService.loading = false;
            this.utilitiesService.messageTitleModal = "¡Importante!";
            this.utilitiesService.messageModal =
              "Por favor, actualiza tu información para continuar.";
            this.utilitiesService.backHome = false;
            this.utilitiesService.backLogin = false;
            setTimeout(() => {
              $(".btn-modal-success").click();
            }, 1000);
          }
          this.createForm();
        });
    }
  }
  //*****************************Actualizacion de datos********************************* */
  createForm() {
    this.formUpdate = new FormGroup({
      typeDocument: new FormControl(
        {
          value: this.user.tipoDocumento,
          disabled: this.user.tipoDocumento != "",
        },
        [Validators.required]
      ),
      document: new FormControl(
        { value: this.user.documento, disabled: true },
        []
      ),
      firstName: new FormControl(
        { value: this.user.primerNombre, disabled: true },
        []
      ),
      secondName: new FormControl(
        { value: this.user.segundoNombre, disabled: true },
        []
      ),
      firstLastName: new FormControl(
        { value: this.user.primerApellido, disabled: true },
        []
      ),
      secondLastName: new FormControl({
        value: this.user.segundoApellido,
        disabled: true,
      }),
      birthDate: new FormControl(
        {
          value: this.user.fechaNacimiento,
          disabled: this.user.fechaNacimiento != "",
        },
        [Validators.required]
      ),
      celular: new FormControl({ value: this.user.celular, disabled: false }, [
        Validators.required,
        Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
      ]),
      direccion: new FormControl(
        { value: this.user.direccion, disabled: false },
        [Validators.required, Validators.maxLength(100)]
      ),
      email: new FormControl({ value: this.user.correo, disabled: true }, []),
      confirmEmail: new FormControl(
        { value: this.user.correo, disabled: true },
        []
      ),
    });

    this.formUpdate.controls["confirmEmail"].setValidators([
      Validators.required,
      this.equalsEmail.bind(this.formUpdate),
    ]);
  }

  logout() {
    this.utilitiesService.loading = true;
    setTimeout(() => {
      this.authenticationService.logout();
      this.utilitiesService.currentUser = null;
      this.utilitiesService.loading = false;
      this.router.navigate(["/login"]);
    }, 500);
  }
  equalsEmail(control: FormControl): { [s: string]: boolean } {
    let formRegister: any = this;
    if (control.value !== formRegister.controls["email"].value) {
      return {
        equalsemail: true,
      };
    }
    return null;
  }

  get f() {
    return this.formUpdate.controls;
  }

  get getTypeDocument() {
    return (
      this.formUpdate.get("typeDocument").invalid &&
      this.formUpdate.get("typeDocument").touched
    );
  }

  get getBirthDate() {
    return (
      this.formUpdate.get("birthDate").invalid &&
      this.formUpdate.get("birthDate").touched
    );
  }
  get getCelular() {
    return (
      this.formUpdate.get("celular").invalid &&
      this.formUpdate.get("celular").touched
    );
  }
  get getDireccion() {
    return (
      this.formUpdate.get("direccion").invalid &&
      this.formUpdate.get("direccion").touched
    );
  }

  actualizarDatosContacto() {
    this.submitted = true;
    this.utilitiesService.messageLoading = "Cargando, por favor espera";
    this.utilitiesService.loading = true;

    if (this.formUpdate.invalid) {
      Object.values(this.f).forEach((control) => {
        control.markAllAsTouched();
        this.utilitiesService.loading = false;
        this.utilitiesService.messageTitleModal = "¡Error!";
        this.utilitiesService.messageModal =
          "Debes ingresar todos los campos con *";
        this.utilitiesService.backLogin = false;
        setTimeout(() => {
          $(".btn-modal-error").click();
        }, 1000);

        this.utilitiesService.loading = false;
      });
      return;
    } else {
      const data = this.formUpdate ? this.formUpdate.getRawValue() : "";

      const tipoDocumento_ = data.typeDocument.toString();

      const fechaNacimiento_ = data.birthDate.toString();
      const celular_ = data.celular.toString();
      const direccion_ = data.direccion.toString();

      setTimeout(() => {
        let body = {
          documento: this.user.documento,
          celular: celular_,
          direccion: direccion_,
          fechaNacimiento: fechaNacimiento_,
          tipoDocumento: tipoDocumento_,
          telefono: "",
          genero: "",
        };
        this.authenticationService
          .getGenericToken()
          .pipe(first())
          .subscribe((response: Token) => {
            if (response.token) {
              this.authenticationService
                .actualizarDatos(body)
                .pipe(first())
                .subscribe((response: any) => {
                  if (response["respuesta"] == true) {
                    localStorage.setItem(
                      "login",
                      JSON.stringify(response["respuesta"])
                    ); /*  */

                    this.utilitiesService.loading = false;
                    this.utilitiesService.messageTitleModal =
                      "¡Actualización sa!";
                    this.utilitiesService.messageModal =
                      "Tus datos se actualizaron con éxito. ";
                    this.utilitiesService.backModify = false;
                    this.utilitiesService.backHome = true;
                    setTimeout(() => {
                      $(".btn-modal-success-validate").click();
                    }, 1000);
                  } else {
                    this.utilitiesService.loading = false;
                    this.utilitiesService.messageTitleModal = "¡Error!";
                    this.utilitiesService.messageModal = response["error"];
                    this.utilitiesService.backLogin = false;
                    setTimeout(() => {
                      $(".btn-modal-error").click();
                    }, 1000);
                    this.createForm();
                  }
                });
            }
          });
      }, 1000);
    }
  }

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    let month: string | number = today.getMonth() + 1;
    let day: string | number = today.getDate();

    // Ajustar el formato de mes y día si es necesario (agregar un 0 al principio si es menor a 10)
    if (month < 10) {
      month = "0" + month;
    }

    if (day < 10) {
      day = "0" + day;
    }

    return `${year}-${month}-${day}`;
  }
}
