import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { first } from 'rxjs/operators';
import { User, ValidateQuestion, ValidateToken, validateResponse } from 'src/app/interfaces/user.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { QuestionsService } from 'src/app/services/questions.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
declare var $;
@Component({
  selector: 'app-card-questions',
  templateUrl: './card-questions.component.html',
  styleUrls: ['./card-questions.component.css']
})
export class CardQuestionsComponent implements OnInit {


  @Input() user: User;
  @Input() preguntas: any;
  @Output() respuestaEmitter: EventEmitter<any> = new EventEmitter();
  formQuestion: FormGroup;
  submitted: boolean = false;
  returnUrl: string;
  /* preguntas: any; */
  correoUser: string;
  texto: string;
  document: string;
  token: string;
  identificadores: any[] = [];
  path: string;
  preguntasDesdeLogin:boolean;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    public utilitiesService: UtilitiesService,
    public questionsService: QuestionsService,
    private cookieService: CookieService
  ) { 
   
    
    this.path = this.activatedRoute.snapshot.routeConfig.path;
   }
  ngOnInit() {
    
    this.createForm();
    this.formQuestion.reset();
    this.identificadores = [];
    this.formQuestion.get('pregunta1').setValue('');
    this.formQuestion.get('pregunta2').setValue('');
    this.formQuestion.get('pregunta3').setValue('');
    this.formQuestion.get('pregunta4').setValue('');
    this.formQuestion.get('pregunta5').setValue('');


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

  // convenience getter for easy access to form fields
  // un práctico buscador para facilitar el acceso a los campos de los formularios
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
     
      let path = this.activatedRoute.snapshot.routeConfig.path;
      if (
        path === 'questions' ){
          this.router.navigate(['/login']);
        }else{
  
        window.location.reload();
        }
    }, 500);
  }


  close() {
    this.cookieService.delete('gtoken');
    this.createForm();
    /*  this.formQuestion.reset(); */
    this.identificadores = [];
    this.formQuestion.get('pregunta1').setValue('');
    this.formQuestion.get('pregunta2').setValue('');
    this.formQuestion.get('pregunta3').setValue('');
    this.formQuestion.get('pregunta4').setValue('');
    this.formQuestion.get('pregunta5').setValue('');
  }

  

  Submit() {
    /* setTimeout(() => { */
    /*   this.cookieService.delete('gtoken'); */
      this.utilitiesService.messageLoading = "Cargando, por favor espera "
      if (this.formQuestion.invalid) {
        Object.values(this.f).forEach((control) => {
          control.markAllAsTouched();
          this.utilitiesService.messageTitleModal = "Por favor, responder todas las preguntas!";
          this.utilitiesService.messageModal = "* Los campos que tienen asterisco son obligatorios";
          this.utilitiesService.backLogin = false;
          setTimeout(() => {
            $(".btn-modal-error").click();
          }, 1000);
        });
        return;
      } else {
                const data = this.formQuestion
                  ? this.formQuestion.getRawValue()
                  : "";
                const pre1_ = data.pregunta1;
                const pre2_ = data.pregunta2;
                const pre3_ = data.pregunta3;
                const pre4_ = data.pregunta4;
                const pre5_ = data.pregunta5;
                let cont: number = 1;
                this.preguntas.forEach(element => {
                  if (cont == 1) {
                    this.identificadores.push(element.identificador.toString() + "@@" + pre1_);
                  } else if (cont == 2) {
                    this.identificadores.push(element.identificador.toString() + "@@" + pre2_);
                  } else if (cont == 3) {
                    this.identificadores.push(element.identificador.toString() + "@@" + pre3_);
                  } else if (cont == 4) {
                    this.identificadores.push(element.identificador.toString() + "@@" + pre4_);
                  } else if (cont == 5) {
                    this.identificadores.push(element.identificador.toString() + "@@" + pre5_);
                  }
                  cont = cont + 1;
                });
                console.log("Lista de respuestas", this.identificadores, " documento: ", this.user.documento)
                this.respuestaEmitter.emit(this.identificadores);
                this.identificadores=[];
                this.formQuestion.get('pregunta1').setValue('');
                this.formQuestion.get('pregunta2').setValue('');
                this.formQuestion.get('pregunta3').setValue('');
                this.formQuestion.get('pregunta4').setValue('');
                this.formQuestion.get('pregunta5').setValue('');
                
      }
  }


}

