import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoginAsesorComponent } from './login-asesor.component';

describe('LoginAsesorComponent', () => {
  let component: LoginAsesorComponent;
  let fixture: ComponentFixture<LoginAsesorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginAsesorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginAsesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
