import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class ConfaCryptoService {
  title = 'EncryptionDecryptionSample';

  plainText:string;
  encryptText: string;
  encPassword: string="SANDRAFORERO";
  decPassword:string;
  conversionEncryptOutput: string;
  conversionDecryptOutput:string;


  key;
	//private $iv  = '2db11d27194a3751';
	cipher;
	ivlen;
	iv;
	tag;

  constructor() {

   this.cipher = "rijndael-128";
		this.tag = "cbc";
		this.key = '9b1c0e0eb1b5e6b9';
		//$this->ivlen = openssl_cipher_iv_length($this->cipher);
		//$this->iv = openssl_random_pseudo_bytes($this->ivlen);
		this.iv = '2db11d27194a3751';
  }


   //method is used to encrypt and decrypt the text
   encrypt(user:string,pass:string) {

      this.conversionEncryptOutput = CryptoJS.AES.encrypt(user+"|"+pass, this.encPassword.trim()).toString();
    return this.conversionEncryptOutput;

    }

    decrypt(encryptText:string) {
      this.conversionDecryptOutput = CryptoJS.AES.decrypt(encryptText.trim(), this.decPassword.trim()).toString(CryptoJS.enc.Utf8);
     return   this.conversionDecryptOutput;

    }



    encryptConfa(){

    }
/*
    ssl_encrypt(srt:any) {
      let str = this.pkcs5_pad(srt);
      if (in_array(cipher, openssl_get_cipher_methods()))
      {
        $encryptSSL = openssl_encrypt($str, $this->cipher, $this->key, $options = 0, $this->iv );
        return bin2hex($encryptSSL);
      }
    }
    pkcs5_pad (text) {
      let blocksize = 16;
      let pad = blocksize - ((text.length) % blocksize);	//---
      return text . str_repeat(String.fromCharCode(pad), pad);//---
    }

    encriptarConfa(str) {
      str = this.pkcs5_pad(str);
      let iv = this.iv;
      let td = @mcrypt_module_open('rijndael-128', '', 'cbc', $iv);
      @mcrypt_generic_init($td, $this->key, $iv);
      $encrypted = @mcrypt_generic($td, $str);
      @mcrypt_generic_deinit($td);
      @mcrypt_module_close($td);
      return bin2hex($encrypted);
    } */

}
