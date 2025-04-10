import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";

import { AuthenticationService } from "../services/authentication.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    // añadir la cabecera de autorización con el token jwt si está disponible

    let genericToken = this.authenticationService.genericTokenValue;
    let currentToken = this.authenticationService.currentTokenValue;
    let circularToken = this.authenticationService.circularTokenValue;

    if(request.url.includes("circular007")){
      if(circularToken){
       /*  console.log("REspuesta de validate",this.validateTokenCircular(circularToken.token))
        if(this.validateTokenCircular(circularToken.token)){ */
          console.log("Request si V",request)
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${ circularToken.token }`
            }
          });
        /* }else{
          this.authenticationService.getGenericTokenC().pipe(first())
          .subscribe((tokenC: Token) => {
            console.log("Request no V",request)
            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${ tokenC.token }`
              }
            });

          });
           
        } */
        
      }
    }else{
    //console.log(request);
    if (currentToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentToken.token}`,
        },
      });
    }

    if (genericToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${genericToken.token}`,
        },
      });
    }
  }

    return next.handle(request);
  }
}
