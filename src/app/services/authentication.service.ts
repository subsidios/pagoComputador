import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map, timeout } from "rxjs/operators";
import { CookieService } from "ngx-cookie-service";

import { environment } from "src/environments/environment";
import {
  User,
  Token,
  UserRegister,
  RememberPassword,
  ServiceVerification,
  ValidateQuestion,
  Session,
  MiPerfilConfa,
} from "../interfaces/user.interface";


import { Md5 } from "ts-md5/dist/md5";
import { UtilitiesService } from "./utilities.service";
import { InfoPago } from '../interfaces/pago.interface';
import { RespuestaIniciarTransaccion } from "../interfaces/respuestaIniciarTransaccion.interface";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  private genericTokenSubject: BehaviorSubject<Token>;
  public genericToken: Observable<Token>;
  private currentTokenSubject: BehaviorSubject<Token>;
  public currentToken: Observable<Token>;
  private circularTokenSubject: BehaviorSubject<Token>;
  public circularToken: Observable<Token>;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private utilitiesService: UtilitiesService
  ) {
    this.loadTokens();
  }

  private loadTokens() {
    let gtoken =
      this.cookieService.get("gtoken") !== ""
        ? JSON.parse(this.cookieService.get("gtoken"))
        : "";
    this.genericTokenSubject = new BehaviorSubject<Token>(gtoken);
    this.genericToken = this.genericTokenSubject.asObservable();

    let ptoken =
      this.cookieService.get("ptoken") !== ""
        ? JSON.parse(this.cookieService.get("ptoken"))
        : "";
    this.currentTokenSubject = new BehaviorSubject<Token>(ptoken);
    this.currentToken = this.currentTokenSubject.asObservable();

    let ctoken =
      this.cookieService.get("ctoken") !== ""
        ? JSON.parse(this.cookieService.get("ctoken"))
        : "";
    this.circularTokenSubject = new BehaviorSubject<Token>(ctoken);
    this.circularToken = this.circularTokenSubject.asObservable();
  }

  public get genericTokenValue(): Token {
    return this.genericTokenSubject.value;
  }

  public get currentTokenValue(): Token {
    return this.currentTokenSubject.value;
  }

  public get circularTokenValue(): Token {
    return this.circularTokenSubject.value;
  }

  private getQueryPago(query: string, bodyContent: any) {
    const url = `${environment.apiConsultaInfo}${query}`;
    const body = bodyContent;
    return this.http.post(url, body);
  }

  private getQuery(query: string, bodyContent: any) {
    const url = `${environment.apiIngresoConfa}${query}`;
    const body = bodyContent;
    return this.http.post(url, body);
  }

  private getQueryToken(query: string, bodyContent: any) {
    const url = `${environment.identificacionFacial}${query}`;
    const body = bodyContent;
    console.log(url);
    console.log(body);
    const timeoutDuration = 5000; // Tiempo de espera de 5 segundos
    return this.http.post(url, body).pipe(timeout(timeoutDuration));
  }

  private identificar2(query: string, bodyContent: any) {
    const url = `${environment.identificacionFacial}${query}`;
    const body = bodyContent;

    return this.http.post(url, body);
  }

  getToken(document: string, password: string) {
    let bodyToken = {
      parametro1: "" + Md5.hashStr(document.toString()),
      parametro2: "" + password,
      // parametro3: "Web",
    };

    return (
      this.getQuery("auth", bodyToken)
        // return this.http.get('assets/data/token.json')
        .pipe(
          map((response: Token) => {
            if (response.token) {
              this.cookieService.set(
                "ptoken",
                JSON.stringify(response),
                1,
                "/",
                undefined,
                false,
                "Strict"
              );
              this.currentTokenSubject.next(response);
            }
            return response;
          })
        )
    );
  }

  getGenericToken() {
    let genericToken = {
      // "parametro1": "hlZTM4ZDcwNDRlODcyNzZDX1BPUlQqMjAxOCQ=",
      // "parametro2": "UG9ydGFsX0NvbmZhODRkZGZiMzQxMjZmYzNhND",
      parametro1: `${environment.parametro1}`,
      parametro2: `${environment.parametro2}`,
      parametro3: "Web",
    };

    return this.getQuery("auth", genericToken).pipe(
      map((response: Token) => {
        // console.log('gtoken',response.token)
        if (response.token) {
          this.cookieService.set(
            "gtoken",
            JSON.stringify(response),
            1,
            "/",
            undefined,
            false,
            "Strict"
          );
          this.genericTokenSubject.next(response);
        }
        return response;
      })
    );
  }

  getAsesorToken(user: String) {
    let asesorToken = {
      parametro1: user,
    };

    return this.getQueryToken("metodo25", asesorToken).pipe(
      map((response: Token) => {
        if (response.token) {
          console.log(response.token);
          this.cookieService.set(
            "atoken",
            response.token,
            1,
            "/",
            undefined,
            false,
            "Strict"
          );
          this.genericTokenSubject.next(response);
        }
        return response;
      })
    );
  }

  /*  private getQueryPOST(query: string, bodyContent: any) {
		const url = `${ environment.apiCircular }${ query }`;
		const body = bodyContent;

		return this.http.post(url, body);
	  }

	getGenericTokenC() {
		let genericToken = {
			parametro1: environment.param1,
			parametro2: environment.param2
		};

		return this.getQueryPOST("auth", genericToken).pipe(
			map((response: Token) => {
				if (response.token) {
					this.cookieService.set("ctoken", JSON.stringify(response), 1, "/", undefined, false, "Strict");
					this.circularTokenSubject.next(response);
				}
				return response;
			})
		);
	} */

  // Login por usuario y contraseña
  // login(document: number, password: string) {
  //   let bodyValidate = {
  //     "documento": document.toString(),
  //     "clave": password.toString()
  //   }

  //   return this.getQuery('confa/metodo11', bodyValidate)
  //   // return this.http.get('assets/data/user.json')
  //     .pipe(map((response: User) => {
  //       return response;
  //     }));
  // }

  // Login por token
  login(token: string) {
    let bodyValidate = {
      token: token.toString(),
    };

    return (
      this.getQuery("confa/metodo23", bodyValidate)
        // return this.http.get('assets/data/user.json')
        .pipe(
          map((response: User) => {
            return response;
          })
        )
    );
  }

  loginNew(token: string) {
    let bodyValidate = {
      token: token.toString(),
    };

    return (
      this.getQuery("confa/metodo28", bodyValidate)
        // return this.http.get('assets/data/user.json')
        .pipe(
          map((response: Session) => {
            // console.log(response)
            return response;
          })
        )
    );
  }
  loginCredenciales(document: number, password: string) {
    let bodyValidate = {
      documento: document.toString(),
      clave: password.toString(),
    };

		return this.getQuery('confa/metodo132', bodyValidate)
			/*  return this.http.get('assets/data/user.json') */
			.pipe(map((response: Session) => {
				return response;
			}));
	}

  

  logout() {
    // remove user from local storage to log user out
    // eliminar el usuario del almacenamiento local para cerrar la sesión del usuario
    this.cookieService.delete("gtoken");
    this.cookieService.delete("ptoken");
    this.cookieService.delete("ctoken");
    this.cookieService.delete("atoken");
    this.cookieService.deleteAll();
    localStorage.removeItem("gtoken");
    localStorage.removeItem("ptoken");
    localStorage.removeItem("ctoken");
    localStorage.removeItem("atoken");
    localStorage.removeItem("user");
    localStorage.removeItem("userOrCompany");

    this.currentTokenSubject.next(null);
    this.genericTokenSubject.next(null);
    this.circularTokenSubject.next(null);

    this.utilitiesService.currentUser = null;
  }

  consultUserInformationNASFA(document: number) {
    let bodyUser = {
      documento: document.toString(),
    };

    return this.getQuery("confa/metodo1", bodyUser).pipe(
      map((response) => {
        return response["usuario"];
      })
    );
  }
  consultUserInformationNASFANew(document: number) {
    let bodyUser = {
      documento: document.toString(),
    };

    return this.getQuery("confa/metodo33", bodyUser).pipe(
      map((response) => {
        return response["usuario"];
      })
    );
  }
  consultUserInformationINCONFA(document: number) {
    let bodyUser = {
      documento: document.toString(),
    };

    return this.getQuery("confa/metodo2", bodyUser).pipe(
      map((response) => {
        return response;
      })
    );
  }

  saveUser(userRegister: UserRegister) {
    return this.getQuery("confa/metodo12", userRegister).pipe(
      map((response) => {
        return response["respuesta"];
      })
    );
  }

  saveUserRegister(userRegister: UserRegister) {
		return this.getQuery("confa/metodo129", userRegister).pipe(
			map((response) => {
				return response["respuesta"];
			})
		);
	}

  confirmUserRegistration(parametro: string) {
    let body = {
      parametro: parametro.toString(),
      correoMd5: "",
    };

    return this.getQuery("confa/metodo13", body).pipe(
      map((response) => {
        return response;
      })
    );
  }

  confirmUserRegistrationConfa(parametro: string) {
    let body = {
      parametro: parametro.toString(),
      correoMd5: "",
    };

		return this.getQuery("confa/metodo131", body).pipe(
			map((response) => {
				return response;
			})
		);
	}

  rememberPasswordDocumentUser(body: RememberPassword) {
    return this.getQuery("confa/metodo14", body).pipe(
      map((response) => {
        return response["respuesta"];
      })
    );
  }

  changePasswordNewUser(parametro: string, clave: string) {
    let body = {
      parametro: parametro.toString(),
      clave: clave.toString(),
      sistema: "CreditoDigital",
    };

    return this.getQuery("confa/metodo116", body).pipe(
      map((response) => {
        return response["respuesta"];
      })
    );
  }

  changePasswordOldUser(documento: string, clave: string) {
    /*  console.log("Entró change 2"); */
    let body = {
      documento: documento.toString(),
      clave: clave.toString(),
      sistema: "CreditoDigital",
    };

    return this.getQuery("confa/metodo15", body).pipe(
      map((response) => {
        /*  console.log("respuesta", response) */
        return response["respuesta"];
      })
    );
  }

  validateToken(token: string) {
    let bodyValidateToken = {
      token: token.toString(),
    };

    return this.getQuery("validarToken", bodyValidateToken).pipe(
      map((response) => {
        return response;
      })
    );
  }
  consultarIp() {
    const url = environment.consultarIp;
    let response = this.http.post(url, "");
    return response;
  }

  identificacionFacial(body: any) {
    const url = environment.identificacionFacial + "metodo1";
    let bodyContent = {
      documento: body.documento,
      servicio: 2,
      sede: 28,
      ip: body.ip,
      usuarioRed: "portal",
      tipoTransaccion: "U",
      tipoValidacion: "FACIALSMS",
      canalValidacion: "C",
      celularWhatsapp: "+573003046351",
      imagen: body.image,
    };
    let response = this.http.post(url, bodyContent);
    return response;
  }

  rutaDcaRedireccion(body: any) {
    // const headers = new HttpHeaders({
    //   usuario: "ext_diegom",
    // });
    const url = environment.rutaRedireccionDca;
    let response = this.http.post(url, body);
    return response;
  }

  rutaDcaRedireccionAsesor(body: any) {
    const url = environment.rutaRedireccionDcaAsesor;
    let response = this.http.post(url, body);
    return response;
  }

  /////// consultar disponibilidad de la plataforma///
  private getQuery1(query: string) {
    const url = `${environment.apiCreditos}${query}`;
    return this.http.get(url);
  }

  getEnableConsumerModule() {
    return this.getQuery1(`verificacionServicio`).pipe(
      map((response: ServiceVerification) => {
        return response;
      })
    );
  }

  //////
  guardatTipoDoc(body) {
    // return this.getQuery("confa/metodo22", body).pipe(
    //   map((response) => {
    //     console.log("respuesta" + response);
    //     return response;
    //   })
    // );
    let url = environment.apiIngresoConfa + "confa/metodo22";
    return this.http.post(url, body);
  }

  // consultarImg(img: String) {
  //   const url = environment.aws;
  //   const body = {
  //     idCollection: "CONFA",
  //     imageBase64: img,
  //   };
  //   //console.log("cconsumoo", this.http.post(url, body));
  //   let response = this.http.post(url, body);
  //   return response;
  // }

  // loginLight(bodyLight: any) {
  //   let genericToken = {
  //     "parametro1": "hlZTM4ZDcwNDRlODcyNzZDX1BPUlQqMjAxOCQ=",
  //     "parametro2": "UG9ydGFsX0NvbmZhODRkZGZiMzQxMjZmYzNhND",
  //     "parametro3": "Web"
  //   }

  //   return this.getQuery('auth', genericToken)
  //     .pipe(map((response: Token) => {
  //       if(response.token) {

  //       }
  //       return response;
  //     }));
  // }

  // METODOS IMPLEMENTADOS PARA MI PERFIL CONFA========================================================================

  miPerfil(token: string) {
    let bodyValidate = {
      token: token.toString(),
    };

    return (
      this.getQuery("confa/metodo30", bodyValidate)
        // return this.http.get('assets/data/user.json')
        .pipe(
          map((response: MiPerfilConfa) => {
            // console.log(response)
            return response;
          })
        )
    );
  }
  /* Metodo que valida la respuesta de validacion, cuantos intentos lleva, bloquea usuario si son mas 3 intentos */
  validateQuestion(documento: string, validacion: boolean, momento: string) {
    let bodyValidateQuestion = {
      documento: documento.toString(),
      respuestas: validacion,
      momento: momento,
    };

    /* 	console.log(bodyValidateQuestion) */

    return this.getQuery("confa/metodo24", bodyValidateQuestion).pipe(
      map((response: ValidateQuestion) => {
        return response;
      })
    );
  }

  /* Metodo que consulta si el usuario esta bloqueado en ingreso confa. */
  consultarBloqueoUsuario(documento: string) {
    let bodyValidateQuestion = {
      documento: documento.toString(),
    };

    return this.getQuery("confa/metodo25", bodyValidateQuestion).pipe(
      map((response) => {
        return response["respuesta"];
      })
    );
  }
  actualizarDatos(body: any) {
    return this.getQuery("confa/metodo22", body).pipe(
      map((response) => {
        return response;
      })
    );
  }
  /* Metodo que consulta si el usuario tiene permiso para ingresar al servicio. Se tienen restricciones de edad para algunos servicios */
  validarPermisoPorEdad(documento: string) {
    let bodyValidate = {
      documento: documento,
      servicio: `${environment.servicio}`,
    };
    return this.getQuery("confa/metodo27", bodyValidate).pipe(
      map((response: any) => {
        // console.log(response)
        return response["respuesta"];
      })
    );
  }

  validarToken(token: string): Observable<boolean> {
    const body = { token };
    const url = `${environment.identificacionFacial}`;
    return this.http.post<boolean>(url + "/metodo26", body);
  }

  loginCredencialesPago(documentTrabajador: number, documentPersonaCargo: number, radicado: string) {
    let bodyValidate = {
      documentoTrabajador: documentTrabajador.toString(),
      documentoPersonaCargo: documentPersonaCargo.toString(),
      numeroRadicado: radicado.toString(),
    };

		return this.getQueryPago('pagoSubsidioEspecie/metodo1', bodyValidate)
			/*  return this.http.get('assets/data/user.json') */
			.pipe(map((response: InfoPago) => {
				return response;
			}));
	}

  IniciarTransaccionPayZen(bodyValidate: any) {

		return this.getQueryPago('pagoSubsidioEspecie/metodo2', bodyValidate)
			/*  return this.http.get('assets/data/user.json') */
			.pipe(map((response: RespuestaIniciarTransaccion) => {
				return response;
			}));
	}

  verificarTransaccionPayZen(productoId: string) {
    let bodyValidate = {
      identificadorProducto: productoId.toString(),
    };

		return this.getQueryPago('pagoSubsidioEspecie/metodo3', bodyValidate)
			/*  return this.http.get('assets/data/user.json') */
			.pipe(map((response: any) => {
        console.log(response);
				return response;
			}));
	}
}
