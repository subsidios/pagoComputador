import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MiPerfilConfaComponent } from './mi-perfil-confa.component';

describe('MiPerfilConfaComponent', () => {
  let component: MiPerfilConfaComponent;
  let fixture: ComponentFixture<MiPerfilConfaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MiPerfilConfaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiPerfilConfaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
