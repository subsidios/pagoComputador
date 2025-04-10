import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

interface ErrorValidate {
  [s: string]: boolean
}

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  constructor() { }

  selectOptionZero(control: FormControl): ErrorValidate {
    if(control.value.toLowerCase() === '0') {
      return {
        optionZero: true
      }
    }
    else {
      return null;
    }
  }

  passwordsEquals(password1: string, password2: string) {
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.controls[password1];
      const pass2Control = formGroup.controls[password2];

      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null);
      }
      else {
        pass2Control.setErrors({ noEquals: true });
      }
    }
  }

  emailsEquals(email1: string, email2: string) {
    return (formGroup: FormGroup) => {
      const email1Control = formGroup.controls[email1];
      const email2Control = formGroup.controls[email2];

      if(email1Control.value === email2Control.value) {
        email2Control.setErrors(null);
      }
      else {
        email2Control.setErrors({ noEquals: true });
      }
    }
  }

  aceptHabeasData(control: FormControl): ErrorValidate {
      if(!control.value) {
        return {
          valueFalse: true
        }
      }
      else {
        return null;
      }
    }
}
