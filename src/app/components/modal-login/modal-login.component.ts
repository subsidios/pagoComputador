import { Component, OnInit } from '@angular/core';

import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-modal-login',
  templateUrl: './modal-login.component.html',
  styleUrls: ['./modal-login.component.css']
})
export class ModalLoginComponent implements OnInit {
/* 
  formLoginEmitter: FormGroup;
  formForgotPasswordEmitter: FormGroup;
  formValidateEmitter: FormGroup;
 */
  constructor() { }

  ngOnInit() {
  }
/* 
  processFormLogin(formLogin: FormGroup) {
    this.formLoginEmitter = formLogin;
    formLogin.reset({
      document: '',
      password: ''
    });
  }

  processFormForgotPassword(formForgotPassword: FormGroup) {
    this.formForgotPasswordEmitter = formForgotPassword;
    formForgotPassword.reset({
      document: ''
    });
  }

  processFormValidate(formValidate: FormGroup) {
    this.formValidateEmitter = formValidate;
    formValidate.reset({
      document: ''
    });
  }

  cleanForm() {
    this.processFormLogin(this.formLoginEmitter);
    this.processFormForgotPassword(this.formForgotPasswordEmitter);
    this.processFormValidate(this.formValidateEmitter);
  }
 */
}
