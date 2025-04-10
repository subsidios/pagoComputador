import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CameraAsesorComponent } from './camera-asesor.component';

describe('CameraAsesorComponent', () => {
  let component: CameraAsesorComponent;
  let fixture: ComponentFixture<CameraAsesorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CameraAsesorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraAsesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
