import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FakeloginComponent } from './fakelogin.component';

describe('FakeloginComponent', () => {
  let component: FakeloginComponent;
  let fixture: ComponentFixture<FakeloginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FakeloginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FakeloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
