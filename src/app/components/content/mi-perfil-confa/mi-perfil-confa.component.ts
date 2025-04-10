import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { first } from 'rxjs/operators';
import {  MiPerfilConfa, Session, User } from 'src/app/interfaces/user.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

declare var $;
@Component({
  selector: 'app-mi-perfil-confa',
  templateUrl: './mi-perfil-confa.component.html',
  styleUrls: ['./mi-perfil-confa.component.css']
})
export class MiPerfilConfaComponent implements OnInit {

  rutaMiPerfil:string;
  tieneNucleoFamiliar:boolean=false;
  permiso:Boolean;
  usuario: User;
  fullName: string = "";
  document: string;
  documento:string;

  path: string;
  token: string;

  currentUser: User;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public utilitiesService: UtilitiesService,
    private cookieService: CookieService,
    private authenticationService: AuthenticationService) {
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
        //console.log("Entramos porque es nulo home component "+ptoken.token);
        //Validamos si no tiene la informacion almacenada dentro del local Storage cuando la sesion fue iniciada desde otro portal
        this.authenticationService
          .loginNew(ptoken.token)
          .pipe(first())
          .subscribe((response: Session) => {
            //console.log("entra aca", response);
            this.utilitiesService.currentUser = response.usuario;
            // console.log('3',response);
            if (response.usuario.existeUsuario) {
              //console.log("guardamos al informacion del usuario");
              localStorage.setItem("user", JSON.stringify(response));
              localStorage.setItem("cc", response.usuario.documento);
              this.document=response.usuario.documento;  
            }
          });
      } else {
        this.document=cc;
        this.utilitiesService.currentUser = user;
        //Dado que si la sesión fue iniciada desde el mismo portal ya se ingresan los valores al local Storage, por esto solo es cuesto de consultarlo
        this.fullName = `${user.primerNombre} ${user.segundoNombre} ${user.primerApellido} ${user.segundoApellido}`;
     
      }

      this.token=ptoken.token;

    }
    console.log(this.token)

    if (this.token != "") {
      this.consultarInformacionMiPerfilConfa( this.token) 
      this.rutaMiPerfil=`${environment.perfilConfa}${this.token}`+'/'+3;
      console.log( this.rutaMiPerfil);
   }else{
    this.logout();
   }

  }
 
  ngOnInit() {
  }
  
  consultarInformacionMiPerfilConfa(token) {
    this.utilitiesService.loading = true;
    this.authenticationService.miPerfil(token).pipe(first())
      .subscribe((response: MiPerfilConfa) => {
       
        if(response.tipoUsuario=="A"){
          const miDiv = document.getElementById("miDiv");
          miDiv.style.paddingBottom= "85%";
        }else{
          const miDiv = document.getElementById("miDiv");
          miDiv.style.paddingBottom= "68%";
        }
        this.utilitiesService.loading = false;
      });

  }
 logout() {
  this.utilitiesService.loading = true;
  setTimeout(() => {
    this.authenticationService.logout();
    this.utilitiesService.currentUser = null;
    this.router.navigate(['/login']);
    this.utilitiesService.loading = false;
    console.log('4');
  }, 500);
}

goHome() {
  this.utilitiesService.loading = true;
  setTimeout(() => {
    this.utilitiesService.loading = false;
    this.router.navigate(['/validar-rostro']);
  }, 500);
}


}

