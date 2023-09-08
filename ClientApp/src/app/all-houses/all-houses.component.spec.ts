import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllHousesComponent } from './all-houses.component';

describe('AllHousesComponent', () => {
  let component: AllHousesComponent;
  let fixture: ComponentFixture<AllHousesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllHousesComponent]
    });
    fixture = TestBed.createComponent(AllHousesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
