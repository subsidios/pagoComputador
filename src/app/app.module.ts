import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

// Imports
import { CookieService } from "ngx-cookie-service";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Interceptors
import { JwtInterceptor } from "./_helpers/jwt.interceptor";
import { ErrorInterceptor } from "./_helpers/error.interceptor";

// Routes
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

// Pipes
import { IndicationEmailPipe } from "./pipes/indication-email.pipe";

// Acordeon
import { AccordionModule } from "ngx-bootstrap/accordion";

// Components
import { FooterComponent } from "./components/shared/footer/footer.component";
import { LoadingComponent } from "./components/shared/loading/loading.component";
import { HeaderComponent } from "./components/shared/header/header.component";
import { NavbarComponent } from "./components/shared/navbar/navbar.component";

import { WelcomeComponent } from "./components/welcome/welcome.component";
import { CardLoginComponent } from "./components/card-login/card-login.component";
import { CardForgotPasswordComponent } from "./components/card-forgot-password/card-forgot-password.component";
import { CardRegisterComponent } from "./components/card-register/card-register.component";
import { CardChangePasswordComponent } from "./components/card-change-password/card-change-password.component";
import { CardRegisterFormComponent } from "./components/card-register-form/card-register-form.component";
import { ModalLoginComponent } from "./components/modal-login/modal-login.component";
import { ModalMessagesComponent } from "./components/modal-messages/modal-messages.component";
import { ModalContentComponent } from "./components/modal-content/modal-content.component";
import { ModalPoliciesComponent } from "./components/modal-policies/modal-policies.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LoginComponent } from "./components/content/login/login.component";
import { HomeComponent } from "./components/content/home/home.component";
import { WebcamModule } from "ngx-webcam";
import { FaceRecognitionComponent } from "./components/content/face-recognition/face-recognition.component";
import { CameraComponent } from "./components/content/camera/camera.component";
import { CardTipoDocumentoComponent } from "./components/card-tipo-documento/card-tipo-documento.component";
import { ConfirmComponent } from "./components/confirm/confirm.component";
import { QuestionsLoginComponent } from "./components/content/questions-login/questions-login.component";
import { ModifyInfoUserComponent } from "./components/modify-info-user/modify-info-user.component";
import { CardQuestionsComponent } from "./components/card-questions/card-questions.component";
import { ContenidoSeguroPipe } from "./pipes/contenido-seguro.pipe";
import { MiPerfilConfaComponent } from "./components/content/mi-perfil-confa/mi-perfil-confa.component";
import { CardLoginAsesorComponent } from "./components/card-login-asesor/card-login-asesor.component";
import { LoginAsesorComponent } from "./components/content/login-asesor/login-asesor.component";
import { ConsultarPersonaComponent } from "./components/content/consultar-persona/consultar-persona.component";
import { WelcomeAsesorComponent } from "./components/welcome-asesor/welcome-asesor.component";
import { CameraAsesorComponent } from "./components/content/camera-asesor/camera-asesor.component";

import { OnbdComponent } from "./components/onboardings/onbd/onbd.component";
import { ModalModule } from "ngx-bootstrap/modal";

@NgModule({
  declarations: [
    IndicationEmailPipe,
    AppComponent,
    FooterComponent,
    LoadingComponent,
    HeaderComponent,
    NavbarComponent,
    WelcomeComponent,
    CardLoginComponent,
    CardForgotPasswordComponent,
    CardRegisterComponent,
    CardChangePasswordComponent,
    CardRegisterFormComponent,
    ModalLoginComponent,
    ModalMessagesComponent,
    ModalContentComponent,
    ModalPoliciesComponent,
    LoginComponent,
    HomeComponent,
    FaceRecognitionComponent,
    CameraComponent,
    CardTipoDocumentoComponent,
    ConfirmComponent,
    QuestionsLoginComponent,
    ModifyInfoUserComponent,
    CardQuestionsComponent,
    ContenidoSeguroPipe,
    MiPerfilConfaComponent,
    CardLoginAsesorComponent,
    LoginAsesorComponent,
    ConsultarPersonaComponent,
    WelcomeAsesorComponent,
    CameraAsesorComponent,
    OnbdComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AccordionModule.forRoot(),
    WebcamModule,
    ModalModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    CookieService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
