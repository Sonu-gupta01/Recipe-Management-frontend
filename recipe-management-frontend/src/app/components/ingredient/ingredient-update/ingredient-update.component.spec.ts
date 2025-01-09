import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientUpdateComponent } from './ingredient-update.component';

describe('IngredientUpdateComponent', () => {
  let component: IngredientUpdateComponent;
  let fixture: ComponentFixture<IngredientUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IngredientUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
