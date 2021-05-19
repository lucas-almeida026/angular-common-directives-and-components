import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcdncComponent } from './acdnc.component';

describe('AcdncComponent', () => {
  let component: AcdncComponent;
  let fixture: ComponentFixture<AcdncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcdncComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcdncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
