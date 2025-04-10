import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FaceRecognitionComponent } from './face-recognition.component';

describe('FaceRecognitionComponent', () => {
  let component: FaceRecognitionComponent;
  let fixture: ComponentFixture<FaceRecognitionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FaceRecognitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaceRecognitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
