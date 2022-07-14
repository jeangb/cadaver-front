import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InprogressComponent } from './inprogress.component';

describe('InprogressComponent', () => {
  let component: InprogressComponent;
  let fixture: ComponentFixture<InprogressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InprogressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InprogressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
