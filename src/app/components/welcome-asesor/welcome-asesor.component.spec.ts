import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WelcomeAsesorComponent } from './welcome-asesor.component';

describe('WelcomeAsesorComponent', () => {
  let component: WelcomeAsesorComponent;
  let fixture: ComponentFixture<WelcomeAsesorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeAsesorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeAsesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
