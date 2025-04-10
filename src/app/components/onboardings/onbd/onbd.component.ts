import { Component, OnInit } from "@angular/core";
declare var $;

@Component({
  selector: "app-onbd",
  templateUrl: "./onbd.component.html",
  styleUrls: ["./onbd.component.css"],
})
export class OnbdComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    $(".btn-modal-videoPrevio").click();
  }
  
  closeModal() {
    console.log("Entro en video");
    var videoFrame = document.getElementById("videoFrame");

    // Detener el video

    // O eliminar el iframe
    videoFrame.parentNode.removeChild(videoFrame);
  }
}
