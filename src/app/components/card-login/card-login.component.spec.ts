import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardLoginComponent } from './card-login.component';

describe('CardLoginComponent', () => {
  let component: CardLoginComponent;
  let fixture: ComponentFixture<CardLoginComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
