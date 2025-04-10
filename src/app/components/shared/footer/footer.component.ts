import { Component, OnInit } from '@angular/core';

import { AttentionService } from '../../../services/attention.service';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(
    public attentionService: AttentionService,
    public utilitiesService: UtilitiesService
  ) { }

  ngOnInit() {
  }

}
