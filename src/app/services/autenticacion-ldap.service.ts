import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import * as CryptoJS from "crypto-js";
import { ConfaCryptoService } from "./confa-crypto.service";
import { Md5 } from "ts-md5";

@Injectable({
  providedIn: "root",
})
export class AutenticacionLDAPService {
  constructor(private http: HttpClient, private crypto: ConfaCryptoService) {}
  //getQuery GET para conexion con LDAP
  private getQuery(query: string) {
    const url = `${environment.apiLDAP}${query}`;
    return this.http.get(url);
  }
  //getQuery POST para conexion con apicredito Consumo
  private getQueryPost(query: string, bodyContent: any) {
    const url = `${environment.identificacionFacial}${query}`;
    const body = bodyContent;
    return this.http.post(url, body);
  }
  //Login LDAP directamente desde angular
  validateUserPass(user: string, pass: string) {
    let text: string = user + "|" + pass;
    let encriptado = this.base64ToHex(this.cifrarUserPass(text));
    return this.getQuery("Class00/meth01?args0=" + encriptado);
  }
  //LDAP trae atributos de la persona
  validateUser(user: String, atributo: String) {
    let text: string = user + "|" + atributo;
    let textoEncriptado = this.base64ToHex(this.cifrarUserPass(text));
    return this.getQuery("Class00/meth02?args0=" + textoEncriptado);
  }
  //WS credito Consumo
  //Valida si se logueo bien y trae informacion de la persona (entra como parametro la respuesta desde el logueo (LDAP) de angular)
  validarUsuario(user: string, pass: string) {
    let body = {
      parametro1: this.cifrarUserPass(user),
      parametro2: pass,
    };
    return this.getQueryPost("metodo5", body);
  }
  //Login interno credito ConsumoWS - Metodo encargado de realizar logueo por LDAP, Validar atributos del usuario interno.
  validarUsuarioInterno(user: string, pass: string) {
    let body = {
      parametro1: this.cifrarUserPass(user),
      parametro2: this.cifrarUserPass(pass),
    };
    return this.getQueryPost("metodo24", body);
  }
  // Metodo encargado de cifrar AES
  cifrarUserPass(text: string) {
    var key = CryptoJS.enc.Utf8.parse(environment.k);
    var iv = CryptoJS.enc.Utf8.parse(environment.i);
    var encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(text.toString()),
      key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return encrypted.toString();
  }
  //Metodo encargado de convertir  base 64 a Hexadecimal
  base64ToHex(str) {
    const raw = atob(str);
    let result = "";
    for (let i = 0; i < raw.length; i++) {
      const hex = raw.charCodeAt(i).toString(16);
      result += hex.length === 2 ? hex : "0" + hex;
    }
    return result.toUpperCase();
  }

  validarDocumentoReconocido(documento: string) {
    let body = {
      document: documento,
    };
    return this.getQueryPost("metodo7", body);
  }
  validarRostroLDAP(imagen: string) {
    let body = {
      imgdata: imagen,
    };
    return this.getQueryPost("metodo8", body);
  }

  //Validacion si la persona tiene facial
  validarFacialPersona(documento: string) {
    let body = {
      documento: documento.toString(),
    };
    return this.getQueryPost("metodo18", body);
  }

  //Login interno credito ConsumoWS - Metodo encargado de realizar logueo por LDAP, Validar atributos del usuario interno.
  validarUsuarioInternoLogueo(token: string) {
    let body = {
      parametro1: token,
    };
    return this.getQueryPost("metodo27", body);
  }

  validarUsuarioInternoLogueoV2(token: string) {
    let body = {
      parametro1: token,
    };
    return this.getQueryPost("metodo26", body);
  }
}
