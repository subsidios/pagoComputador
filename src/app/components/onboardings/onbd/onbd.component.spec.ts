import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OnbdComponent } from './onbd.component';

describe('OnbdComponent', () => {
  let component: OnbdComponent;
  let fixture: ComponentFixture<OnbdComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OnbdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnbdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
