import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Guards
import { AuthGuard } from "./_helpers/auth.guard";
import { LoginComponent } from "./components/content/login/login.component";
import { FaceRecognitionComponent } from "./components/content/face-recognition/face-recognition.component";
import { ConfirmComponent } from "./components/confirm/confirm.component";
import { QuestionsLoginComponent } from "./components/content/questions-login/questions-login.component";
import { ModifyInfoUserComponent } from "./components/modify-info-user/modify-info-user.component";
import { MiPerfilConfaComponent } from "./components/content/mi-perfil-confa/mi-perfil-confa.component";
import { LoginAsesorComponent } from "./components/content/login-asesor/login-asesor.component";
import { ConsultarPersonaComponent } from "./components/content/consultar-persona/consultar-persona.component";

// Components

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "loginAsesor", component: LoginAsesorComponent },
  {
    path: "validar-rostro",
    component: FaceRecognitionComponent,
    canActivate: [AuthGuard],
  },
  { path: "confirm/credit", component: ConfirmComponent },
  {
    path: "questions",
    component: QuestionsLoginComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "modify",
    component: ModifyInfoUserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "miPerfilConfa",
    component: MiPerfilConfaComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "consultar-persona",
    component: ConsultarPersonaComponent,
  } /*Por ahora lo dejo sin el autoGuard */,
  { path: "**", pathMatch: "full", redirectTo: "login" },
  //{ path: 'miPerfilConfa', component: MiPerfilConfaComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
