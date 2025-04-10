import { Component, OnInit } from "@angular/core";

import { PoliciesService } from "../../services/policies.service";

@Component({
  selector: "app-modal-policies",
  templateUrl: "./modal-policies.component.html",
  styleUrls: ["./modal-policies.component.css"],
})
export class ModalPoliciesComponent implements OnInit {
  constructor(public policiesService: PoliciesService) {}

  ngOnInit() {}
}
