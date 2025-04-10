import { Component,  OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { PreguntasUser, Session, User, ValidateQuestion} from 'src/app/interfaces/user.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { CookieService } from 'ngx-cookie-service';
declare var $;

@Component({
  selector: 'app-questions-login',
  templateUrl: './questions-login.component.html',
  styleUrls: ['./questions-login.component.css']
})
export class QuestionsLoginComponent implements OnInit {
  formQuestion: FormGroup;
  submitted: boolean = false;
  returnUrl: string;
  currentUser: User;
  correoUser: string;
  texto: string;
  fullName: string;
  document: string;
  token: string;
  identificadores: any[] = [];
  intentosValidos: number = 3;
  user: User;
  respuestasList: any = [];
  preguntasUser: PreguntasUser;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    public utilitiesService: UtilitiesService,
    private cookieService: CookieService
  ) {
    this.utilitiesService.loading = true;
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
    let preguntas =
      localStorage.getItem("preguntas") !== ""
        ? JSON.parse(localStorage.getItem("preguntas"))
        : null;
    if (ptoken != "") {
      if (user == null || cc == null || preguntas == null) {
       this.authenticationService
          .loginNew(ptoken.token)
          .pipe(first())
          .subscribe((response: Session) => {
           this.utilitiesService.currentUser = response.usuario;
            if (response.usuario.existeUsuario) {
              this.user = response.usuario;
              this.document = response.usuario.documento;
              this.preguntasUser = response.usuario.preguntas;
              this.utilitiesService.currentUser = response.usuario;    
              this.fullName = `${response.usuario.primerNombre} ${response.usuario.segundoNombre} ${response.usuario.primerApellido} ${response.usuario.segundoApellido}`;
              localStorage.setItem("user", JSON.stringify(response));
              localStorage.setItem("cc", response.usuario.documento);
              localStorage.setItem("preguntas", JSON.stringify(response.usuario.preguntas));
              this.correoUser = response.usuario.correo;
              if (this.preguntasUser == null) {
                this.utilitiesService.messageTitleModal = "¡Intentalo nuevamente!";
                this.utilitiesService.messageModal = "Ha ocurrido un error";
                this.utilitiesService.backLogin = true;
                setTimeout(() => {
                  $(".btn-modal-error").click();
                  this.utilitiesService.loading = false;
                }, 1000);
              }
              this.utilitiesService.loading = false;
            }
          });
      } else {
        this.utilitiesService.currentUser =user;
        this.correoUser = user.correo;
        this.fullName = `${user.primerNombre} ${user.segundoNombre} ${user.primerApellido} ${user.segundoApellido}`;
        this.document = cc;
        this.user = user;
        this.preguntasUser = preguntas;
        if (this.preguntasUser == null) {
          this.utilitiesService.messageTitleModal = "¡Intentalo nuevamente!";
          this.utilitiesService.messageModal = "Ha ocurrido un error";
          this.utilitiesService.backLogin = false;
          setTimeout(() => {
            $(".btn-modal-error").click();
            this.utilitiesService.loading = false;
          }, 1000);
        }
        this.utilitiesService.loading = false;
        
      }
    }
    this.currentUser = this.utilitiesService.currentUser;
  }

  ngOnInit() {
    this.createForm();
    console.log("LLEGA USUARIO?? ",this.utilitiesService.currentUser.documento)
  }

  createForm() {
    this.formQuestion = new FormGroup({
      pregunta1: new FormControl("",
        Validators.required,
      ),
      pregunta2: new FormControl("",
        Validators.required,
      ),
      pregunta3: new FormControl("",
        Validators.required,
      ),
      pregunta4: new FormControl("",
        Validators.required,
      ),
      pregunta5: new FormControl("",
        Validators.required,
      ),
    });
  }

  get f() {
    return this.formQuestion.controls;
  }
  get valida1() {
    return (
      this.formQuestion.get("pregunta1").invalid &&
      this.formQuestion.get("pregunta1").touched
    );
  }
  get valida2() {
    return (
      this.formQuestion.get("Pregunta2").invalid &&
      this.formQuestion.get("Pregunta2").touched
    );
  }
  get valida3() {
    return (
      this.formQuestion.get("Pregunta3").invalid &&
      this.formQuestion.get("Pregunta3").touched
    );
  }
  get valida4() {
    return (
      this.formQuestion.get("pregunta4").invalid &&
      this.formQuestion.get("pregunta4").touched
    );
  }
  get valida5() {
    return (
      this.formQuestion.get("pregunta5").invalid &&
      this.formQuestion.get("pregunta5").touched
    );
  }


  logout() {
    this.utilitiesService.loading = true;
    setTimeout(() => {
      this.authenticationService.logout();
      this.utilitiesService.currentUser = null;
      this.utilitiesService.loading = false;
      this.router.navigate(['/login']);
    }, 500);
  }

  close() {
    this.createForm();
    this.identificadores = [];
    this.formQuestion.reset();
    this.formQuestion.get('pregunta1').setValue('');
    this.formQuestion.get('pregunta2').setValue('');
    this.formQuestion.get('pregunta3').setValue('');
    this.formQuestion.get('pregunta4').setValue('');
    this.formQuestion.get('pregunta5').setValue('');
  }

  



  processRespuesta(res: any) {
    this.respuestasList = [];
    this.respuestasList = res;
    console.log("Event emitter respuesta List en question login", res);
    this.guardarRespuestas(res);

  }

  guardarRespuestas(respuestas: any) {
    this.utilitiesService.messageLoading = "Cargando, por favor espera"
    this.utilitiesService.loading = true;
    this.authenticationService.validateQuestion(this.user.documento, respuestas, "L")
      .pipe(first())
      .subscribe((res: ValidateQuestion) => {

        if (res.estado == 0) {
          this.utilitiesService.messageTitleModal = "¡Intentalo nuevamente!";
          this.utilitiesService.messageModal = "Ha ocurrido un error";
          this.utilitiesService.backLogin = false;
          setTimeout(() => {
            $(".btn-modal-error").click();
            this.utilitiesService.loading = false;
          }, 1000);
        } else if (res.estado == 1) {
          if (res.respuesta == true) {
            this.utilitiesService.messageTitleModal = "¡Validación exitosa!";
            this.utilitiesService.messageModal = "Tus respuestas fueron guardadas";

            if (res.debeActualizarDatos) {
              this.utilitiesService.backModify = true;
            } else if (!res.debeActualizarDatos) {
              this.utilitiesService.backHome = true;
              localStorage.setItem("login", JSON.stringify(res.respuesta));
            }
            setTimeout(() => {
              $(".btn-modal-success-validate").click();
              localStorage.removeItem("preguntas");
              this.utilitiesService.loading = false;
            }, 1000);
          } else if (res.respuesta == false) {
            if (res.bloqueo == true) {

              this.utilitiesService.messageTitleModal = "¡No puedes continuar!";
              this.utilitiesService.messageModal = "No pudimos realizar la validación de tus datos, por favor realiza la revisión de ellos comunicándote al siguiente correo: confa@confa.co";
              this.utilitiesService.backLogin = true;

              setTimeout(() => {
                $(".btn-close-form-questions").click();
                $(".btn-modal-error").click();
                localStorage.removeItem("preguntas");
                this.utilitiesService.loading = false;
              }, 1000);


            } else if (res.bloqueo == false) {
              let cuantosintentosQuedan: number = this.intentosValidos - res.intentos;
              let intentotext = cuantosintentosQuedan == 1 ? 'intento ' : 'intentos ';
              this.utilitiesService.messageTitleModal = "¡Ten cuidado!";
              this.utilitiesService.messageModal = "Los datos ingresados no son correctos, tienes " + cuantosintentosQuedan + " " + intentotext + " más para  validar tus datos";
              this.utilitiesService.backLogin = false;
              setTimeout(() => {
                $(".btn-modal-error").click();
                this.utilitiesService.loading = false;
              }, 1000);
            }
          }
        }
      });
  }
}
