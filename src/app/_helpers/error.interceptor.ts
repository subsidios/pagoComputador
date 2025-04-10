import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { UtilitiesService } from "src/app/services/utilities.service";

import { AuthenticationService } from "../services/authentication.service";
declare var $;

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    public utilitiesService: UtilitiesService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        console.log(err);
        if (err.status === 401) {
          // auto logout if 401 response returned from api
          // cierre de sesión automático si se devuelve la respuesta 401 de la api
          this.authenticationService.logout();
          location.reload();
        } else {
          this.utilitiesService.loading = false;
          this.utilitiesService.messageTitleModal = "Error del servicio";
          this.utilitiesService.messageModal =
            "Apreciado usuario, nos encontramos presentando fallas técnicas. Por favor intenta más tarde";
          $(".btn-modal-warning").click();

          setTimeout(() => {
            this.authenticationService.logout();
            location.reload();
          }, 5000);
        }

        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
