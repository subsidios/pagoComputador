import { Component, Input, OnInit } from "@angular/core";

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { AuthenticationService } from "../../services/authentication.service";
import { first } from "rxjs/operators";
import { User } from "../../interfaces/user.interface";
import { UtilitiesService } from "../../services/utilities.service";
import { environment } from "src/environments/environment";
import { CookieService } from "ngx-cookie-service";
import { ValidatorsService } from "../../services/validators.service";
import * as CryptoJS from "crypto-js";
import * as Md5 from "crypto-js/md5";

declare var $;

@Component({
  selector: "app-card-register-form",
  templateUrl: "./card-register-form.component.html",
  styleUrls: ["./card-register-form.component.css"],
})
export class CardRegisterFormComponent implements OnInit {
  formRegister: FormGroup;
  @Input() respuesta: boolean;
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private validatorsService: ValidatorsService,
    private authenticationService: AuthenticationService,
    public utilitiesService: UtilitiesService,
    private cookieService: CookieService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.formRegister = this.formBuilder.group(
      {
        typeDocument: ["", [Validators.required]],
        firstName: [
          "",
          [Validators.required, Validators.pattern("[A-Za-zá-úÁ-Ú ]*")],
        ],
        secondName: ["", Validators.pattern("[A-Za-zá-úÁ-Ú ]*")],
        firstLastName: [
          "",
          [Validators.required, Validators.pattern("[A-Za-zá-úÁ-Ú ]*")],
        ],
        secondLastName: ["", Validators.pattern("[A-Za-zá-úÁ-Ú ]*")],
        document: [
          { value: "", disabled: true },
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(15),
            Validators.pattern("^[0-9]+"),
          ],
        ],
        birthDate: ["", [Validators.required]],
        address: ["", [Validators.required]],
        phone: ["", [Validators.required]],
        email: [
          "",
          [
            Validators.required,
            Validators.pattern(
              "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@" +
                "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$"
            ),
            Validators.email,
          ],
        ],
        confirmEmail: [
          "",
          [
            Validators.required,
            Validators.pattern(
              "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@" +
                "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$"
            ),
            Validators.email,
          ],
        ],
        password: [
          "",
          [Validators.required, Validators.minLength(6), this.validarPassword],
        ],
        confirmPassword: ["", [Validators.required, Validators.minLength(6)]],
        aceptHabeasData: [
          false,
          [Validators.required, this.validatorsService.aceptHabeasData],
        ],
      },
      {
        validators: [
          this.validatorsService.passwordsEquals("password", "confirmPassword"),
          this.validatorsService.emailsEquals("email", "confirmEmail"),
        ],
      }
    );
  }
  validarPassword(control: FormControl) {
    const valor = control.value;
    const tieneMayuscula = /[A-Z]/.test(valor);
    const tieneMinuscula = /[a-z]/.test(valor);
    const tieneNumero = /[0-9]/.test(valor);
    const tieneCaracterEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
      valor
    );

    const esValido =
      tieneMayuscula && tieneMinuscula && tieneNumero && tieneCaracterEspecial;

    return esValido ? null : { passwordInvalida: true };
  }
  get f() {
    return this.formRegister.controls;
  }

  get getTypeDocument() {
    return (
      this.formRegister.get("typeDocument").invalid &&
      this.formRegister.get("typeDocument").touched
    );
  }

  get getFirstName() {
    return (
      this.formRegister.get("firstName").invalid &&
      this.formRegister.get("firstName").touched
    );
  }

  get getSecondName() {
    return (
      this.formRegister.get("secondName").touched &&
      this.formRegister.get("secondName").errors
    );
  }

  get getFirstLastName() {
    return (
      this.formRegister.get("firstLastName").invalid &&
      this.formRegister.get("firstLastName").touched
    );
  }

  get getSecondLastName() {
    return (
      this.formRegister.get("secondLastName").touched &&
      this.formRegister.get("secondLastName").errors
    );
  }

  get getBirthDate() {
    return (
      this.formRegister.get("birthDate").invalid &&
      this.formRegister.get("birthDate").touched
    );
  }

  get getAddress() {
    return (
      this.formRegister.get("address").invalid &&
      this.formRegister.get("address").touched
    );
  }

  get getPhone() {
    return (
      this.formRegister.get("phone").invalid &&
      this.formRegister.get("phone").touched
    );
  }

  get getDocument() {
    return (
      this.formRegister.get("document").invalid &&
      this.formRegister.get("document").touched
    );
  }

  get getEmail() {
    return (
      this.formRegister.get("email").invalid &&
      this.formRegister.get("email").touched
    );
  }

  get getConfirmEmail() {
    const email1 = this.formRegister.get("email").value;
    const email2 = this.formRegister.get("confirmEmail").value;
    return email1 === email2 ? false : true;
  }

  get getPassword() {
    return (
      this.formRegister.get("password").invalid &&
      this.formRegister.get("password").touched
    );
  }

  get getConfirmPassword() {
    const password1 = this.formRegister.get("password").value;
    const password2 = this.formRegister.get("confirmPassword").value;
    return password1 === password2 ? false : true;
  }

  get getAceptHabeasData() {
    return (
      this.formRegister.get("aceptHabeasData").touched &&
      !this.formRegister.get("aceptHabeasData").value
    );
  }

  fullNameDisabled() {
    let existUser = this.utilitiesService.existUser;
    let registerUser = this.utilitiesService.registerUser;
    // console.log("existUser", existUser);
    this.formRegister.get("document").setValue(registerUser.documento);
    if (existUser) {
      this.formRegister.get("firstName").setValue(registerUser.primerNombre);
      this.formRegister.get("secondName").setValue(registerUser.segundoNombre);
      this.formRegister
        .get("firstLastName")
        .setValue(registerUser.primerApellido);
      this.formRegister
        .get("secondLastName")
        .setValue(registerUser.segundoApellido);
      this.formRegister.get("birthDate").setValue(registerUser.fechaNacimiento);
    }
  }

  cleanForm() {
    this.cookieService.delete("gtoken");
    this.formRegister.reset({
      typeDocument: "",
      firstName: "",
      secondName: "",
      firstLastName: "",
      secondLastName: "",
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
      aceptHabeasData: false,
    });
  }

  onSubmit() {
    this.fullNameDisabled();
    // console.log("document", this.f.document.value.toString());

    if (this.formRegister.invalid) {
      Object.values(this.f).forEach((control) => {
        control.markAllAsTouched();
      });
      return;
    } else {
      let userRegister = this.generateUser(
        this.f,
        this.utilitiesService.registerUser
      );

      if (
        this.formRegister.controls["document"].value !== "" &&
        this.formRegister.controls["aceptHabeasData"].value
      ) {
        this.utilitiesService.loading = true;
        this.authenticationService
          .saveUserRegister(userRegister)
          .pipe(first())
          .subscribe((response: any) => {
            if (response === "") {
              this.utilitiesService.messageTitleModal = "Registro en proceso";
              this.utilitiesService.messageModal =
                "Te hemos enviado un correo de confirmación. Debes confirmar para poder ingresar, si no ves el correo en tu bandeja principal por favor revisa tu carpeta de SPAM, Gracias!.";
              this.utilitiesService.backLogin = false;
              $(".btn-close-form-register").click();
              setTimeout(() => {
                this.utilitiesService.loading = false;
                $(".btn-modal-warning").click();
              }, 1000);
              this.cleanForm();
            } else {
              this.utilitiesService.messageTitleModal =
                "Tu registro ha fallado";
              this.utilitiesService.messageModal = response;
              this.utilitiesService.backLogin = false;
              setTimeout(() => {
                this.utilitiesService.loading = false;
                $(".btn-modal-error").click();
              }, 1000);
            }
          });
      } else {
        this.utilitiesService.loading = false;
      }
    }
  }

  private generateUser(f: any, user: User) {
    let url = `${environment.apiUrl}` + "#/confirm/credit";
    // console.log("url card-register-form.component.ts", url);
    let fechaRegistroPreguntas = null;
    console.log("Respondio bien? ", this.respuesta);
    if (this.respuesta) {
      fechaRegistroPreguntas = new Date();
    } else {
      fechaRegistroPreguntas = null;
    }
    let userRegister = {
      sistema: "CreditoDigital",
      linkMensaje: url,
      parametro: "34240997a16763c011134c570fcc149e",
      remitente: "Portal Confa",
      asunto: "Confirmación de registro",
      usuario: {
        documento: user.documento,
        direccion: f.address.value,
        telefono: f.phone.value,
        sexo: user.sexo,
        categoria: user.categoria,
        celular: f.phone.value,
        correo: f.email.value,
        clave: this.hashMD5(f.password.value),
        clave1: this.encriptar(f.password.value),
        codBeneficiario: user.codBeneficiario,
        nombreBeneficiario: user.nombreBeneficiario,
        fechaNacimiento: f.birthDate.value,
        fechaRegistro: user.fechaRegistro,
        documentoTrabajador: user.documento,
        primerNombre: f.firstName.value,
        segundoNombre: f.secondName.value,
        primerApellido: f.firstLastName.value,
        segundoApellido: f.secondLastName.value,
        link: url,
        existeUsuario: user.existeUsuario,
        usuarioNasfa: user.usuarioNasfa,
        sistemaActualizacion: user.sistemaActualizacion,
        correoMd5: "" + this.hashMD5(f.email.value),
        aceptaHabeas: f.aceptHabeasData.value,
        tipoDocumento: f.typeDocument.value,
        preguntasValidacion: this.respuesta,
        fechaRespuestasValidacion: fechaRegistroPreguntas,
        bloqueoUser: false,
        estadoUser: user.estadoUser,
        contUser: 0,
        bloqueo: user.bloqueo,
        preguntas: user.preguntas,
      },
    };

    return userRegister;
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
  //Metodos encargados de encriptar la contraseña
  encriptar(pas: string) {
    try {
      const claveMD5 = this.hashMD5(pas);
      const claveSHA256 = this.hashSHA256(claveMD5);
      const claveconfa = this.encriptarConfa(claveSHA256);
      return claveconfa;
      console.log("Nueva contraseña: " + claveconfa);
    } catch (error) {
      console.error("Error al encriptar la contraseña:", error);
    }
  }

  hashMD5(pas: string): string {
    try {
      const md5Hash = Md5(pas).toString();
      return md5Hash;
    } catch (error) {
      console.error("Error al calcular el hash MD5:", error);
      throw error;
    }
  }

  hashSHA256(clave: string): string {
    try {
      // Calcular el hash
      const hash = CryptoJS.SHA256(clave).toString(CryptoJS.enc.Hex);
      return hash;
    } catch (error) {
      console.error("Error al calcular el hash SHA256:", error);
      throw error;
    }
  }

  encriptarConfa(valor: string): string {
    try {
      let respuesta = valor
        .replace(/1/g, "Fb")
        .replace(/2/g, "at")
        .replace(/4/g, "VI")
        .replace(/6/g, "pZ")
        .replace(/7/g, "sH")
        .replace(/9/g, "Dx")
        .replace(/3/g, "Mo")
        .replace(/0/g, "rQ");
      return respuesta;
    } catch (error) {
      console.error("Error al encriptar con Confa:", error);
      throw error;
    }
  }
}
