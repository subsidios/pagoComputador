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
  selector: "app-camera",
  templateUrl: "./camera.component.html",
  styleUrls: ["./camera.component.css"],
})
export class CameraComponent implements OnInit {
  public width: number;
  public height: number;
  permiso: Boolean;
  documento: string;

  constructor(
    public utilitiesService: UtilitiesService,
    private authenticationService: AuthenticationService,
    private cookieService: CookieService
  ) {
    this.utilitiesService.loading = true;
    let ptoken =
      this.cookieService.get("ptoken") !== ""
        ? JSON.parse(this.cookieService.get("ptoken"))
        : "";
    let cc =
      localStorage.getItem("cc") !== ""
        ? JSON.parse(localStorage.getItem("cc"))
        : null;
    if (ptoken != "") {
      if (cc == null) {
        this.authenticationService
          .loginNew(ptoken.token)
          .pipe(first())
          .subscribe((response: Session) => {
            if (response.usuario.existeUsuario) {
              localStorage.setItem("cc", response.usuario.documento);
              this.consultarPermisoPorEdad(response.usuario.documento);
              this.documento = response.usuario.documento;
              this.utilitiesService.loading = false;
            }
          });
      } else {
        this.documento = localStorage.getItem("cc");
        this.consultarPermisoPorEdad(localStorage.getItem("cc"));
        this.utilitiesService.loading = false;
      }
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
  consultarPermisoPorEdad(documento: string) {
    this.authenticationService
      .validarPermisoPorEdad(documento)
      .pipe(first())
      .subscribe((response: Boolean) => {
        this.permiso = response;
        this.utilitiesService.loading = false;
      });
  }
}
