import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthenticationService } from "../../services/authentication.service";
import { UserOrCompany } from "../../interfaces/user.interface";
import { UtilitiesService } from "../../services/utilities.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-card-tipo-documento",
  templateUrl: "./card-tipo-documento.component.html",
  styleUrls: ["./card-tipo-documento.component.css"],
})
export class CardTipoDocumentoComponent implements OnInit {
  formLogin: FormGroup;
  tpDoc: string = "";
  userOrCompany: UserOrCompany;
  returnUrl: string;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    public utilitiesService: UtilitiesService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.returnUrl = `/validar-rostro`;
  }

  createForm() {
    this.formLogin = this.formBuilder.group({
      tpDoc: ["", Validators.required],
    });
  }
  // convenience getter for easy access to form fields
  // un práctico buscador para facilitar el acceso a los campos de los formularios
  get f() {
    return this.formLogin.controls;
  }

  get getTpDoc() {
    return (
      this.formLogin.get("tpDoc").invalid && this.formLogin.get("tpDoc").touched
    );
  }
  capturar(value) {
    this.formLogin.get("tpDoc").setValue(value);
    this.tpDoc = value;
  }
  onSubmit() {
    if (this.formLogin.invalid) {
      Object.values(this.f).forEach((control) => {
        control.markAllAsTouched();
      });
      return;
    } else {
      this.utilitiesService.loading = true;
      let user: UserOrCompany = JSON.parse(
        localStorage.getItem("userOrCompany")
      );
      let body = this.User(user);
      console.log(body);
      this.authenticationService
        .guardatTipoDoc(body)
        .subscribe((response: any) => {
          console.log("respuesta" + response);
          if (response.respuesta == true) {
            setTimeout(() => {
              this.utilitiesService.loading = false;
              this.router.navigate([this.returnUrl]);
            }, 500);
          } else {
            this.utilitiesService.loading = false;
          }
        });
      this.utilitiesService.loading = false;
    }
  }
  private User(user) {
    let userRegister = {
      documento: user.document.toString(),
      celular: "",
      direccion: "",
      fechaNacimiento: "",
      tipoDocumento: this.tpDoc,
      telefono: "",
      genero: "",
    };

    return userRegister;
  }
}
