import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResdidentDetailComponent } from './resdident-detail.component';

describe('ResdidentDetailComponent', () => {
  let component: ResdidentDetailComponent;
  let fixture: ComponentFixture<ResdidentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResdidentDetailComponent]
    });
    fixture = TestBed.createComponent(ResdidentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
