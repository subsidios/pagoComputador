import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConsultarPersonaComponent } from './consultar-persona.component';

describe('ConsultarPersonaComponent', () => {
  let component: ConsultarPersonaComponent;
  let fixture: ComponentFixture<ConsultarPersonaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultarPersonaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
