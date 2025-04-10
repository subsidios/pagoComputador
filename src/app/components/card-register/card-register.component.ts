import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { AuthenticationService } from '../../services/authentication.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { User, Token, Questions, PreguntasUser } from '../../interfaces/user.interface';
import { UtilitiesService } from '../../services/utilities.service';
import { CookieService } from 'ngx-cookie-service';
import { QuestionsService } from 'src/app/services/questions.service';

declare var $;

@Component({
  selector: 'app-card-register',
  templateUrl: './card-register.component.html',
  styleUrls: ['./card-register.component.css']
})
export class CardRegisterComponent implements OnInit {

  formValidate: FormGroup;
  @Output() formValidateEmitter: EventEmitter<FormGroup> = new EventEmitter();
  @Output() preguntasEmitter: EventEmitter<PreguntasUser> = new EventEmitter();
  preguntar:boolean=false;
  @Output() userEmitter: EventEmitter<User> = new EventEmitter();

  constructor(
    private autheticationService: AuthenticationService,
    public utilitiesService: UtilitiesService,
    private cookieService: CookieService,
    public questionsService: QuestionsService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.formValidateEmitter.emit(this.formValidate);
  }

  createForm() {
    this.formValidate = new FormGroup({
      document: new FormControl('', [
        Validators.required,
        Validators.min(99999),
        Validators.max(999999999999999),
        Validators.pattern("^[0-9]+")
      ]),
    });
  }

  get f() {
    return this.formValidate.controls;
  }

  get getDocument() {
    return this.formValidate.get('document').invalid && this.formValidate.get('document').touched;
  }


  
  validateDocument() {
    this.utilitiesService.messageLoading="Cargando, por favor espera"
   

    if (this.formValidate.invalid) {
      Object.values(this.f)
        .forEach(control => {
          control.markAllAsTouched();
        });
      return;
    }
    else {
      this.utilitiesService.loading = true;
      let document = this.f.document.value;
      if (document !== '') {
              this.autheticationService.getGenericToken()
                .pipe(first())
                .subscribe((responseTING: Token) => {
                  if (responseTING.token) {
                    this.autheticationService.consultUserInformationNASFANew(document)
                      .pipe(first())
                      .subscribe((response: User) => {
                        if (response.bloqueo) {
                          this.utilitiesService.messageTitleModal = "¡Documento bloqueado!";
                          this.utilitiesService.messageModal = "No puedes ingresar debido que excediste los intentos permitidos para validarte.";
                          this.utilitiesService.backLogin = false;
                          setTimeout(() => {
                            this.utilitiesService.loading = false;
                            $(".btn-modal-error").click();
                          }, 500);
                          this.formValidate.reset();
                        }else{
                       if (!response.existeUsuario) {
                          this.userEmitter.emit(response);
                          this.utilitiesService.registerUser = response;
                          this.utilitiesService.existUser = response.existeUsuario || response.usuarioNasfa;
                          if (response.preguntas!=null) {
                              console.log("Trae preguntas")
                              this.preguntasEmitter.emit(response.preguntas)
                              this.utilitiesService.loading = false;
                            $(".btn-close-popup-login").click();
                              setTimeout(() => {
                                $(".btn-form-questions").click();
                              }, 500);
                              this.formValidate.reset();
                            } else {
                              console.log("No trae preguntas")
                              this.utilitiesService.loading = false;
                             $(".btn-close-popup-login").click();
                              setTimeout(() => {
                                $(".btn-form-register").click();
                              }, 500);
                              this.formValidate.reset();
                            }
                          

                        } else {
                          this.utilitiesService.loading = false;
                          this.utilitiesService.messageTitleModal = 'Documento registrado';
                          this.utilitiesService.messageModal = 'Este usuario ya se encuentra registrado.';
                          this.utilitiesService.backLogin = false;
                        $(".btn-modal-error").click();
                          this.formValidate.reset();
                        }}
                      });
                  }
                });
      }
    }

  }
//Este no se usa actualmente
  /* validateDocument1() {
    if (this.formValidate.invalid) {
      Object.values(this.f)
        .forEach(control => {
          control.markAllAsTouched();
        });
      return;
    }
    else {
      let document = this.f.document.value;
      console.log(document);

      if (document !== '') {
        this.autheticationService.consultarBloqueoUsuario(document).pipe(first()).subscribe((bloqueo) => {
          if (bloqueo == true) {
            console.log(" Documento Bloqueado")
            this.utilitiesService.messageTitleModal = "¡Documento bloqueado!";
            this.utilitiesService.messageModal = "No puedes ingresar debido que excediste los intentos permitidos para validarte.";
            this.utilitiesService.backLogin = false;
            setTimeout(() => {
              this.utilitiesService.loading = false;
              $(".btn-modal-error").click();
            }, 500);
          } else if (bloqueo == false) {
            this.consultarPreguntas(document);
            setTimeout(() => {

        this.autheticationService.getGenericToken()
          .pipe(first())
          .subscribe((response: Token) => {
            // console.log("Token generico", response);

            if (response.token) {
              this.autheticationService.consultUserInformationNASFA(document)
                .pipe(first())
                .subscribe((response: User) => {
                  this.utilitiesService.registerUser = response;
                  this.utilitiesService.existUser = response.existeUsuario || response.usuarioNasfa;
                  // console.log("this.utilitiesService.existUser", this.utilitiesService.existUser);

                  if (!response.existeUsuario) {
                    this.utilitiesService.loading = false;
                    // console.log('Usuario no encontrado');

                    $('.btn-close-popup-login').click();
                    setTimeout(() => {
                      $('.btn-form-register').click();
                    }, 500);
                  }
                  else {
                    this.utilitiesService.loading = false;

                    // console.log('Usuario encontrado');
                    this.cookieService.delete('gtoken');
                    this.utilitiesService.messageTitleModal = 'Documento registrado';
                    this.utilitiesService.messageModal = 'Este usuario ya se encuentra registrado.';
                    this.utilitiesService.backLogin = false;

                    $('.btn-modal-error').click();
                  }
                });
            }
          });

      }, 2000);

      }
    });
  }

  this.formValidate.reset({
    document: ''
  });

  }
  } */
/* 
consultarPreguntas(documento: string) {
  let existeUsuarioC: boolean = false;
  let ctoken =
    this.cookieService.get("ctoken") !== ""
      ? JSON.parse(this.cookieService.get("ctoken"))
      : "";
  console.log("---", ctoken)
  if (ctoken != "") {
    console.log("----if");
    this.questionsService.getQuestions(documento)
      .pipe(first())
      .subscribe((respons: Questions) => {
        console.log("aqui questions", respons);
        if (respons.ConsultaPreguntasResponse.mensaje == "") {
          existeUsuarioC = true;
          this.preguntar = true;

          console.log("B", this.preguntar)
        }
        ;
      });

  } else {
    console.log("----else");
    this.autheticationService.getGenericTokenC().pipe(first())
      .subscribe((tokenC: Token) => {

        if (tokenC.token) {

          this.questionsService.getQuestions(documento)
            .pipe(first())
            .subscribe((respons: Questions) => {
              console.log("aqui questions", respons);
              if (respons.ConsultaPreguntasResponse.mensaje == "") {
                existeUsuarioC = true;
                this.preguntar = true;

                console.log("B", this.preguntar)
              }
              ;
            });
        }
      });
  }



} */

}
