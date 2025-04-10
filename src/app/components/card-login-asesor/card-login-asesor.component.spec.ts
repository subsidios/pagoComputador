import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardLoginAsesorComponent } from './card-login-asesor.component';

describe('CardLoginAsesorComponent', () => {
  let component: CardLoginAsesorComponent;
  let fixture: ComponentFixture<CardLoginAsesorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardLoginAsesorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardLoginAsesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
