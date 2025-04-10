import { Component } from '@angular/core';

import { UtilitiesService } from './services/utilities.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    public utilitiesService: UtilitiesService
  ) {

  }

  onActivate(event: any) {
    window.scrollTo(0,0);
  }
}
