import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  HostListener,
  Input,
} from "@angular/core";
import { Subject } from "rxjs";
import { Observable } from "rxjs";
import { WebcamImage, WebcamInitError, WebcamUtil } from "ngx-webcam";
import { UtilitiesService } from "src/app/services/utilities.service";
import { AuthenticationService } from "src/app/services/authentication.service";
import { CookieService } from "ngx-cookie-service";
import { first } from "rxjs/operators";
import { Session } from "src/app/interfaces/user.interface";

@Component({
  selector: "app-camera-asesor",
  templateUrl: "./camera-asesor.component.html",
  styleUrls: ["./camera-asesor.component.css"],
})
export class CameraAsesorComponent implements OnInit {
  public width: number;
  public height: number;
  permiso: Boolean;
  documento: string;
  @Input() mostrarBoton: boolean = false;

  constructor(
    public utilitiesService: UtilitiesService,
    private authenticationService: AuthenticationService,
    private cookieService: CookieService
  ) {
    this.utilitiesService.loading = true;
    let atoken =
      this.cookieService.get("atoken") !== ""
        ? this.cookieService.get("atoken")
        : "";
    let cc =
      localStorage.getItem("cc") !== ""
        ? JSON.parse(localStorage.getItem("cc"))
        : null;
    if (atoken != "") {
      this.utilitiesService.loading = false;
    }

    this.onResize();
  }

  @HostListener("window:resize", ["$event"])
  onResize(event?: Event) {
    const win = !!event ? (event.target as Window) : window;
    if (win.innerWidth < 768) {
      this.width = win.innerWidth - 20;
      this.height = win.innerHeight - 20;
    } else {
      this.width = win.innerWidth / 2;
      this.height = win.innerHeight / 2;
    }
  }

  @Output()
  public pictureTaken = new EventEmitter<WebcamImage>();
  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();
  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      }
    );
  }
  public triggerSnapshot(): void {
    this.trigger.next();
  }
  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }
  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }
  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }
  public handleImage(webcamImage: WebcamImage): void {
    //console.info("received webcam image", webcamImage);
    this.pictureTaken.emit(webcamImage);
  }
  public cameraWasSwitched(deviceId: string): void {
    // console.log("active device: " + deviceId);
    this.deviceId = deviceId;
  }
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
}
