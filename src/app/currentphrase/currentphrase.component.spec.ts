import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentphraseComponent } from './currentphrase.component';

describe('CurrentphraseComponent', () => {
  let component: CurrentphraseComponent;
  let fixture: ComponentFixture<CurrentphraseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentphraseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentphraseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
