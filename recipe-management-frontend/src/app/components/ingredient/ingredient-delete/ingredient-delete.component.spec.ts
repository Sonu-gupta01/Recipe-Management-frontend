import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientDeleteComponent } from './ingredient-delete.component';

describe('IngredientDeleteComponent', () => {
  let component: IngredientDeleteComponent;
  let fixture: ComponentFixture<IngredientDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IngredientDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
