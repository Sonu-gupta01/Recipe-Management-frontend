import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingCreateComponent } from './rating-create.component';

describe('RatingCreateComponent', () => {
  let component: RatingCreateComponent;
  let fixture: ComponentFixture<RatingCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RatingCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
